"""
Database models for outbreak data
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class OutbreakData(Base):
    """Model for storing scraped outbreak data"""
    __tablename__ = 'outbreak_data'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    source = Column(String(100), nullable=False)
    location = Column(String(200), nullable=False)
    severity = Column(String(20), default='low')
    url = Column(Text, nullable=True)
    scraped_date = Column(DateTime, default=datetime.now)
    published_date = Column(String(100), nullable=True)
    
    def __repr__(self):
        return f"<OutbreakData(title='{self.title}', location='{self.location}', severity='{self.severity}')>"


class PredictionHistory(Base):
    """Model for storing prediction history"""
    __tablename__ = 'prediction_history'
    
    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(100), nullable=False)
    risk_level = Column(String(20), nullable=False)
    risk_score = Column(Integer, nullable=False)
    predicted_cases = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    prediction_date = Column(DateTime, default=datetime.now)
    features_json = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<PredictionHistory(district='{self.district}', risk='{self.risk_level}', score={self.risk_score})>"


class ModelMetrics(Base):
    """Model for storing model performance metrics"""
    __tablename__ = 'model_metrics'
    
    id = Column(Integer, primary_key=True, index=True)
    model_version = Column(String(50), nullable=False)
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    training_date = Column(DateTime, default=datetime.now)
    notes = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<ModelMetrics(version='{self.model_version}', accuracy={self.accuracy})>"
