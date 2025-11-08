from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    GEMINI_MODEL: str = "gemini-pro"
    CHROMADB_PATH: str = "./chroma_db"
    ENABLE_MEMORY: bool = True
    VERBOSE: bool = True
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()