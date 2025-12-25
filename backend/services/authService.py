from passlib.context import CryptContext
from fastapi import APIRouter, HTTPException, status, Depends
from jose import jwt
from datetime import datetime, timedelta
from database import users 
from fastapi.security import OAuth2PasswordBearer

#region Properties
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth")
SECRET = "supersecret"
loginAlgorithm = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
#endregion

#region Main
def hashPassword(password: str):
    return pwd_context.hash(password)
def verifyPassword(password, hashed):
    return pwd_context.verify(password, hashed)
def getCurrentUserBySession(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[loginAlgorithm])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    user = users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    del user["password"]
    return user
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
        "password": hashPassword(data["password"]), # Hashed
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
    
    if not user or not verifyPassword(data["password"], user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = jwt.encode(
        {"sub": user["email"], "exp": datetime.utcnow() + timedelta(hours=24)}, 
        SECRET, 
        algorithm=loginAlgorithm
    )

    return {"access_token": token, "token_type": "bearer"}
#endregion