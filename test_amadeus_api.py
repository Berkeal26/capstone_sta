"""
Simple standalone test for Amadeus API connection
Tests OAuth2 token retrieval and basic API functionality
"""
import asyncio
import os
import sys
from dotenv import load_dotenv

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from services.amadeus_service import AmadeusService


async def test_amadeus_connection():
    """Test basic Amadeus API connection"""
    print("Testing Amadeus API Connection")
    print("=" * 40)
    
    # Load environment variables from backend/.env
    load_dotenv("backend/.env")
    
    # Check if credentials are set in environment
    if not os.getenv("AMADEUS_API_KEY") or not os.getenv("AMADEUS_API_SECRET"):
        print("\n[SETUP REQUIRED] You need to set up your Amadeus API credentials first!")
        print("\nSteps to get your credentials:")
        print("1. Go to https://developers.amadeus.com")
        print("2. Register for an account")
        print("3. Go to 'My Self-Service Workspace'")
        print("4. Click 'Create New App'")
        print("5. Copy your API Key and API Secret")
        print("6. Create backend/.env file with:")
        print("   AMADEUS_API_KEY=your_real_api_key")
        print("   AMADEUS_API_SECRET=your_real_api_secret")
        print("   AMADEUS_API_BASE=https://test.api.amadeus.com")
        print("\nThen run this test again.")
        return False
    
    # Check if API keys are set
    api_key = os.getenv("AMADEUS_API_KEY")
    api_secret = os.getenv("AMADEUS_API_SECRET")
    
    if not api_key or not api_secret:
        print("[ERROR] AMADEUS_API_KEY and AMADEUS_API_SECRET must be set in .env file")
        print("   Please copy env.example to .env and add your Amadeus credentials")
        return False
    
    print(f"[OK] API Key found: {api_key[:10]}...")
    print(f"[OK] API Secret found: {'*' * len(api_secret)}")
    
    try:
        # Initialize service
        print("\n[INFO] Initializing Amadeus service...")
        amadeus_service = AmadeusService()
        
        # Test OAuth2 token retrieval
        print("[INFO] Testing OAuth2 token retrieval...")
        token = await amadeus_service._get_access_token()
        print(f"[OK] Access token retrieved: {token[:20]}...")
        
        # Test simple API call (flight inspiration)
        print("\n[INFO] Testing flight inspiration API...")
        result = await amadeus_service.get_flight_inspiration(
            origin="PAR",
            max_price=500
        )
        
        if result.get('error'):
            print(f"[ERROR] API call failed: {result['error']}")
            return False
        
        destinations = result.get('destinations', [])
        print(f"[OK] API call successful! Found {len(destinations)} destinations")
        
        if destinations:
            print("\nSample destinations:")
            for i, dest in enumerate(destinations[:3], 1):
                print(f"   {i}. {dest.get('destination', 'N/A')} - {dest.get('price', 'N/A')} {dest.get('currency', 'USD')}")
        
        # Clean up
        await amadeus_service.close()
        
        print("\n[SUCCESS] Amadeus API connection test successful!")
        return True
        
    except Exception as e:
        print(f"[ERROR] Test failed: {e}")
        return False


async def main():
    """Main test runner"""
    success = await test_amadeus_connection()
    
    if success:
        print("\n[SUCCESS] All tests passed! Amadeus API is working correctly.")
        print("   You can now run the full integration test: python backend/test_amadeus_integration.py")
    else:
        print("\n[ERROR] Tests failed. Please check your API credentials and try again.")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
