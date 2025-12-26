import urllib.request
import urllib.error
import json
import sys
import time

def check_url(url, description):
    print(f"Checking {description} at {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            status = response.getcode()
            if status == 200:
                print(f"✅ {description} is UP (Status: 200)")
                return True
            else:
                print(f"❌ {description} returned status {status}")
                return False
    except urllib.error.URLError as e:
        print(f"❌ {description} failed: {e}")
        return False

def check_api_health(url):
    print(f"Checking Backend Health at {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            data = json.load(response)
            if data.get("status") == "OK":
                print(f"✅ Backend Health is OK: {data}")
                return True
            else:
                print(f"❌ Backend Health returned unexpected status: {data}")
                return False
    except Exception as e:
        print(f"❌ Backend Health check failed: {e}")
        return False

def main():
    print("Starting Smoke Test...")

    # Frontend check
    frontend_ok = check_url("http://localhost:3000", "Frontend")

    # Backend Health check
    backend_ok = check_api_health("http://localhost:8080/api/health")

    if frontend_ok and backend_ok:
        print("\n✅ All Smoke Tests PASSED!")
        sys.exit(0)
    else:
        print("\n❌ Smoke Tests FAILED!")
        sys.exit(1)

if __name__ == "__main__":
    main()
