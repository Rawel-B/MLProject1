from passlib.context import CryptContext
from fastapi import APIRouter, HTTPException
from jose import jwt
from datetime import datetime, timedelta

#region Properties
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth")
SECRET = "supersecret"
loginAlgorithm = "HS256"
#endregion

#region Main
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)

@router.post("/auth/login")
def login(data: dict):
    user = users.find_one({"email": data["email"]})
    
    if not user or not verify_password(data["password"], user["password"]):
        raise HTTPException(status_code=401)

    token = jwt.encode({"sub": user["email"], "exp": datetime.utcnow() + timedelta(hours=1)}, SECRET, algorithm = loginAlgorithm,)

    return {"access_token": token}
#endregion