import speech_recognition as sr
from gtts import gTTS
import os
import random


recognizer = sr.Recognizer()

def choose_language():
    print("Please select your language:")
    print("1. हिंदी (Hindi)")
    print("2. English")
    choice = input("Enter 1 or 2: ")

    if choice == '1':
        return 'hi-IN', 'hi'  
    else:
        return 'en-US', 'en'  

def listen_to_user(lang='hi-IN'):
    try:
        with sr.Microphone() as source:
            print(f"Listening in {lang}...")
            recognizer.adjust_for_ambient_noise(source) 
            audio = recognizer.listen(source)
            try:
                text = recognizer.recognize_google(audio, language=lang)
                print(f"You said: {text}")
                return text
            except sr.UnknownValueError:
                print("Could not understand audio.")
                return ""
            except sr.RequestError as e:
                print(f"Could not request results; {e}")
                return ""
    except Exception as e:
        print(f"Microphone Error: {e}")
        return ""

from deep_translator import GoogleTranslator

def translate_to_english(text):
    try:
        translated = GoogleTranslator(source='auto', target='en').translate(text)
        print(f"Translated: {translated}")
        return translated
    except Exception as e:
        print(f"⚡ Error translating: {e}")
        return text


def detect_intent(text):
    text = text.lower()
    if "soil" in text:
        return "soil_recommendation"
    elif "disease" in text:
        return "disease_detection"
    elif "yield" in text:
        return "yield_prediction"
    elif "fertilizer" in text:
        return "fertilizer_recommendation"
    elif "tip" in text or "suggestion" in text:
        return "daily_tip"
    else:
        return "unknown"

def handle_intent(intent, tts_lang='hi'):
    if intent == "soil_recommendation":
        speak_response("कृपया मिट्टी की तस्वीर भेजें या लोकेशन दें।", lang=tts_lang)
    elif intent == "disease_detection":
        speak_response("कृपया पौधे या पत्ते की तस्वीर भेजें।", lang=tts_lang)
    elif intent == "yield_prediction":
        speak_response("कृपया फसल का नाम, मिट्टी की गुणवत्ता और मौसम का विवरण दें।", lang=tts_lang)
    elif intent == "fertilizer_recommendation":
        speak_response("कृपया मिट्टी और फसल का विवरण दें।", lang=tts_lang)
    elif intent == "daily_tip":
        give_daily_tip(tts_lang)
    else:
        speak_response("माफ़ कीजिए, मैं उसे नहीं समझ पाया। कृपया दोबारा कोशिश करें।", lang=tts_lang)

from playsound import playsound

def speak_response(text, lang='hi'):
    try:
        tts = gTTS(text=text, lang=lang)
        file_name = f"response_{random.randint(1,1000)}.mp3"
        tts.save(file_name)
        
        playsound(file_name) 

        os.remove(file_name)  
    except Exception as e:
        print(f"⚡ Error speaking response: {e}")


def give_daily_tip(tts_lang='hi'):
    tips = [
        "आज के लिए सलाह: खेत में जैविक खाद का उपयोग करें।",
        "आज के लिए सलाह: फसल चक्र अपनाएँ ताकि मिट्टी की गुणवत्ता बनी रहे।",
        "आज के लिए सलाह: मौसम पूर्वानुमान के अनुसार सिंचाई करें।"
    ]
    tip = random.choice(tips)
    speak_response(tip, lang=tts_lang)

def main_voice_assistant():
    speech_lang, tts_lang = choose_language()

    while True:
        user_input = listen_to_user(lang=speech_lang)

        if not user_input.strip():
            speak_response("कोई इनपुट नहीं मिला, कृपया दोबारा कोशिश करें।", lang=tts_lang)
            continue

        if "exit" in user_input.lower() or "बंद करो" in user_input.lower():
            speak_response("धन्यवाद! फिर मिलेंगे।", lang=tts_lang)
            print("Exiting Krishi Mitra Assistant...")
            break

        if speech_lang == 'hi-IN':
            user_input = translate_to_english(user_input)  

        intent = detect_intent(user_input)
        handle_intent(intent, tts_lang)

if __name__ == "__main__":
    print("Welcome to Krishi Mitra - Voice Assistant!")
    while True:
        main_voice_assistant()
