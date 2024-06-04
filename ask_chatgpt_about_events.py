import os
import json
import openai
from dotenv import load_dotenv
import time

# Načtení .env souboru
dotenv_path = 'C:\\Users\\ADMIN\\Documents\\Web\\MKMŽ Slivenec\\.env'
load_dotenv(dotenv_path, override=True)

# Načtení API klíče z environmentální proměnné
openai.api_key = os.getenv('OPENAI_API_KEY')

def ask_chatgpt_for_events(events):
    prompt = (
        "Prosím, uveď seznam všech aktuálních a budoucích železničních akcí v České republice a sousedních zemích, které se konají od dnešního dne do budoucnosti. "
        "Seřaď je podle data od nejbližšího po nejvzdálenější a formátuj odpověď jako JSON pole, kde každá akce bude obsahovat 'název', 'datum', 'místo' a 'popis'. "
        "Odpověz prosím v češtině. Zde jsou akce: "
        + json.dumps(events, ensure_ascii=False)
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI assistant specialized in railway events."},
                {"role": "user", "content": prompt}
            ]
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        return str(e)

def save_response_to_file(response, filename):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(json.loads(response), f, ensure_ascii=False, indent=4)
        print(f"Response successfully saved to {filename}")
    except Exception as e:
        print(f"Error saving response to file: {e}")

def main():
    # Zkontroluj, zda existuje soubor s datem posledního běhu
    last_run_file = 'last_run.txt'
    if os.path.exists(last_run_file):
        with open(last_run_file, 'r') as f:
            last_run = f.read().strip()
        last_run_date = time.strptime(last_run, "%Y-%m-%d")
        current_date = time.gmtime()
        
        # Pokud byl skript spuštěn dnes, ukonči
        if last_run_date.tm_year == current_date.tm_year and last_run_date.tm_yday == current_date.tm_yday:
            print("Skript již byl dnes spuštěn.")
            return
    
    # Dummy data pro testování
    events = [
        {"název": "Test Event 1", "datum": "2024-06-01", "místo": "Praha", "popis": "Testovací popis akce 1"},
        {"název": "Test Event 2", "datum": "2024-07-15", "místo": "Brno", "popis": "Testovací popis akce 2"},
    ]

    # Získej data od AI
    response = ask_chatgpt_for_events(events)
    print("AI Response:")
    print(response)
    
    if response:
        save_response_to_file(response, 'events.json')
    else:
        print("No response from AI.")
    
    # Ulož aktuální datum jako datum posledního běhu
    with open(last_run_file, 'w') as f:
        f.write(time.strftime("%Y-%m-%d", time.gmtime()))

if __name__ == "__main__":
    main()
