#!/bin/bash

# Smart Travel Assistant v2.0.0 - Complete Setup Script
# This script ensures everything is properly configured and working

set -e

echo "🚀 Smart Travel Assistant v2.0.0 - Complete Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "src/App.js" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check Node.js version
print_status "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_warning "Node.js version $NODE_VERSION detected. Switching to Node 18..."
    if command -v nvm &> /dev/null; then
        nvm use 18
    else
        print_error "Please install Node.js 18+ or use nvm to switch versions"
        exit 1
    fi
fi

print_success "Node.js $(node --version) detected"

# Check Python version
print_status "Checking Python version..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
print_success "Python $PYTHON_VERSION detected"

# Clean up any existing processes
print_status "Cleaning up existing processes..."
pkill -f "python3 -m http.server" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Install dependencies
print_status "Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
else
    print_status "Dependencies already installed"
fi

# Verify all required components exist
print_status "Verifying project structure..."

REQUIRED_FILES=(
    "src/App.js"
    "src/pages/Chat.jsx"
    "src/pages/Home.jsx"
    "src/components/dashboard/FlightDashboard.jsx"
    "src/components/dashboard/FlightMap.jsx"
    "src/components/dashboard/PriceChart.jsx"
    "src/components/dashboard/FlightsTable.jsx"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Missing required file: $file"
        exit 1
    fi
done

print_success "All required files present"

# Build the project
print_status "Building project..."
npm run build

if [ ! -d "build" ] || [ ! -f "build/index.html" ]; then
    print_error "Build failed. Please check the build output."
    exit 1
fi

print_success "Project built successfully"

# Test backend connectivity
print_status "Testing backend connectivity..."
if curl -s https://capstone-79wenhjg2-berkes-projects-f48a9605.vercel.app/api/health | grep -q "healthy"; then
    print_success "Backend is healthy"
else
    print_warning "Backend health check failed - app will still work with mock data"
fi

# Create startup script if it doesn't exist
if [ ! -f "start.sh" ]; then
    print_status "Creating startup script..."
    cat > start.sh << 'EOF'
#!/bin/bash

# Smart Travel Assistant v2.0.0 - Quick Start Script

echo "🚀 Starting Smart Travel Assistant v2.0.0..."

# Check if build exists
if [ ! -d "build" ]; then
    echo "📦 Building project..."
    npm run build
fi

# Start the server
echo "🌐 Starting local server on http://localhost:3000"
echo "📱 Open your browser and enjoy the new dashboard features!"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd build && python3 -m http.server 3000
EOF
    chmod +x start.sh
    print_success "Startup script created"
fi

# Make sure start.sh is executable
chmod +x start.sh

# Start the server
print_status "Starting development server..."
print_success "Setup complete! Starting server..."

echo ""
echo "🎉 Smart Travel Assistant v2.0.0 is ready!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: https://capstone-79wenhjg2-berkes-projects-f48a9605.vercel.app"
echo ""
echo "🧪 Test the dashboard by asking about flights in the chat!"
echo "📖 See QUICK_START.md for more information"
echo ""

cd build && python3 -m http.server 3000
