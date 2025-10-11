#!/bin/bash

# TheMovingDB Docker Setup Script

echo "🚀 TheMovingDB Docker Setup"
echo "============================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Ask user which mode to run
echo "Select deployment mode:"
echo "1. Development (with hot reload)"
echo "2. Production"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Starting in DEVELOPMENT mode..."
        echo "   - Backend: http://localhost:3000 (with hot reload)"
        echo "   - Frontend: http://localhost:5173 (with HMR)"
        echo ""
        docker compose up
        ;;
    2)
        echo ""
        echo "🚀 Starting in PRODUCTION mode..."
        echo "   - Backend: http://localhost:3000"
        echo "   - Frontend: http://localhost:80"
        echo ""
        docker compose -f docker-compose.prod.yml up -d
        echo ""
        echo "✅ Services started in background"
        echo "   View logs: docker compose -f docker-compose.prod.yml logs -f"
        echo "   Stop services: docker compose -f docker-compose.prod.yml down"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again and select 1 or 2."
        exit 1
        ;;
esac
