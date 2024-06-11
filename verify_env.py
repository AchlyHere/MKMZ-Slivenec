import os
from dotenv import load_dotenv

# Manually specify the path to the .env file
dotenv_path = 'C:\\Users\\ADMIN\\Documents\\Web\\MKMŽ Slivenec\\.env'
print(f"Loading .env file from: {dotenv_path}")

# Check if .env file exists
if os.path.exists(dotenv_path):
    print(".env file exists.")
else:
    print(".env file does not exist. Please create it in the current directory.")

# Reload environment variables
load_dotenv(dotenv_path, override=True)

def main():
    api_key = os.getenv('OPENAI_API_KEY')
    if api_key:
        print("API Key found:", api_key)
    else:
        print("API Key not found. Please check your environment variable settings.")

if __name__ == "__main__":
    main()
import os
from dotenv import load_dotenv

# Manually specify the path to the .env file
dotenv_path = 'C:\\Users\\ADMIN\\Documents\\Web\\MKMŽ Slivenec\\.env'
print(f"Loading .env file from: {dotenv_path}")

# Check if .env file exists
if os.path.exists(dotenv_path):
    print(".env file exists.")
else:
    print(".env file does not exist. Please create it in the current directory.")

# Reload environment variables
load_dotenv(dotenv_path, override=True)

def main():
    api_key = os.getenv('OPENAI_API_KEY')
    if api_key:
        print("API Key found:", api_key)
    else:
        print("API Key not found. Please check your environment variable settings.")

if __name__ == "__main__":
    main()
