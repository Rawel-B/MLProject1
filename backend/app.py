from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os
from services.authService import router as authRouter
from services.userService import router as userRouter
from services.predictService import router as predictRouter
from services.predictService import trainModel
import threading
import uvicorn

app = FastAPI()

modelPATH = "model/financialknowledge.pkl"
model = None 

@app.on_event("startup")
async def startup_event():
    thread = threading.Thread(target=init_ml_model) # Opens Another Thread For Training
    thread.start()
    
def init_ml_model():
    global model
    
    os.makedirs(os.path.dirname(modelPATH), exist_ok=True)

    if os.path.exists(modelPATH):
        print(f"Stored knowledge found at {modelPATH}, loading pkl file....")
        model = joblib.load(modelPATH)
    else:
        print("No knowledge file detected. Starting training sequence....")
        model = trainModel() # Dumped
        print("Model training complete....")

### Routes
app.include_router(authRouter)
app.include_router(userRouter)
app.include_router(predictRouter)
###

### CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["https://main-frontend-508281375904.europe-west1.run.app"], # Live Server     #allow_origins=["http://localhost:3000"],  # Frontend Dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
###

@app.get("/")
def root():
    return {"status": "ok"}
@app.get("/status")
def getStatus():
    return {
        "model_loaded": model is not None,
        "model_path_exists": os.path.exists(modelPATH),
        "environment_port": os.environ.get("PORT", "Not Set")
    }
@app.post("/predict")
def predict(features: list[float]):
    if model is None:
        return {"error": "model not loaded"}

    prediction = model.predict([features])
    return {"prediction": prediction.tolist()}
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)