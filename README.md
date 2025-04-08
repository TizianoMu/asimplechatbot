# ChatBoat Application

This project is a simple chat application built with React for the frontend and Flask for the backend. It allows users to interact with a chatbot and view related documents. The chatbot uses Google Gemini API.

## Project Structure

The project is organized into the following directories:

-   `backend/`: Contains the Flask backend application.
-   `frontend/`: Contains the React frontend application.
-   `docker-compose.yaml`: Defines the Docker Compose configuration for running the application.

## Prerequisites

Before you begin, ensure you have the following installed:

-   Docker
-   Docker Compose

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/TizianoMu/asimplechatbot.git
    cd asimplechatbot
    ```

2.  **Build and run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command will build the Docker images for both the frontend and backend and start the containers.

3.  **Access the application:**

    -   The React frontend will be available at `http://localhost:3000`.
    -   The Flask backend will be available at `http://localhost:5000`.

## Application Description

The application consists of a React-based chat interface that communicates with a Flask backend.

-   **Frontend (React):**
    -      Provides a user interface for interacting with the chatbot.
    -      Sends user messages to the Flask backend.
    -      Displays chatbot responses and related documents.
    -   Uses `REACT_APP_API_URL` environment variable to connect to the backend.
-   **Backend (Flask):**
    -      Receives user messages from the frontend.
    -      Processes the messages and generates chatbot responses.
    -      Provides an endpoint to retrieve related documents.
    -   Uses a dockerfile to install python dependencies from requirements.txt.
-   **Docker Compose:**
    -      Orchestrates the frontend and backend containers.
    -      Sets up networking between the containers.
    -      Mounts local directories as volumes for development.
## Usage

1.  Open your web browser and navigate to `http://localhost:3000`.
2.  Type your message in the input field and click "Invia".
3.  The chatbot's response will be displayed in the chat interface.
4.  Click the "Documenti" button to view related documents.

## Development

-   Any changes made to the `backend/` or `frontend/` directories will be reflected in the running containers due to the volume mounts.
-   To rebuild the Docker images, use `docker-compose up --build`.
-   To stop the containers, use `docker-compose down`.

## Notes

-   Ensure that the `requirements.txt` file in the `backend/` directory lists all the necessary Python dependencies.
-   Ensure that the `package.json` file in the `frontend/` directory lists all the necessary Node.js dependencies.
-   The `REACT_APP_API_URL` environment variable in the `docker-compose.yaml` file should match the backend API URL.

## Contributors
    Tiziano Murzio (tiziano.murzio@outlook.it)
