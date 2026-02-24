"""
Web Scraper for Health Data Collection
Scrapes disease outbreak data from various sources
"""
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import json
import re
from typing import List, Dict, Optional
import logging
from urllib.parse import urljoin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class HealthDataScraper:
    """Scrapes health and outbreak data from multiple sources"""
    
    def __init__(self):
        self.sources = {
            'who': 'https://www.who.int/emergencies/disease-outbreak-news',
            'cdc': 'https://www.cdc.gov/outbreaks/index.html',
            'ecdc': 'https://www.ecdc.europa.eu/en/threats-and-outbreaks',
        }
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
    async def fetch_page(self, session: aiohttp.ClientSession, url: str) -> Optional[str]:
        """Fetch a single page"""
        try:
            async with session.get(url, headers=self.headers, timeout=30) as response:
                if response.status == 200:
                    return await response.text()
                logger.warning(f"Failed to fetch {url}: Status {response.status}")
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
        return None
    
    def parse_who_data(self, html: str) -> List[Dict]:
        """Parse WHO disease outbreak news"""
        soup = BeautifulSoup(html, 'html.parser')
        outbreaks = []
        
        # Find outbreak articles
        articles = soup.find_all('article', class_='list-view')
        
        for article in articles[:10]:  # Limit to recent 10
            try:
                title_elem = article.find('h3') or article.find('h2')
                title = title_elem.get_text(strip=True) if title_elem else 'Unknown'
                
                date_elem = article.find('time') or article.find('span', class_='date')
                date_str = date_elem.get('datetime', '') if date_elem else ''
                
                link_elem = article.find('a', href=True)
                link = urljoin(self.sources['who'], link_elem['href']) if link_elem else ''
                
                # Extract location from title
                location = self._extract_location(title)
                
                outbreaks.append({
                    'source': 'WHO',
                    'title': title,
                    'date': date_str or datetime.now().isoformat(),
                    'location': location,
                    'url': link,
                    'severity': self._estimate_severity(title)
                })
            except Exception as e:
                logger.error(f"Error parsing WHO article: {e}")
                
        return outbreaks
    
    def parse_cdc_data(self, html: str) -> List[Dict]:
        """Parse CDC outbreak data"""
        soup = BeautifulSoup(html, 'html.parser')
        outbreaks = []
        
        # Find outbreak listings
        outbreak_items = soup.find_all(['div', 'li'], class_=re.compile('outbreak|alert'))
        
        for item in outbreak_items[:10]:
            try:
                title_elem = item.find(['h2', 'h3', 'h4', 'a'])
                title = title_elem.get_text(strip=True) if title_elem else 'Unknown'
                
                link_elem = item.find('a', href=True)
                link = urljoin(self.sources['cdc'], link_elem['href']) if link_elem else ''
                
                location = self._extract_location(title)
                
                outbreaks.append({
                    'source': 'CDC',
                    'title': title,
                    'date': datetime.now().isoformat(),
                    'location': location,
                    'url': link,
                    'severity': self._estimate_severity(title)
                })
            except Exception as e:
                logger.error(f"Error parsing CDC item: {e}")
                
        return outbreaks
    
    def _extract_location(self, text: str) -> str:
        """Extract location from text"""
        # Common location patterns
        countries = ['India', 'China', 'USA', 'UK', 'Brazil', 'Nigeria', 'Kenya', 
                    'South Africa', 'Australia', 'Japan', 'Germany', 'France']
        
        for country in countries:
            if country.lower() in text.lower():
                return country
                
        # Try to find state/city names
        location_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b'
        matches = re.findall(location_pattern, text)
        if matches:
            return matches[0]
            
        return 'Unknown'
    
    def _estimate_severity(self, text: str) -> str:
        """Estimate severity from text"""
        text_lower = text.lower()
        
        high_keywords = ['emergency', 'outbreak', 'epidemic', 'pandemic', 'critical', 
                        'severe', 'deaths', 'fatal']
        medium_keywords = ['alert', 'warning', 'increase', 'surge', 'cluster']
        
        if any(kw in text_lower for kw in high_keywords):
            return 'high'
        elif any(kw in text_lower for kw in medium_keywords):
            return 'medium'
        return 'low'
    
    async def scrape_all_sources(self) -> List[Dict]:
        """Scrape all configured sources"""
        all_outbreaks = []
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            
            # WHO
            tasks.append(self.fetch_page(session, self.sources['who']))
            # CDC
            tasks.append(self.fetch_page(session, self.sources['cdc']))
            
            results = await asyncio.gather(*tasks)
            
            # Parse WHO
            if results[0]:
                all_outbreaks.extend(self.parse_who_data(results[0]))
            
            # Parse CDC
            if results[1]:
                all_outbreaks.extend(self.parse_cdc_data(results[1]))
        
        logger.info(f"Scraped {len(all_outbreaks)} outbreak records")
        return all_outbreaks
    
    def scrape_sync(self) -> List[Dict]:
        """Synchronous wrapper for scraping"""
        return asyncio.run(self.scrape_all_sources())


class NewsSignalScraper:
    """Scrapes news signals for disease indicators"""
    
    def __init__(self):
        self.keywords = [
            'fever', 'outbreak', 'epidemic', 'illness', 'disease',
            'hospital', 'cases', 'infection', 'symptoms', 'deaths'
        ]
    
    def scrape_news_signals(self, location: str = 'India') -> List[Dict]:
        """Scrape news signals (mock implementation)"""
        # In production, integrate with news APIs like NewsAPI, Google News, etc.
        mock_signals = [
            {
                'headline': f'Hospitals in {location} report surge in respiratory cases',
                'source': 'Health News Network',
                'location': location,
                'date': datetime.now().isoformat(),
                'keywords': ['respiratory', 'hospital', 'surge'],
                'severity': 'medium'
            },
            {
                'headline': f'Health officials monitor fever cluster in {location}',
                'source': 'Medical Times',
                'location': location,
                'date': (datetime.now() - timedelta(hours=6)).isoformat(),
                'keywords': ['fever', 'cluster', 'monitor'],
                'severity': 'medium'
            },
            {
                'headline': f'Emergency services on alert in {location}',
                'source': 'Regional News',
                'location': location,
                'date': (datetime.now() - timedelta(hours=12)).isoformat(),
                'keywords': ['emergency', 'alert'],
                'severity': 'high'
            }
        ]
        
        return mock_signals


# Utility functions
def save_scraped_data(data: List[Dict], filename: str = 'scraped_data.json'):
    """Save scraped data to JSON file"""
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    logger.info(f"Saved {len(data)} records to {filename}")


def load_scraped_data(filename: str = 'scraped_data.json') -> List[Dict]:
    """Load scraped data from JSON file"""
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning(f"File {filename} not found")
        return []


if __name__ == '__main__':
    # Test scraper
    scraper = HealthDataScraper()
    data = scraper.scrape_sync()
    
    print(f"\nScraped {len(data)} outbreak records:")
    for item in data[:5]:
        print(f"- {item['source']}: {item['title'][:80]}...")
    
    # Test news scraper
    news_scraper = NewsSignalScraper()
    signals = news_scraper.scrape_news_signals('Mumbai')
    print(f"\nScraped {len(signals)} news signals")
