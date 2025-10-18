# TheMovingDB

A full-stack moving inventory management application built with Bun.js (backend) and React (frontend). Track your items, boxes, and their locations during your move with an intuitive interface.

## Features

- **Dashboard**: View statistics about your total boxes and items, organized by location
- **Box Management**: Create, edit, delete, and track boxes with labels, numbers, and locations
- **Item Management**: Add items with descriptions, categories, and conditions
- **Smart Organization**: Assign items to boxes and track which box is where
- **Search & Filter**: Quickly find boxes or items by search or filter by location
- **Location Tracking**: Track items across old home, new home, and storage

## Tech Stack

- **Backend**: Bun.js with built-in SQLite database
- **Frontend**: React with TypeScript and Vite
- **Styling**: Modern CSS with responsive design

## Prerequisites

- [Bun](https://bun.sh) - Fast JavaScript runtime (for backend)
- [Node.js](https://nodejs.org) - For frontend development

**OR**

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) - For containerized deployment

## Installation

### Docker Deployment (Recommended)

For the easiest setup with Docker, see the [Docker Deployment Guide](DOCKER.md) for detailed instructions.

**Quick start:**

```bash
# Development mode with hot reload
docker compose up

# Production mode
docker compose -f docker-compose.prod.yml up -d
```

Or use the setup script:

```bash
./docker-setup.sh
```

#### Development Mode (with hot reload)

Run the application in development mode with auto-reload:

```bash
docker-compose up
```

This will start:
- Backend on `http://localhost:3000` with hot reload (file changes auto-restart)
- Frontend on `http://localhost:5173` with Vite HMR (hot module replacement)

The source code is mounted as volumes, so any changes you make will automatically reload the services.

#### Production Mode

Run the application in production mode:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

This will start:
- Backend on `http://localhost:3000` (optimized Bun runtime)
- Frontend on `http://localhost:80` (served by Bun.serve())

To stop the containers:
```bash
docker-compose -f docker-compose.prod.yml down
```

To rebuild after code changes:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Quick Start (Recommended)

Install all dependencies at once:
```bash
npm run install:all
```

Then run both backend and frontend together:
```bash
npm run dev
```

This will start:
- Backend on `http://localhost:3000`
- Frontend on `http://localhost:5173`

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (Bun will handle this automatically):
   ```bash
   bun install
   ```

3. Start the backend server:
   ```bash
   bun run index.ts
   ```

   The backend will start on `http://localhost:3000` and create a SQLite database (`moving.db`) automatically.

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## Usage

1. Start both backend and frontend servers
2. Open your browser to `http://localhost:5173`
3. Use the navigation tabs to switch between Dashboard, Boxes, and Items
4. Add boxes with labels, numbers, and locations
5. Add items and assign them to boxes
6. Use search and filters to find specific boxes or items
7. View the dashboard for overall statistics

## API Endpoints

### Boxes
- `GET /api/boxes` - Get all boxes (supports search and location filters)
- `POST /api/boxes` - Create a new box
- `GET /api/boxes/:id` - Get a specific box
- `PUT /api/boxes/:id` - Update a box
- `DELETE /api/boxes/:id` - Delete a box
- `GET /api/boxes/:id/items` - Get all items in a box

### Items
- `GET /api/items` - Get all items (supports search, box_id, and category filters)
- `POST /api/items` - Create a new item
- `GET /api/items/:id` - Get a specific item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Database Schema

### Boxes Table
- `id` - Primary key
- `label` - Box label/description
- `number` - Unique box number
- `room` - Room or area name
- `location` - Current location (old_home, new_home, storage)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Items Table
- `id` - Primary key
- `name` - Item name
- `description` - Optional description
- `category` - Optional category
- `condition` - Item condition
- `box_id` - Foreign key to boxes (nullable)
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Development

### Backend
The backend uses Bun's built-in web server and SQLite database. The server automatically initializes the database schema on startup.

### Frontend
The frontend is built with React and TypeScript using Vite for fast development. It uses a component-based architecture with dedicated components for forms, lists, and the dashboard.

### Environment Variables

#### Frontend
- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:3000/api`)

#### Backend
- `PORT` - Server port (default: `3000`)
- `NODE_ENV` - Environment mode (`development` or `production`)

## Project Structure

```
TheMovingDB/
├── backend/
│   ├── index.ts          # Main server file
│   ├── database.ts       # Database setup and schema
│   ├── types.ts          # TypeScript type definitions
│   ├── Dockerfile        # Production Docker image
│   ├── Dockerfile.dev    # Development Docker image with hot reload
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.tsx       # Main app component
│   │   ├── api.ts        # API service layer
│   │   └── types.ts      # TypeScript types
│   ├── server.ts         # Production Bun server
│   ├── Dockerfile        # Production Docker image
│   ├── Dockerfile.dev    # Development Docker image with HMR
│   └── package.json
├── docker-compose.yml         # Development compose file
├── docker-compose.prod.yml    # Production compose file
├── docker-setup.sh            # Interactive setup script
├── DOCKER.md                  # Docker deployment guide
└── README.md
```

## License

MIT
