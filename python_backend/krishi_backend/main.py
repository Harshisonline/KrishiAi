import warnings
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Load model and encoders
model = joblib.load('xgb_model.pkl')
le_crop = joblib.load('le_crop.pkl')
le_state = joblib.load('le_state.pkl')
le_season = joblib.load('le_season.pkl')

# Create FastAPI app
app = FastAPI()

# Define input data structure
class CropInput(BaseModel):
    crop: str
    state: str
    season: str
    area: float

# Root endpoint (to avoid 404 errors and show a welcome message)
@app.get("/")
def read_root():
    return {"message": "Welcome to the Crop Yield Prediction API!"}

# Prediction endpoint
@app.post("/predict")
def predict_yield(data: CropInput):
    # Encode categorical variables
    crop_encoded = le_crop.transform([data.crop])[0]
    state_encoded = le_state.transform([data.state])[0]
    season_encoded = le_season.transform([data.season])[0]
    
    # Create feature array
    features = np.array([[crop_encoded, state_encoded, season_encoded, data.area]])

    # Predict
    prediction = model.predict(features)
    
    return {
        "predicted_yield": round(float(prediction[0]), 2)  # Return as float rounded to 2 decimal points
    }
