# Task Manager

## Description

Task Manager is a full-stack web application for managing daily tasks. Users can create, view, update, delete, search, and filter tasks, as well as mark them as completed.

The project was built with React on the client side and Express on the server side. Prisma is used to communicate with a SQLite database.

## Technologies

- React
- Node.js
- Express
- Prisma
- SQLite

## Project Structure

- `client` – React application
- `server` – REST API and database logic

## Running the Project

### Server

bash
cd server
npm install
npm run dev


### Client

bash
cd client
npm install
npm run dev


Open the application at:


http://localhost:5173


## API Endpoints

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`