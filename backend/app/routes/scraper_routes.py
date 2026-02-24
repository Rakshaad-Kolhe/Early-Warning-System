"""
API routes for scraper functionality
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import logging

from ..database import get_db
from ..services.scraper_service import (
    ScraperService, 
    get_scraper_status, 
    trigger_manual_scrape
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/scraper", tags=["scraper"])

# Global scraper service instance
scraper_service = ScraperService()


@router.get("/status")
async def get_status():
    """Get scraper status and last run information"""
    try:
        status = get_scraper_status(scraper_service)
        return {
            "success": True,
            "data": status
        }
    except Exception as e:
        logger.error(f"Error getting scraper status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/scrape")
async def manual_scrape(db: Session = Depends(get_db)):
    """Manually trigger a scraping operation"""
    try:
        result = trigger_manual_scrape(scraper_service, db)
        
        if result['success']:
            return {
                "success": True,
                "message": "Scraping completed successfully",
                "data": result
            }
        else:
            raise HTTPException(status_code=500, detail=result.get('error', 'Scraping failed'))
            
    except Exception as e:
        logger.error(f"Error in manual scrape: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/outbreaks/recent")
async def get_recent_outbreaks(days: int = 7, db: Session = Depends(get_db)):
    """Get recent outbreak data"""
    try:
        outbreaks = scraper_service.get_recent_outbreaks(db, days=days)
        return {
            "success": True,
            "count": len(outbreaks),
            "data": outbreaks
        }
    except Exception as e:
        logger.error(f"Error getting recent outbreaks: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/outbreaks/by-location")
async def get_outbreaks_by_location(db: Session = Depends(get_db)):
    """Get outbreak counts aggregated by location"""
    try:
        location_data = scraper_service.aggregate_by_location(db)
        return {
            "success": True,
            "data": location_data
        }
    except Exception as e:
        logger.error(f"Error aggregating by location: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/outbreaks/severity")
async def get_severity_distribution(db: Session = Depends(get_db)):
    """Get distribution of outbreak severity levels"""
    try:
        severity_data = scraper_service.get_severity_distribution(db)
        return {
            "success": True,
            "data": severity_data
        }
    except Exception as e:
        logger.error(f"Error getting severity distribution: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/news/signals")
async def get_news_signals(location: str = "India"):
    """Get news signals for a specific location"""
    try:
        signals = scraper_service.scrape_news_signals(location)
        return {
            "success": True,
            "count": len(signals),
            "data": signals
        }
    except Exception as e:
        logger.error(f"Error getting news signals: {e}")
        raise HTTPException(status_code=500, detail=str(e))
