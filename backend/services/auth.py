from passlib.context import CryptContext
from fastapi import APIRouter, HTTPException, status
from jose import jwt
from datetime import datetime, timedelta
from database import users 

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
@router.post("/register")
def register(data: dict):
    if users.find_one({"email": data["email"]}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    new_user = {
        "name": data.get("name"),
        "email": data["email"],
        "password": hash_password(data["password"]), # Hashed
        "created_at": datetime.utcnow()
    }
    
    try:
        users.insert_one(new_user)
        return {"message": "User created successfully"}
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save user to database"
        )
@router.post("/login")
def login(data: dict):
    user = users.find_one({"email": data["email"]})
    
    if not user or not verify_password(data["password"], user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = jwt.encode(
        {"sub": user["email"], "exp": datetime.utcnow() + timedelta(hours=1)}, 
        SECRET, 
        algorithm=loginAlgorithm
    )

    return {"access_token": token, "token_type": "bearer"}
#endregion