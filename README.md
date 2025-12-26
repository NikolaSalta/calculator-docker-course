# Calculator Project - QA & DevOps Review

This repository contains a full-stack Calculator application with a Java Spring Boot backend and a React frontend.

## Project Structure

- `backend/`: Java Spring Boot application
- `frontend/`: React application with Nginx
- `docker-compose.yml`: Docker Compose configuration for running the full stack
- `tests/`: Test scripts

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.

## How to Run

1.  **Build and Start** the application using Docker Compose:

    ```bash
    docker compose up --build -d
    ```

2.  **Access the Application**:
    - **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser.
    - **Backend API**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

3.  **Stop the Application**:

    ```bash
    docker compose down
    ```

## Testing

### Smoke Test
An automated smoke test script is available to verify that the services are up and running.

Prerequisite: Python 3 installed.

1.  Start the application (see "How to Run").
2.  Run the smoke test:

    ```bash
    python3 tests/smoke_test.py
    ```

    You should see output indicating that both Frontend and Backend are UP and healthy.

## Security & Configuration Notes

This project has been configured with DevOps best practices:

- **Non-root containers**: Both Backend and Frontend containers run as non-privileged users (`appuser` and `nginx` respectively) to minimize security risks.
- **Security Headers**: Nginx is configured with security headers:
    - `X-Frame-Options: SAMEORIGIN`
    - `X-Content-Type-Options: nosniff`
    - `X-XSS-Protection: 1; mode=block`
    - `Referrer-Policy: strict-origin-when-cross-origin`
- **Multi-stage Builds**: Dockerfiles use multi-stage builds to keep image sizes small and exclude source code from production images.
- **Port 8080**: Both services inside containers listen on port 8080 to allow non-root operation.

## Development

- **Backend**: Standard Maven project.
  - Build: `mvn clean package`
- **Frontend**: Standard Node.js/React project.
  - Install: `npm install`
  - Start: `npm start`
