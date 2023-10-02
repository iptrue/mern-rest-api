My Server

This is a server application built with Node.js and Express.js. It provides various API endpoints to interact with a
MongoDB database using the Prisma ORM. The server supports user registration, login, authentication, and CRUD operations
on user data.

Prerequisites

Before running the server, make sure you have the following installed on your machine:

• Node.js
• Docker

Getting Started

To get started with the server, follow these steps:

1. Clone the repository:

bash
git clone [repository_url]

2. Set up the environment variables:

Create a .env file in the root directory of the project and add the following variables:

dotenv
DB_URL=mongodb://mongo:27017/mydatabase
PORT=5000
CLIENT_URL=http://localhost:3000 (or any other client URL)

Make sure to replace DB_URL with the connection URL for your MongoDB database.

3. Build and run the server using Docker Compose:

bash
docker-compose up --build

The server will be running on http://localhost:4000.

API Endpoints

The server exposes the following API endpoints:

• POST /api/registration - Register a new user.
• POST /api/login - Login and authenticate a user.
• POST /api/logout - Logout a user.
• GET /api/activate/:activationLink - Activate a user account.
• GET /api/refresh - Refresh user tokens.
• GET /api/users - Get a list of all users.
• GET /api/users/:userId - Get user details by ID.
• PUT /api/users/:userId - Update user details by ID.
• DELETE /api/users/:userId - Delete a user by ID.

Documentation

The server is equipped with Swagger for API documentation. You can access the API documentation at /api-docs. The
documentation provides details about each API endpoint, their parameters, and expected responses.

Acknowledgements

This server application was built with the help of the following libraries and tools:

• Node.js
• Express.js
• Prisma
• MongoDB
• Swagger

Docker Compose

You can also run the server using Docker Compose. Make sure you have Docker installed on your machine.
Run the following command to start the server:

bash
docker-compose up --build

The server will be running on http://localhost:4000.