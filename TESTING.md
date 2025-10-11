# Testing Guide

## Quick Start

### Terminal 1 - Backend
```bash
cd backend
bun run index.ts
```
Backend will start on http://localhost:3000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will start on http://localhost:5173

## Features to Test

### Dashboard
- View total boxes and items count
- See boxes by location breakdown (Old Home, New Home, Storage)
- See items by location breakdown (including Unassigned)

### Boxes Management
- Create a box with label, number, room, and location
- Edit an existing box
- Delete a box
- Search for boxes by label, number, or room
- Filter boxes by location
- View items in a specific box

### Items Management
- Create an item with name, description, category, condition
- Assign an item to a box (or leave unassigned)
- Edit an existing item
- Delete an item
- Search for items by name, description, or category
- Filter items by box
- See which box an item is in

## Test Scenarios

1. **Create Box Flow**
   - Click "Boxes" tab
   - Click "+ Add Box"
   - Fill in: Label="Kitchen Items", Number=1, Room="Kitchen", Location="Old Home"
   - Click "Create Box"
   - Verify box appears in the list

2. **Create Item Flow**
   - Click "Items" tab
   - Click "+ Add Item"
   - Fill in: Name="Plates", Description="Dinner plates", Category="Kitchenware", Condition="Good"
   - Select a box from dropdown
   - Click "Create Item"
   - Verify item appears in the list

3. **Dashboard Updates**
   - Go to Dashboard
   - Verify totals reflect created boxes and items
   - Verify location breakdowns are accurate

4. **Search and Filter**
   - In Boxes: Type in search box to find specific boxes
   - In Boxes: Use location filter dropdown
   - In Items: Type in search box to find specific items
   - In Items: Use box filter dropdown

5. **Edit Operations**
   - Click "Edit" on a box or item
   - Modify fields
   - Save changes
   - Verify updates appear

6. **Delete Operations**
   - Click "Delete" on a box or item
   - Confirm deletion
   - Verify item is removed
   - If deleting a box, verify items are unassigned (not deleted)

## Database

The SQLite database (`moving.db`) is created automatically in the backend directory when you first start the server. You can reset it by stopping the server and deleting the file.
