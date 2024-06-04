import time
import json
from datetime import datetime, timedelta
import os
import openai
from tavily import TavilyClient
from dotenv import load_dotenv

# Načtení API klíčů z .env souboru
dotenv_path = 'C:\\Users\\ADMIN\\Documents\\Web\\MKMŽ Slivenec\\.env'
load_dotenv(dotenv_path, override=True)

OPEN_AI_API_KEY = os.getenv('OPEN_AI_API_KEY')
TAVILY_API_KEY = os.getenv('TAVILY_API_KEY')

openai.api_key = OPEN_AI_API_KEY
tavily_client = TavilyClient(api_key=TAVILY_API_KEY)

client = openai.OpenAI(api_key=OPEN_AI_API_KEY)

assistant_instruction = """You are an analyst specializing in open-source intelligence.
Your role is to gather and analyze publicly available information for market research and competitive analysis.
You will provide insights, trends, and data-driven answers.
Never use your own knowledge to answer questions.
Always include the relevant URLs for the sources you got the data from."""

assistant = client.beta.assistants.create(
    instructions=assistant_instruction,
    model="gpt-4-1106-preview",
    tools=[{
        "type": "function",
        "function": {
            "name": "tavily_search",
            "description": "Get information on ongoing and future railway events from the web.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Provide a list of ongoing and future railway and module railway events starting a week ago from today in Czechia and neighboring countries."},
                },
                "required": ["query"]
            }
        }
    }]
)


def tavily_search(query):
    search_result = tavily_client.get_search_context(query, search_depth="advanced", max_tokens=8000)
    return search_result

def submit_tool_outputs(thread_id, run_id, tools_to_call):
    tool_output_array = []
    for tool in tools_to_call:
        output = None
        tool_call_id = tool.id
        function_name = tool.function.name
        function_args = tool.function.arguments

        if function_name == "tavily_search":
            output = tavily_search(query=json.loads(function_args)["query"])

        if output:
            tool_output_array.append({"tool_call_id": tool_call_id, "output": output})

    return client.beta.threads.runs.submit_tool_outputs(
        thread_id=thread_id,
        run_id=run_id,
        tool_outputs=tool_output_array
    )

# Wait for a run to complete
def wait_for_run_completion(thread_id, run_id):
    while True:
        time.sleep(1)
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
        print(f"Current run status: {run.status}")
        if run.status in ['completed', 'failed', 'requires_action']:
            return run

# Print messages from a thread
def print_messages_from_thread(thread_id):
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    for msg in messages:
        print(f"{msg.role}: {msg.content[0].text.value}")

def save_response_to_file(response, filename):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(json.loads(response), f, ensure_ascii=False, indent=4)
        print(f"Response successfully saved to {filename}")
    except Exception as e:
        print(f"Error saving response to file: {e}")

def should_run_today():
    try:
        with open('last_run_date.txt', 'r') as file:
            last_run_date = file.read().strip()
        if last_run_date == datetime.now().strftime('%Y-%m-%d'):
            return False
    except FileNotFoundError:
        pass
    return True

def update_last_run_date():
    with open('last_run_date.txt', 'w') as file:
        file.write(datetime.now().strftime('%Y-%m-%d'))

if should_run_today():
    assistant_id = assistant.id
    print(f"Assistant ID: {assistant_id}")

    # Create a thread
    thread = client.beta.threads.create()
    print(f"Thread: {thread}")

    # Create a message
    start_date = (datetime.now() - timedelta(days=7)).strftime('%d.%m.%Y')
    prompt = (
        f"Prosím, uveď seznam všech aktuálních a budoucích železničních akcí v České republice a sousedních zemích,"
        f" které se konají od {start_date} do budoucnosti."
        "Seřaď je podle data od nejbližšího po nejvzdálenější a formátuj odpověď jako JSON pole, kde každá akce bude obsahovat 'název', 'datum', 'místo' a 'popis'."
        "Odpověz prosím v češtině."
    )
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=prompt,
    )

    # Create a run
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id,
    )
    print(f"Run ID: {run.id}")

    # Wait for run to complete
    run = wait_for_run_completion(thread.id, run.id)

    if run.status == 'failed':
        print(run.error)
    elif run.status == 'requires_action':
        run = submit_tool_outputs(thread.id, run.id, run.required_action.submit_tool_outputs.tool_calls)
        run = wait_for_run_completion(thread.id, run.id)

    # Print messages from the thread
    print_messages_from_thread(thread.id)

    # Save response to events.json
    messages = list(client.beta.threads.messages.list(thread_id=thread.id))
    if messages and messages[-1].role == "assistant":
        save_response_to_file(messages[-1].content[0].text.value, 'events.json')
        update_last_run_date()
else:
    print("Skript byl již dnes spuštěn.")