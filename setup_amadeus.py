"""
Amadeus API Setup Helper
Guides you through setting up your Amadeus API credentials
"""
import os
import sys
from pathlib import Path

def check_env_file():
    """Check if .env file exists and has required variables"""
    env_path = Path("backend/.env")
    
    if not env_path.exists():
        print("[ERROR] backend/.env file not found")
        return False
    
    # Read the file
    with open(env_path, 'r') as f:
        content = f.read()
    
    # Check for required variables
    required_vars = ["OPENAI_API_KEY", "AMADEUS_API_KEY", "AMADEUS_API_SECRET"]
    missing_vars = []
    
    for var in required_vars:
        if f"{var}=" not in content or f"{var}=your_" in content or f"{var}=sk-your" in content:
            missing_vars.append(var)
    
    if missing_vars:
        print(f"[ERROR] Missing or placeholder values for: {', '.join(missing_vars)}")
        return False
    
    print("[OK] backend/.env file looks good!")
    return True

def create_env_template():
    """Create a template .env file"""
    env_path = Path("backend/.env")
    
    if env_path.exists():
        print("[WARNING] backend/.env already exists. Backing up to backend/.env.backup")
        env_path.rename("backend/.env.backup")
    
    template = """# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key-here

# Amadeus API Configuration
AMADEUS_API_KEY=your_amadeus_api_key_here
AMADEUS_API_SECRET=your_amadeus_api_secret_here
AMADEUS_API_BASE=https://test.api.amadeus.com
"""
    
    with open(env_path, 'w') as f:
        f.write(template)
    
    print("[OK] Created backend/.env template file")
    return True

def main():
    """Main setup function"""
    print("Amadeus API Setup Helper")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path("backend").exists():
        print("[ERROR] Please run this script from the project root directory")
        print("   Current directory should contain 'backend' folder")
        return
    
    # Check if .env exists and is properly configured
    if check_env_file():
        print("\n[SUCCESS] Your .env file is properly configured!")
        print("   You can now run: python test_amadeus_api.py")
        return
    
    print("\n[INFO] Let's set up your Amadeus API credentials:")
    print("\n1. Go to https://developers.amadeus.com")
    print("2. Register for an account (if you haven't already)")
    print("3. Sign in and go to 'My Self-Service Workspace'")
    print("4. Click 'Create New App'")
    print("5. Fill in your app details and click 'Create'")
    print("6. Copy your API Key and API Secret")
    
    print("\n[INFO] For OpenAI API Key:")
    print("1. Go to https://platform.openai.com")
    print("2. Sign in and go to 'API Keys'")
    print("3. Click 'Create new secret key'")
    print("4. Copy the key (starts with sk-)")
    
    # Create template file
    create_env_template()
    
    print("\n[OK] I've created backend/.env template for you")
    print("   Please edit it with your real API credentials")
    print("   Then run: python test_amadeus_api.py")

if __name__ == "__main__":
    main()
