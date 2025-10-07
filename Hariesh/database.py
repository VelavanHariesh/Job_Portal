# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ⚠️ Replace with your own MySQL username, password, and DB name
DATABASE_URL = "mysql+pymysql://root:hari@127.0.0.1:3306/jobportal"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
