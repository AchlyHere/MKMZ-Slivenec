import os
import json
import requests
from dotenv import load_dotenv
import openai
from datetime import datetime

# Load the .env file
load_dotenv('config/.env')

# Load API keys from environment variables
openai_api_key = os.getenv('OPENAI_API_KEY')
tavily_api_key = os.getenv('TAVILY_API_KEY')

# Initialize OpenAI API
openai.api_key = openai_api_key

def ask_tavily_for_events():
    url = 'https://api.tavily.com/search'
    headers = {
        'Authorization': f'Bearer {tavily_api_key}',
        'Content-Type': 'application/json'
    }
    payload = {
        'api_key': tavily_api_key,
        'query': 'aktuální a budoucí železniční akce v České republice a sousedních zemích',
        'search_depth': 'advanced',
        'include_answer': False,
        'include_images': False,
        'include_raw_content': False,
        'max_results': 10
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error with Tavily API: {response.status_code}")
        return None

def ask_chatgpt_to_format(events):
    prompt = (
        "Následující je seznam železničních akcí, které jsem našel na internetu. Prosím, seřaď je podle data od nejbližšího po nejvzdálenější a formátuj odpověď jako JSON pole, "
        "kde každá akce bude obsahovat 'název', 'datum', 'místo' a 'popis'. Odpověz prosím v češtině. Zde jsou akce:\\n\\n"
        + json.dumps(events, ensure_ascii=False, indent=4)
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant specialized in railway events."},
                {"role": "user", "content": prompt}
            ]
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        print("Error with ChatGPT:", e)
        return str(e)

def save_response_to_file(response, filename):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(json.loads(response), f, ensure_ascii=False, indent=4)
        print(f"Response successfully saved to {filename}")
    except Exception as e:
        print(f"Error saving response to file: {e}")

def main():
    last_run_file = 'config/last_run.txt'
    try:
        with open(last_run_file, 'r') as f:
            last_run = f.read().strip()
    except FileNotFoundError:
        last_run = ''

    today = datetime.today().strftime('%Y-%m-%d')
    if last_run == today:
        print("Script has already run today.")
        return

    events = ask_tavily_for_events()
    if events:
        response = ask_chatgpt_to_format(events)
        if response:
            save_response_to_file(response, 'events.json')
            with open(last_run_file, 'w') as f:
                f.write(today)
        else:
            print("No response from AI.")
    else:
        print("No events found from Tavily API.")

if __name__ == "__main__":
    main()
