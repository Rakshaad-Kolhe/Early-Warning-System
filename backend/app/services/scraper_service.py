"""
Scraper Service Integration
Integrates web scraping with the main application
"""
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import asyncio
from sqlalchemy.orm import Session
import logging

from ..scraper import HealthDataScraper, NewsSignalScraper
from ..database import SessionLocal
from ..models.outbreak_model import OutbreakData

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ScraperService:
    """Service for managing data scraping operations"""
    
    def __init__(self):
        self.health_scraper = HealthDataScraper()
        self.news_scraper = NewsSignalScraper()
        self.last_scrape_time = None
        self.scrape_interval = timedelta(hours=6)  # Scrape every 6 hours
    
    def should_scrape(self) -> bool:
        """Check if it's time to scrape again"""
        if self.last_scrape_time is None:
            return True
        return datetime.now() - self.last_scrape_time > self.scrape_interval
    
    async def scrape_health_data(self) -> List[Dict]:
        """Scrape health outbreak data"""
        try:
            logger.info("Starting health data scraping...")
            data = await self.health_scraper.scrape_all_sources()
            self.last_scrape_time = datetime.now()
            logger.info(f"Successfully scraped {len(data)} health records")
            return data
        except Exception as e:
            logger.error(f"Error scraping health data: {e}")
            return []
    
    def scrape_news_signals(self, location: str = 'India') -> List[Dict]:
        """Scrape news signals"""
        try:
            logger.info(f"Scraping news signals for {location}...")
            signals = self.news_scraper.scrape_news_signals(location)
            logger.info(f"Successfully scraped {len(signals)} news signals")
            return signals
        except Exception as e:
            logger.error(f"Error scraping news signals: {e}")
            return []
    
    def store_scraped_data(self, data: List[Dict], db: Session):
        """Store scraped data in database"""
        stored_count = 0
        
        for item in data:
            try:
                # Check if already exists
                existing = db.query(OutbreakData).filter(
                    OutbreakData.title == item.get('title'),
                    OutbreakData.source == item.get('source')
                ).first()
                
                if not existing:
                    outbreak = OutbreakData(
                        title=item.get('title', 'Unknown'),
                        source=item.get('source', 'Unknown'),
                        location=item.get('location', 'Unknown'),
                        severity=item.get('severity', 'low'),
                        url=item.get('url', ''),
                        scraped_date=datetime.now(),
                        published_date=item.get('date', datetime.now().isoformat())
                    )
                    db.add(outbreak)
                    stored_count += 1
            except Exception as e:
                logger.error(f"Error storing outbreak data: {e}")
        
        db.commit()
        logger.info(f"Stored {stored_count} new outbreak records")
        return stored_count
    
    def get_recent_outbreaks(self, db: Session, days: int = 7) -> List[Dict]:
        """Get recent outbreak data from database"""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        outbreaks = db.query(OutbreakData).filter(
            OutbreakData.scraped_date >= cutoff_date
        ).order_by(OutbreakData.scraped_date.desc()).all()
        
        return [
            {
                'id': outbreak.id,
                'title': outbreak.title,
                'source': outbreak.source,
                'location': outbreak.location,
                'severity': outbreak.severity,
                'url': outbreak.url,
                'date': outbreak.published_date
            }
            for outbreak in outbreaks
        ]
    
    def aggregate_by_location(self, db: Session) -> Dict[str, int]:
        """Aggregate outbreak counts by location"""
        outbreaks = db.query(OutbreakData).all()
        
        location_counts = {}
        for outbreak in outbreaks:
            location = outbreak.location
            location_counts[location] = location_counts.get(location, 0) + 1
        
        return location_counts
    
    def get_severity_distribution(self, db: Session) -> Dict[str, int]:
        """Get distribution of outbreak severity"""
        outbreaks = db.query(OutbreakData).all()
        
        severity_counts = {'low': 0, 'medium': 0, 'high': 0}
        for outbreak in outbreaks:
            severity = outbreak.severity
            if severity in severity_counts:
                severity_counts[severity] += 1
        
        return severity_counts


# Background scraping task
async def background_scraper_task():
    """Background task to periodically scrape data"""
    service = ScraperService()
    
    while True:
        try:
            if service.should_scrape():
                logger.info("Running scheduled scraping task...")
                
                # Scrape health data
                health_data = await service.scrape_health_data()
                
                # Store in database
                db = SessionLocal()
                try:
                    service.store_scraped_data(health_data, db)
                finally:
                    db.close()
                
                logger.info("Scheduled scraping completed")
            
            # Wait before next check (1 hour)
            await asyncio.sleep(3600)
            
        except Exception as e:
            logger.error(f"Error in background scraper: {e}")
            await asyncio.sleep(3600)


# API endpoint helpers
def get_scraper_status(service: ScraperService) -> Dict:
    """Get scraper status information"""
    return {
        'last_scrape': service.last_scrape_time.isoformat() if service.last_scrape_time else None,
        'next_scrape': (service.last_scrape_time + service.scrape_interval).isoformat() 
                       if service.last_scrape_time else 'pending',
        'scrape_interval_hours': service.scrape_interval.total_seconds() / 3600,
        'status': 'active'
    }


def trigger_manual_scrape(service: ScraperService, db: Session) -> Dict:
    """Manually trigger a scraping operation"""
    try:
        # Run scraping
        data = asyncio.run(service.scrape_health_data())
        
        # Store data
        stored = service.store_scraped_data(data, db)
        
        return {
            'success': True,
            'scraped_count': len(data),
            'stored_count': stored,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Manual scrape failed: {e}")
        return {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }
