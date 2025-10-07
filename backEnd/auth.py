from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext

# ⚠️ Change this to a strong secret key (e.g., 32+ random bytes)
SECRET_KEY = "CHANGE_THIS_SECRET"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create a password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ Hash password safely (bcrypt supports max 72 bytes)
def get_password_hash(password: str) -> str:
    # Truncate to 72 bytes for bcrypt compatibility
    return pwd_context.hash(password[:72])

# ✅ Verify a password against the stored hash
def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Truncate plain password to match hashing behavior
    return pwd_context.verify(plain_password[:72], hashed_password)

# ✅ Create a signed JWT access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
