from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from io import BytesIO

# Load the trained Keras model
model = load_model("soil_classifier_model.h5")

# Class map for soil types
soil_classes = {
    0: "Alluvial Soil",
    1: "Black Soil",
    2: "Clay Soil",
    3: "Red Soil"
}

# FastAPI app initialization
app = FastAPI()

# Function to predict soil type from the uploaded image
def predict_soil(img_bytes):
    img = image.load_img(BytesIO(img_bytes), target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0  # Normalize the image
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    prediction = model.predict(img_array)
    class_idx = np.argmax(prediction)
    return soil_classes[class_idx]

@app.post("/predict")
async def predict_soil_type(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        prediction = predict_soil(contents)
        return JSONResponse(content={"prediction": prediction})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

