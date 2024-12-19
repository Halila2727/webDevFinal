# Joke API: Jokes by Category

## About
This project is a fully functional CRUD app that utilizes the Joke API (`https://v2.jokeapi.dev/`) to deliver a joke from a category of user's choice. It also stores all the jokes in a table for the user to be able to view it.

## Prerequisites
* **Install PostgreSQL (Postgres):** required to run the database
* **Node.js** 

## Setup
After cloning the repository and installing the dependencies,

**Create a `.env` file in the root directory with the following variables:**
```bash
PORT=3000
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jokes_db
```

**Set up PostgreSQL database accordingly**

**Start the server**
```bash
npm run dev
```