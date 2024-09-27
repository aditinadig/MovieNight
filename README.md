
# Movie Night Picker

## Overview

Movie Night Picker is a fun, interactive web application designed to enhance group movie nights and sleepovers. The app allows users to search for movies, plan movie events, vote on what to watch, and engage in real-time interactive games, making every movie night a memorable experience.

## Features

- **Movie Search and Recommendations**: Search for movies by genre, mood, or actor using the TMDb API.
- **Random Movie Picker**: Use the "Surprise Me" option to randomly select a movie based on filters.
- **Create Movie Night Events**: Plan movie nights by creating events, inviting friends, and setting up a list of movies to vote on.
- **Voting System**: Friends can vote in real-time on which movie to watch using WebSockets for live updates.
- **Custom Movie Themes**: Create themed movie nights with custom playlists (e.g., "80s Classics," "Action Heroes").
- **Movie Night Bingo-Scavenger Hunt**: A real-time game where users compete to spot specific objects or scenes during the movie.
- **Custom Quizzes and Polls**: Challenge friends with custom trivia and movie polls on categories like "Best Cinematography" or "Funniest Dialogue."
- **Watch History and Favorites**: Track movie history and favorite moments, and share them with friends.

## Prerequisites

- **Node.js**: v14.x or later.
- **PostgreSQL**: Ensure PostgreSQL is installed and running.
- **Git**: For version control.
- **Sequelize CLI**: For managing database migrations.

## Setup

### 1. Backend Setup

- Navigate to the `backend/` folder:
  ```bash
  cd backend
  ```
- Install the required dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file with the following content:
  ```bash
  DB_USER=your_db_username
  DB_PASSWORD=your_db_password
  DB_NAME=movienightdb
  DB_HOST=127.0.0.1
  DB_DIALECT=postgres
  ```
- Run the migrations to set up the database:
  ```bash
  npx sequelize-cli db:migrate
  ```
- Start the backend server:
  ```bash
  node server.js
  ```

### 2. Frontend Setup

- Navigate to the `frontend/` folder:
  ```bash
  cd frontend
  ```
- Install the required dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file with the following content:
  ```bash
  REACT_APP_API_URL=http://localhost:3000
  ```
- Start the frontend server:
  ```bash
  npm start
  ```

## Running the App

1. Ensure that the **backend** server is running on `http://localhost:3000`.
2. Start the **frontend** server, which will run on `http://localhost:3000`.
3. Open the web app in a browser and enjoy the features!

## Technologies Used

- **Frontend**: React.js
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL, Sequelize
- **Real-Time Communication**: WebSockets (Socket.IO)
- **APIs**: TMDb API for movie data, Trivia API for quizzes.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add some new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
