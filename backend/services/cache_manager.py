"""
Cache Manager for session-based caching of API responses
"""
import time
import threading
from typing import Any, Optional
from cachetools import TTLCache


class CacheManager:
    """
    Thread-safe cache manager with TTL support for API responses
    """
    
    def __init__(self, default_ttl: int = 300):  # 5 minutes default
        self.default_ttl = default_ttl
        self._cache = TTLCache(maxsize=1000, ttl=default_ttl)
        self._lock = threading.RLock()
    
    def _generate_key(self, session_id: str, api_type: str, params: dict) -> str:
        """Generate cache key from session, API type, and parameters"""
        # Sort params for consistent key generation
        sorted_params = sorted(params.items()) if params else []
        param_str = "|".join(f"{k}={v}" for k, v in sorted_params)
        return f"{session_id}:{api_type}:{param_str}"
    
    def get(self, session_id: str, api_type: str, params: dict) -> Optional[Any]:
        """Get cached response if available"""
        with self._lock:
            key = self._generate_key(session_id, api_type, params)
            return self._cache.get(key)
    
    def set(self, session_id: str, api_type: str, params: dict, value: Any, ttl: Optional[int] = None) -> None:
        """Cache response with TTL"""
        with self._lock:
            key = self._generate_key(session_id, api_type, params)
            # Create new cache entry with custom TTL if specified
            if ttl and ttl != self.default_ttl:
                # For custom TTL, we need to manually track expiration
                self._cache[key] = {
                    'value': value,
                    'expires_at': time.time() + ttl
                }
            else:
                self._cache[key] = value
    
    def clear_session(self, session_id: str) -> None:
        """Clear all cached data for a session"""
        with self._lock:
            keys_to_remove = [key for key in self._cache.keys() if key.startswith(f"{session_id}:")]
            for key in keys_to_remove:
                self._cache.pop(key, None)
    
    def clear_all(self) -> None:
        """Clear all cached data"""
        with self._lock:
            self._cache.clear()
    
    def get_stats(self) -> dict:
        """Get cache statistics"""
        with self._lock:
            return {
                'size': len(self._cache),
                'maxsize': self._cache.maxsize,
                'ttl': self._cache.ttl
            }
