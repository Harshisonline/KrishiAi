import warnings
warnings.filterwarnings("ignore")

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb

# -----------------------------------
# 1. Load dataset
# -----------------------------------
data = pd.read_csv('crop_production.csv')  # Replace with your actual CSV file name

# Optionally: make column names lowercase (for safety)
data.columns = data.columns.str.lower()

# Check real column names
print(f"Loaded columns: {data.columns.tolist()}")

# -----------------------------------
# 2. Encode categorical features
# -----------------------------------
le_crop = LabelEncoder()
le_state = LabelEncoder()
le_season = LabelEncoder()

# Check if required columns exist
if 'crop' not in data.columns or 'state_name' not in data.columns or 'season' not in data.columns:
    raise ValueError("Required columns are missing from the dataset!")

# Ensure no missing values in the columns that will be encoded
data['crop'] = data['crop'].fillna("Unknown")
data['state_name'] = data['state_name'].fillna("Unknown")
data['season'] = data['season'].fillna("Unknown")

# Encode categorical columns
data['crop_encoded'] = le_crop.fit_transform(data['crop'])
data['state_encoded'] = le_state.fit_transform(data['state_name'])
data['season_encoded'] = le_season.fit_transform(data['season'])

# -----------------------------------
# 3. Prepare X and y
# -----------------------------------
X = data[['crop_encoded', 'state_encoded', 'season_encoded', 'area']]
y = data['production']

# Check for NaN values in feature columns
if X.isnull().sum().any() or y.isnull().sum():
    print("Warning: There are missing values in your data.")
    X = X.fillna(0)
    y = y.fillna(0)

# -----------------------------------
# 4. Train the model
# -----------------------------------
model = xgb.XGBRegressor()

# Training the model
print("Training the model...")
model.fit(X, y)

# -----------------------------------
# 5. Save model and encoders
# -----------------------------------
joblib.dump(model, 'xgb_model.pkl')
joblib.dump(le_crop, 'le_crop.pkl')
joblib.dump(le_state, 'le_state.pkl')
joblib.dump(le_season, 'le_season.pkl')

print("✅ Model and encoders saved successfully!")

# -----------------------------------
# 6. Create FastAPI app
# -----------------------------------
app = FastAPI()

# Define input structure
class CropInput(BaseModel):
    crop: str
    state: str
    season: str
    area: float

# Load model and encoders for FastAPI predictions
model = joblib.load('xgb_model.pkl')
le_crop = joblib.load('le_crop.pkl')
le_state = joblib.load('le_state.pkl')
le_season = joblib.load('le_season.pkl')

# -----------------------------------
# 7. Define routes
# -----------------------------------

@app.get("/")
def read_root():
    return {"message": "🌾 Welcome to the Crop Yield Prediction API!"}

@app.post("/predict")
def predict_yield(data: CropInput):
    try:
        # Encoding the categorical data
        # Handle unseen labels by checking if the input is in the encoder's classes
        if data.crop not in le_crop.classes_:
            raise HTTPException(status_code=400, detail=f"Unseen crop label: '{data.crop}'. Available crops are: {', '.join(le_crop.classes_)}")
        
        if data.state not in le_state.classes_:
            raise HTTPException(status_code=400, detail=f"Unseen state label: '{data.state}'. Available states are: {', '.join(le_state.classes_)}")
        
        if data.season not in le_season.classes_:
            raise HTTPException(status_code=400, detail=f"Unseen season label: '{data.season}'. Available seasons are: {', '.join(le_season.classes_)}")

        crop_encoded = le_crop.transform([data.crop])[0]
        state_encoded = le_state.transform([data.state])[0]
        season_encoded = le_season.transform([data.season])[0]

        # Prepare features
        features = np.array([[crop_encoded, state_encoded, season_encoded, data.area]])

        # Check shape and types of input before prediction
        print(f"Features input for prediction: {features}")

        # Predict yield
        prediction = model.predict(features)
        return {"predicted_production": round(float(prediction[0]), 2)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

