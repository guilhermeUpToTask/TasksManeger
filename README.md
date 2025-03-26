# Fullstack Project Template - TasksManager

A **Fullstack Project Template** based on [Fullstack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template) that can be deployed on any VPS with minimal configuration.

This project is a simple **Task Manager Application** built as an example to showcase a full-stack architecture featuring a modern React front-end and a robust FastAPI back-end.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Deployment](#deployment)
- [Live Demo](#live-demo)
- [License](#license)

---

## Overview

This project is a fullstack application that includes:

- **Frontend:** A React Single Page Application (SPA) written in TypeScript.
- **Backend:** A FastAPI application featuring SQLModel for database interaction, Alabemic for migrations, and Pydantic for data validation.
- **Database:** PostgreSQL running in a Docker container.
- **DevOps:** Docker Compose to orchestrate services with an Nginx reverse proxy ensuring HTTPS connectivity.
- **CI/CD:** Automated testing and deployment pipelines using GitHub Actions that deploy changes only after merging into the main branch.

The environment is designed to be lightweight and modular, making it easy to run on any Linux VPS (e.g., Amazon EC2) with basic configuration.

---

## Features

- **Modern Frontend:**
  - Built with React and TypeScript.
  - Client code automatically generated via OpenAPI TS.
  - End-to-end testing using Playwright.
- **Robust Backend:**
  - FastAPI-powered API.
  - SQLModel for seamless database interaction.
  - **Alabemic for migrations** to handle schema changes effectively.
  - Pydantic models for data validation.
  - Automated unit testing with PyTest.
- **Database:**
  - PostgreSQL containerized with Docker.
- **DevOps & Deployment:**
  - Docker Compose orchestrates all services.
  - Nginx as a reverse proxy with HTTPS support using CertBot and LetsEncrypt.
  - CI/CD pipelines with GitHub Actions ensure that all tests pass before deployment.
  - **Deployments are triggered only after merging changes into the main branch.**
- **Hosting:**
  - Can be deployed on Amazon EC2 or any Linux VPS.
  - Domain management via No-IP.

---

## Tech Stack

### Backend

- **FastAPI**
- **SQLModel**
- **Alabemic**
- **PyTest**
- **Pydantic**
- **OpenAPI**

### Frontend

- **React**
- **Chakra UI**
- **TanStack Query**
- **Axios**
- **React Hook Form**
- **OpenAPI TypeScript Codegen**
- **Playwright (E2E testing)**

### Database

- **PostgreSQL** (Dockerized)

### Environment & DevOps

- **Docker Images & Docker Compose**
- **Nginx** (Reverse Proxy and HTTPS)
- **CertBot & LetsEncrypt**

### CI/CD

- **GitHub Actions Workflow** (automated testing & deployment)

### Hosting & Domain

- **Amazon EC2** (or any Linux VPS)
- **No-IP** (domain provider)

---

## Installation & Setup

### Prerequisites

- Docker & Docker Compose installed
- Git

### Steps

1. **Clone the repository:**

2. **Configure Environment Variables:**\
   Create a `.env` file (or adjust environment settings) for both backend and frontend as needed.

3. **Build & Start Services:**

4. **Access the Application:**\
   Navigate to `http://localhost` (or your configured domain) to see the Task Manager in action.

---

## Testing

- **Backend:** Run unit tests using PyTest.

- **Frontend:** Execute end-to-end tests using Playwright.

Ensure all tests pass before deploying changes.

---

## CI/CD

This project leverages GitHub Actions with multiple workflows for continuous integration, end-to-end testing, and deployment.

### CI Workflow

The **CI** workflow is triggered on every push or pull request to the **main** branch. It performs the following steps:

- **Checkout and Setup:**
  - Checks out the repository.
  - Generates a self-signed certificate.
  - Sets up Docker Buildx.
  - Logs into Docker Hub using stored secrets.

- **Build and Integration Testing:**
  - Builds and starts all services using Docker Compose.
  - Waits for the PostgreSQL database to be ready.
  - Runs prestart tasks.
  - Executes backend tests using PyTest.
  - Waits for Nginx to serve the frontend properly and verifies the response.

- **Docker Image Management:**
  - Tags the development Docker images (for backend and Nginx) as production images.
  - Pushes the tagged images to Docker Hub.

- **Teardown:**
  - Tears down the Docker Compose services, cleaning up any volumes.

The CI workflow ensures that all integration tests pass before any deployment is considered.

---

### Deployment Workflow

Deployments are triggered automatically **after merging into the main branch**. The deployment job runs on a self-hosted runner and performs the following:

- Checks out the latest code.
- Pulls the latest Docker images from Docker Hub.
- Stops and removes any existing containers.
- Restarts the services using Docker Compose with the updated images.

This approach ensures that only tested and approved changes are deployed to the production environment.

---

### End-to-End (Playwright) Testing Workflow

The **Playwright Tests** workflow is triggered on push, pull requests to the main branch, or manually via workflow dispatch. It includes:

- Checking out the repository.
- Building and starting the Docker Compose services.
- Waiting for all services to become healthy (e.g., verifying the database and other services).
- Running end-to-end tests using Playwright with options to retain traces on test failures.
- Tearing down the services once tests complete.

This workflow adds an extra layer of verification by ensuring that the end-to-end user experience remains intact.

---

Together, these workflows create a robust CI/CD pipeline that guarantees quality at every stage—from integration testing to production deployment—only after changes are merged into the main branch.

## Live Demo

Experience the live demo of the Task Manager application at:\
**[Live Demo URL]**\
[https://taskmaneger.zapto.org/]

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to further customize based on your project's evolving requirements. Enjoy building and deploying your fullstack application!
