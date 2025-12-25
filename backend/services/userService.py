from passlib.context import CryptContext
from fastapi import APIRouter, HTTPException, status, Depends
from jose import jwt
from datetime import datetime, timedelta
from database import users 
from .authService import getCurrentUserBySession, verifyPassword, hashPassword
from .predictService import getProjections

#region Properties
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/user")
SECRET = "supersecret"
loginAlgorithm = "HS256"
#endregion

#region Main
@router.get("/currentuser")
def getCurrentUser(current_user: dict = Depends(getCurrentUserBySession)):
    return current_user
@router.put("/update-profile")
def updateUser(data: dict, current_user: dict = Depends(getCurrentUserBySession)):
    update_data = {}
    # Savings Target Scales Depending On Salary
    newSalary = float(data.get("salary", current_user.get("salary", 0)))
    savings = float(data.get("savings_percentage", current_user.get("savings_percentage", 0)))
    
    if "salary" in data or "savings_percentage" in data:
        if newSalary > 0:
            calculated_amount = newSalary * (savings / 100)
            update_data["target_amount"] = float(f"{calculated_amount:g}")
        else:
            update_data["target_amount"] = 0
        
    # Main Fields
    for field in ["name", "profession", "salary", "target_amount", "target_date", "savings_percentage"]:
        if field in data:
            update_data[field] = data[field]
    # Prediction Data
    for field in ["investing_rate", "spending_rate", "debt_load", "stability_buffer"]:
        if field in data:
            update_data[field] = data[field]
    
    fullContext = {**current_user, **update_data}
    # Prediction Algorithm
    efficiency, spiderData, accuracy = getProjections(fullContext)
    update_data["ai_score"] = efficiency
    update_data["spider_data"] = spiderData
    update_data["ml_accuracy"] = accuracy
    
    if data.get("new_password"):
        user_with_pass = users.find_one({"email": current_user["email"]})
        
        if not verifyPassword(data.get("old_password"), user_with_pass["password"]):
            raise HTTPException(status_code=400, detail="Current password incorrect")
        
        update_data["password"] = hashPassword(data["new_password"])
        
    users.update_one({"email": current_user["email"]}, {"$set": update_data})
    return {"message": "Profile updated"}
#endregion