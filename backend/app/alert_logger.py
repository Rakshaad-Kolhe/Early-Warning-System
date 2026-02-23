import sqlite3
from datetime import datetime
from app.config import DB_PATH
from app.database import get_connection


def log_alert(district: str, score: int, category: str, confidence: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO alerts (district, score, category, confidence, timestamp)
        VALUES (?, ?, ?, ?, ?)
        """,
        (district, score, category, confidence, datetime.now().isoformat()),
    )
    conn.commit()
    conn.close()


def get_alerts(limit: int = 100) -> list:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM alerts ORDER BY timestamp DESC LIMIT ?", (limit,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
