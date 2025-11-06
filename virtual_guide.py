import streamlit as st
from deep_translator import GoogleTranslator
import requests
import json

# -----------------------------
# 🔤 Safe Translation Function
# -----------------------------
def safe_translate(text, target_lang):
    try:
        return GoogleTranslator(source='auto', target=target_lang).translate(text)
    except Exception:
        return text  # fallback if translation fails

# -----------------------------
# 🌍 Page Setup
# -----------------------------
st.set_page_config(page_title="Chatbot & Virtual Guide", page_icon="🌍")
st.title("🌍 Multilingual Chatbot & Virtual Guide")
st.write("Your smart assistant for directions, translations, etiquette, and emergencies!")

# -----------------------------
# 📍 Sample Data for Etiquette & Emergency Info
# -----------------------------
etiquette_data = {
    "India": "🙏 Remove shoes before entering temples or homes. Use your right hand for giving or receiving items.",
    "Japan": "🎎 Bow when greeting. Avoid physical contact like handshakes.",
    "France": "🇫🇷 Always greet with 'Bonjour'. Respect personal space.",
    "USA": "🤝 Handshakes are common. Maintain eye contact during conversation."
}

emergency_data = {
    "India": {"Police": "100", "Ambulance": "108", "Fire": "101"},
    "Japan": {"Police": "110", "Ambulance": "119", "Fire": "119"},
    "France": {"Police": "17", "Ambulance": "15", "Fire": "18"},
    "USA": {"Police": "911", "Ambulance": "911", "Fire": "911"}
}

# -----------------------------
# 🚦 Google Maps Directions API
# -----------------------------
def get_directions(origin, destination, api_key):
    try:
        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {"origin": origin, "destination": destination, "key": api_key}
        response = requests.get(url, params=params)
        data = response.json()
        if data["status"] == "OK":
            steps = data["routes"][0]["legs"][0]["steps"]
            directions = [step["html_instructions"] for step in steps]
            clean_directions = "\n".join([step.replace("<b>", "").replace("</b>", "") for step in directions])
            return clean_directions
        else:
            return "Sorry, I couldn’t find directions for that route."
    except:
        return "Error fetching directions. Please check your API key or internet."

# -----------------------------
# 💬 Chat Interface
# -----------------------------
user_input = st.text_input("You:", placeholder="Type your message here...")

# Google Maps API Key (⚠️ Replace with your valid key)
GOOGLE_API_KEY = "AIzaSyBXk6F83-dGHIEHUsUbcNoMjqBuCA6d0q0"

if user_input:
    # 🧠 Simple language detection (basic)
    detected_lang = 'ta' if any(ch in user_input for ch in "அஆஇஈஉஎஏஒஓ") else 'en'

    # Translate input to English for processing
    translated_input = safe_translate(user_input, 'en').lower()

    response = ""

    # -----------------------------
    # 🧭 Intent Handling
    # -----------------------------
    if "direction" in translated_input or "route" in translated_input:
        st.write("🗺️ Let's find directions!")
        origin = st.text_input("Enter starting location:")
        destination = st.text_input("Enter destination:")
        if st.button("Get Directions"):
            directions = get_directions(origin, destination, GOOGLE_API_KEY)
            st.success(directions)
            response = "Here are your directions."

    elif "etiquette" in translated_input or "culture" in translated_input:
        country = st.selectbox("Select a country:", list(etiquette_data.keys()))
        response = etiquette_data.get(country, "No data available for this country.")

    elif "emergency" in translated_input or "help" in translated_input:
        country = st.selectbox("Select your country:", list(emergency_data.keys()))
        contacts = emergency_data.get(country)
        response = (
            f"🚨 Emergency Contacts for {country}:\n"
            f"Police: {contacts['Police']}\n"
            f"Ambulance: {contacts['Ambulance']}\n"
            f"Fire: {contacts['Fire']}"
        )

    elif "translate" in translated_input:
        st.write("🌐 Translation Mode Activated!")
        text_to_translate = st.text_input("Enter text to translate:")
        target_lang = st.text_input("Enter target language code (e.g., ta, fr, hi, ja):")
        if st.button("Translate Now"):
            translated_text = safe_translate(text_to_translate, target_lang)
            st.success(f"Translated Text: {translated_text}")
            response = translated_text

    else:
        response = "I'm your virtual guide! You can ask for directions, translations, etiquette, or emergency info."

    # -----------------------------
    # 🌐 Translate Response to User’s Language
    # -----------------------------
    translated_response = safe_translate(response, detected_lang)
    st.write(f"🤖 Bot: {translated_response}")

# -----------------------------
# 📝 Footer
# -----------------------------
st.markdown("---")

