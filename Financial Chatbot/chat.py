import openai
openai.api_key="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"
def chat_with_gpt(prompt):
    response=openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content.strip()

if _name_ == "_main_":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break
        response=chat_with_gpt(user_input)
        print("Chatbot: ", response)
