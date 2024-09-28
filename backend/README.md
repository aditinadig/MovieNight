
# Movie Night - Backend

## Prerequisites

Before starting the backend server, ensure you have the following installed on your system:

1. **Node.js** (v14.x or later)
   - Install from [Node.js official website](https://nodejs.org/).
   - Check if Node.js is installed:
     ```bash
     node -v
     ```

2. **PostgreSQL**
   - Install PostgreSQL using Homebrew (macOS):
     ```bash
     brew install postgresql
     brew services start postgresql
     ```
   - Check if PostgreSQL is installed:
     ```bash
     psql --version
     ```
   - Create the database:
     ```bash
     createdb movienightdb
     ```

3. **Git**
   - Install Git:
     ```bash
     brew install git
     ```
   - Check if Git is installed:
     ```bash
     git --version
     ```

4. **Sequelize CLI**
   - Install Sequelize CLI globally:
     ```bash
     npm install -g sequelize-cli
     ```

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/movie-night-picker.git
   cd movie-night-picker/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the `.env` file in the root of the `backend` folder and add the following variables:

   ```bash
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=movienightdb
   DB_HOST=127.0.0.1
   DB_DIALECT=postgres
   ```

4. Run migrations to set up the database:

   ```bash
   npx sequelize-cli db:migrate
   ```

## Starting the Backend Server

1. Start the backend server:

   ```bash
   node server.js
   ```

2. The backend server should now be running on `http://localhost:3000`.

## Additional Notes

- Make sure PostgreSQL is running:
  ```bash
  brew services start postgresql
  ```
