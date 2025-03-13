This project is a full-stack web application using:

- **Frontend:** React (served via Nginx)
- **Backend:** Node.js with Express
- **Containerization:** Docker & Docker Compose

### 1️⃣ **Install Docker & Docker Compose**

First , you need to install Docker and Docker Compose on your machine. You can download the installation files
from the official Docker website: https://www.docker.com/get-started
Follow the installation instructions for your operating system.
Verify that Docker and Docker Compose are installed correctly by running the following commands in your terminal:
bash
docker --version
docker-compose --version
exit

### 2️⃣ **Clone the Repository**

Clone the repository to your local machine using the following command:
bash
git clone https://github.com/Deviousmindapex/uzdevums.git

### 3️⃣ **Navigate to the Project Directory**

Navigate to the project directory:
bash
cd your-repo-name

### 4️⃣ **Build and Start the Containers**

Build and start the containers using the following command:
bash
docker-compose up --build
This command will build the Docker images for the frontend and backend services and start the containers.

### 5️⃣ **Access the Application**

Access the application by navigating to `http://localhost:8080` in your web browser.

### 6️⃣ **Verify the Application**

Verify that the application is working correctly by checking the following:

- The frontend service is serving the React application.
- The backend service is serving the API endpoints.
- The application is responding correctly to user interactions.

### 7️⃣ **Stop and Remove the Containers**

When you are finished testing the application, stop and remove the containers using the following command:
bash
docker-compose down
This will stop and remove the containers, but it will not delete the Docker images. If you want
to delete the Docker images, use the following command:
bash
docker system prune -af
