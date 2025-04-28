import warnings
warnings.filterwarnings("ignore")

from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
import joblib
import numpy as np

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# Load the saved model and encoders
model = joblib.load('xgb_model.pkl')
le_crop = joblib.load('le_crop.pkl')
le_state = joblib.load('le_state.pkl')
le_season = joblib.load('le_season.pkl')

# Print the classes the encoder has learned for season
print("Season encoder classes:", le_season.classes_)

@app.route('/')
def home():
    return "🌾 Welcome to the Crop Production Prediction API!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Check if all fields are present
        if 'crop' not in data or 'state' not in data or 'season' not in data or 'area' not in data:
            return jsonify({"error": "Missing required fields: 'crop', 'state', 'season', 'area'."})

        crop = data['crop']
        state = data['state']
        season = data['season']
        area = data['area']

        # Encode crop and state
        crop_encoded = le_crop.transform([crop])[0]
        state_encoded = le_state.transform([state])[0]

        # Handle unseen labels for season
        if season in le_season.classes_:
            season_encoded = le_season.transform([season])[0]
        else:
            print(f"Warning: '{season}' not seen during training. Using default encoding.")
            season_encoded = le_season.transform([le_season.classes_[0]])[0]  # fallback to first class
        
        # Prepare input features
        features = np.array([[crop_encoded, state_encoded, season_encoded, area]])

        # Predict
        prediction = model.predict(features)

        return jsonify({
            "predicted_production": abs(round(float(prediction[0]), 2))
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Something went wrong: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
