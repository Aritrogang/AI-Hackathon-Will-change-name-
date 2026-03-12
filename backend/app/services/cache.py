"""Async SQLite cache with TTL-based expiration."""

import json
import time
from pathlib import Path
from typing import Any, Optional

import aiosqlite

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "cache.sqlite"


class Cache:
    """Simple key-value cache backed by SQLite with per-key TTL."""

    def __init__(self, db_path: Path = DEFAULT_DB_PATH) -> None:
        self.db_path = db_path
        self._db: Optional[aiosqlite.Connection] = None

    async def initialize(self) -> None:
        """Create the cache table if it doesn't exist."""
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._db = await aiosqlite.connect(str(self.db_path))
        await self._db.execute(
            """
            CREATE TABLE IF NOT EXISTS cache (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                expires_at REAL NOT NULL,
                created_at REAL NOT NULL
            )
            """
        )
        await self._db.commit()

    async def _ensure_db(self) -> aiosqlite.Connection:
        if self._db is None:
            await self.initialize()
        assert self._db is not None
        return self._db

    async def get(self, key: str) -> Optional[Any]:
        """Get a cached value by key. Returns None if not found (returns even if expired)."""
        db = await self._ensure_db()
        async with db.execute(
            "SELECT value FROM cache WHERE key = ?", (key,)
        ) as cursor:
            row = await cursor.fetchone()
            if row is None:
                return None
            return json.loads(row[0])

    async def set(self, key: str, value: Any, ttl: int = 3600) -> None:
        """Set a cache value with TTL in seconds."""
        db = await self._ensure_db()
        now = time.time()
        await db.execute(
            """
            INSERT OR REPLACE INTO cache (key, value, expires_at, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (key, json.dumps(value), now + ttl, now),
        )
        await db.commit()

    async def is_expired(self, key: str) -> bool:
        """Check if a cached key has passed its TTL."""
        db = await self._ensure_db()
        async with db.execute(
            "SELECT expires_at FROM cache WHERE key = ?", (key,)
        ) as cursor:
            row = await cursor.fetchone()
            if row is None:
                return True
            return time.time() > row[0]

    async def invalidate(self, key: str) -> None:
        """Remove a specific key from the cache."""
        db = await self._ensure_db()
        await db.execute("DELETE FROM cache WHERE key = ?", (key,))
        await db.commit()

    async def clear_expired(self) -> int:
        """Remove all expired entries. Returns count of removed entries."""
        db = await self._ensure_db()
        cursor = await db.execute(
            "DELETE FROM cache WHERE expires_at < ?", (time.time(),)
        )
        await db.commit()
        return cursor.rowcount

    async def close(self) -> None:
        """Close the database connection."""
        if self._db is not None:
            await self._db.close()
            self._db = None
