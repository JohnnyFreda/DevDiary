from pydantic_settings import BaseSettings
from typing import List
from pydantic import field_validator
import json


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/dev_diary"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
    
    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        if v is None:
            return []
        if isinstance(v, list):
            return [str(x).strip() for x in v if str(x).strip()]
        if isinstance(v, str):
            s = v.strip()
            if not s:
                return []
            try:
                out = json.loads(s)
                return [str(x).strip() for x in out] if isinstance(out, list) else [s]
            except json.JSONDecodeError:
                return [origin.strip() for origin in s.split(",") if origin.strip()]
        return []
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()


