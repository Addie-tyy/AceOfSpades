import google.generativeai as genai
import traceback

API_KEY = "AIzaSyDcGXJBf0drJ9vOEq7KL4qmCyz7AXvnEsQ"  
genai.configure(api_key=API_KEY)

generation_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
    system_instruction=(
        "Your goal is to be a financial and business advisor and educator. "
        "You have to explain anything related to finance and business in a really easy way "
        "so that even a child can understand it. Ask questions so you can understand the user input better "
        "and improve the knowledge of the user. Give examples with your answers to make your efficiency better."
    ),
)


history = []

print("Bot: Hello, how can I help you?")

# Chat loop
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        print("Bot: Goodbye! Have a great day!")
        break

    if not user_input.strip():
        print("Bot: Please say something!")
        continue

    try:
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(user_input)
        model_response = response.text
        print(f"Bot: {model_response}")
        history.append({"role": "user", "parts": [user_input]})
        history.append({"role": "model", "parts": [model_response]})
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
