from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os

app = FastAPI()

# CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model/model.pkl"
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/predict")
def predict(features: list[float]):
    if model is None:
        return {"error": "model not loaded"}

    prediction = model.predict([features])
    return {"prediction": prediction.tolist()}
