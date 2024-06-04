import time
import json
import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import openai

# Načtení .env souboru
dotenv_path = 'C:\\Users\\ADMIN\\Documents\\Web\\MKMŽ Slivenec\\.env'
load_dotenv(dotenv_path, override=True)

# Načtení API klíče z environmentální proměnné
openai.api_key = os.getenv('OPENAI_API_KEY')

def scrape_cd_nostalgie():
    url = 'https://www.cdnostalgie.cz/'
    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    events = []
    for event_item in soup.select('.event'):  # Adjust the class selector as needed
        event = {
            'název': event_item.select_one('.event-title').text.strip(),
            'datum': event_item.select_one('.event-date').text.strip(),
            'místo': event_item.select_one('.event-location').text.strip(),
            'popis': event_item.select_one('.event-description').text.strip(),
        }
        events.append(event)
    
    return events

def scrape_cysnews():
    url = 'https://www.cysnews.cz/'
    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    events = []
    for event_item in soup.select('.event'):  # Adjust the class selector as needed
        event = {
            'název': event_item.select_one('.event-title').text.strip(),
            'datum': event_item.select_one('.event-date').text.strip(),
            'místo': event_item.select_one('.event-location').text.strip(),
            'popis': event_item.select_one('.event-description').text.strip(),
        }
        events.append(event)
    
    return events

def scrape_kudyznudy():
    url = 'https://www.kudyznudy.cz/'
    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    events = []
    for event_item in soup.select('.event'):  # Adjust the class selector as needed
        event = {
            'název': event_item.select_one('.event-title').text.strip(),
            'datum': event_item.select_one('.event-date').text.strip(),
            'místo': event_item.select_one('.event-location').text.strip(),
            'popis': event_item.select_one('.event-description').text.strip(),
        }
        events.append(event)
    
    return events

def scrape_zdopravy():
    url = 'https://zdopravy.cz/'
    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    events = []
    for event_item in soup.select('.event'):  # Adjust the class selector as needed
        event = {
            'název': event_item.select_one('.event-title').text.strip(),
            'datum': event_item.select_one('.event-date').text.strip(),
            'místo': event_item.select_one('.event-location').text.strip(),
            'popis': event_item.select_one('.event-description').text.strip(),
        }
        events.append(event)
    
    return events

def scrape_szdc():
    url = 'https://www.spravazeleznic.cz/'
    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    events = []
    for event_item in soup.select('.event'):  # Adjust the class selector as needed
        event = {
            'název': event_item.select_one('.event-title').text.strip(),
            'datum': event_item.select_one('.event-date').text.strip(),
            'místo': event_item.select_one('.event-location').text.strip(),
            'popis': event_item.select_one('.event-description').text.strip(),
        }
        events.append(event)
    
    return events

def ask_chatgpt_for_events(events):
    prompt = (
        "Prosím, uveď seznam všech aktuálních a budoucích železničních akcí v České republice a sousedních zemích, které se konají od 28.05.2024 do budoucnosti. "
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
    all_events = []
    all_events += scrape_cd_nostalgie()
    all_events += scrape_cysnews()
    all_events += scrape_kudyznudy()
    all_events += scrape_zdopravy()
    all_events += scrape_szdc()

    if all_events:
        response = ask_chatgpt_for_events(all_events)
        print("AI Response:")
        print(response)
        
        if response:
            save_response_to_file(response, 'events.json')
        else:
            print("No response from AI.")
    else:
        print("No events found.")

if __name__ == "__main__":
    main()