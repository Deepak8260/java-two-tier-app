# Two-Tier Employee Directory

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-3.9.9-blue.svg)](https://maven.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/java-two-tier-app/pulls)
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

This repository contains a beginner-friendly two-tier application using:
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Java 21, Spring Boot 3.x, Maven

The app includes an employee dashboard, search, add, delete, and an in-memory REST API.

## Table of Contents

- [Project structure](#project-structure)
- [Setup on AWS Ubuntu EC2](#setup-on-aws-ubuntu-ec2)
- [Setup on a fresh Windows machine](#setup-on-a-fresh-windows-machine)
- [Setup on macOS](#setup-on-macos)
- [Run with Docker](#run-with-docker)
- [Run the backend](#run-the-backend)
- [Run the frontend](#run-the-frontend)
- [API communication flow](#api-communication-flow)
- [CORS and why it is needed](#cors-and-why-it-is-needed)
- [Troubleshooting](#troubleshooting)
- [Quick start checklist](#quick-start-checklist)
- [Notes](#notes)

## Project structure

```
project-root/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── assets/
└── backend/
    ├── src/
    ├── pom.xml
    └── README.md
```

## Setup on AWS Ubuntu EC2

If you want to run this application on an AWS Ubuntu EC2 instance, follow these steps.

### 1. Launch an EC2 instance

1. Open the AWS Management Console.
2. Launch a new EC2 instance using an Ubuntu Server AMI (for example, Ubuntu 22.04 LTS).
3. Choose a security group that allows inbound traffic on:
   - `22` for SSH
   - `8080` for the backend API
   - `5500` or `80` for the frontend, if you serve it from the VM
4. Download the key pair and keep it secure.

### 2. Connect to the EC2 instance

From your local machine, use PowerShell or a terminal:

```powershell
ssh -i C:\path\to\your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### 3. Update Ubuntu and install dependencies

Run these commands on the EC2 instance:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y openjdk-21-jdk maven nginx git
```

### 4. Clone the project

On the EC2 instance:

```bash
git clone <your-repo-url> app
cd app
```

If you do not have a Git repository, transfer the project files to the instance manually.

### 5. Build and run the backend

From the project `backend` folder:

```bash
cd app/backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.

#### Run in detached mode (background)

To run the backend without blocking the terminal, use `nohup` and redirect output:

```bash
cd app/backend
nohup mvn spring-boot:run > spring-boot.log 2>&1 &
```

This command:
- `nohup` - keeps the process running even if you disconnect from SSH.
- `> spring-boot.log` - redirects standard output to a file.
- `2>&1` - redirects errors to the same log file.
- `&` - puts the process in the background.

View the logs:

```bash
tail -f app/backend/spring-boot.log
```

Stop the background process:

```bash
pkill -f "spring-boot:run"
```

Alternatively, build the JAR and run it:

```bash
cd app/backend
mvn clean package
nohup java -jar target/employee-directory-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

### 6. Serve the frontend on Ubuntu

#### Option A: Use Nginx (recommended)

1. Copy the frontend folder to `/var/www/html` or update the Nginx root to point at the project frontend:
   ```bash
   sudo rm -rf /var/www/html/*
   sudo cp -r ../frontend/* /var/www/html/
   ```

2. Test and reload Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

Then open `http://<EC2_PUBLIC_IP>` in your browser.

#### Option B: Use Python HTTP server

From the `frontend` folder:

```bash
cd app/frontend
python3 -m http.server 5500
```

Then open:

```text
http://<EC2_PUBLIC_IP>:5500
```

### 7. Confirm backend connectivity

The frontend should make requests to `http://<EC2_PUBLIC_IP>:8080/api/employees` or, when using Nginx proxying, to `/api/employees`.

### 8. Notes on AWS security

- Keep the EC2 key pair secure.
- Restrict inbound rules to your IP where possible.
- Use a firewall or security group settings to limit traffic.

## Setup on a fresh Windows machine

### 1. Install Java 21

1. Download Java 21 JDK from the official OpenJDK, Oracle, or Eclipse Temurin website.
2. Install Java and note the install folder, such as `C:\Program Files\Java\jdk-21`.
3. Set the `JAVA_HOME` environment variable to the JDK install folder.
4. Add `%JAVA_HOME%\bin` to your `Path` environment variable.
5. Restart PowerShell after editing environment variables.
6. Verify installation in PowerShell:
   ```powershell
   java --version
   ```
   You should see a Java 21 version.

If you see `java : The term 'java' is not recognized...`, Java is not on your PATH yet.

### Windows checklist for Java setup

- Install Java 21 JDK and note the installation folder, for example:
  - `C:\Program Files\Java\jdk-21`
- Open the Start menu and search for "Environment Variables".
- Choose "Edit the system environment variables".
- Click "Environment Variables...".
- Under "User variables for <your-user>", click "New..." and add:
  - Variable name: `JAVA_HOME`
  - Variable value: `C:\Program Files\Java\jdk-21`
- Select the `Path` variable, click "Edit...", and add a new entry:
  - `%JAVA_HOME%\bin`
- Save changes, close PowerShell, and open a new PowerShell window.
- Verify with:
  ```powershell
  java --version
  ```

Example command-line approach for the current user:

```powershell
setx JAVA_HOME "C:\Program Files\Java\jdk-21"
setx PATH "%PATH%;%JAVA_HOME%\bin"
```

Then close and reopen PowerShell and run:

```powershell
java --version
```

### 2. Install Maven

1. Download Maven from https://maven.apache.org/download.cgi.
2. Extract Maven to a folder such as `C:\Program Files\Apache\maven`.
3. Add the Maven `bin` folder to your `Path`, for example:
   ```text
   C:\Program Files\Apache\maven\bin
   ```
4. Verify in PowerShell:
   ```powershell
   mvn -version
   ```

### 3. Optional: Install Visual Studio Code

VS Code is useful for editing and running the project, but not required.

## Setup on macOS

### 1. Install Java 21

1. Install Homebrew if it is not already installed:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install OpenJDK 21:
   ```bash
   brew install openjdk@21
   ```
3. Add Java to your shell profile:
   ```bash
   echo 'export PATH="$(brew --prefix openjdk@21)/bin:$PATH"' >> ~/.zshrc
   echo 'export JAVA_HOME="$(/usr/libexec/java_home -v21)"' >> ~/.zshrc
   source ~/.zshrc
   ```
4. Verify installation:
   ```bash
   java --version
   ```

If you use Bash instead of Zsh, add the same lines to `~/.bash_profile` or `~/.bashrc`.

### 2. Install Maven

1. Install Maven with Homebrew:
   ```bash
   brew install maven
   ```
2. Verify installation:
   ```bash
   mvn -version
   ```

### 3. Optional: Install Visual Studio Code

VS Code is useful for editing and running the project, but not required.

## Run with Docker

Docker allows you to containerize and run the entire backend application without installing Java or Maven locally.

### Dockerfile

The project includes a multi-stage Dockerfile that builds and runs the Spring Boot application:

```dockerfile
# ==========================
# Stage 1: Build Application
# ==========================
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven configuration
COPY backend/pom.xml .

# Download dependencies first (better layer caching)
RUN mvn dependency:go-offline

# Copy source code
COPY backend/src ./src

# Build JAR
RUN mvn clean package -DskipTests

# ==========================
# Stage 2: Run Application
# ==========================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Application port
EXPOSE 8081

# Start Spring Boot application
ENTRYPOINT ["java","-jar","app.jar"]
```

### Build the Docker image

From the project root directory, run:

```bash
docker build -t employee-directory:latest .
```

This command:
- `-t employee-directory:latest` - Tags the image with a name and version
- `.` - Builds from the Dockerfile in the current directory

### Run the Docker container

Once the image is built, start the container:

```bash
docker run -p 8081:8081 employee-directory:latest
```

This command:
- `-p 8081:8081` - Maps port 8081 from the container to your local machine
- `employee-directory:latest` - Runs the image we just built

The backend will now be accessible at `http://localhost:8081`.

### Screenshots after running Docker

#### Default landing page when the application starts:

[Insert screenshot of the default Team Management Dashboard here]

The default page shows:
- Team Management Dashboard title
- Summary cards: Total Employees (4), Departments (4), Open Roles (5)
- Search employee section
- Add new employee form
- Employee list table with sample data (Aarav Patel, Mia Thompson, Noah Kim, Leila Gonzalez)

#### Page after entering employee data:

[Insert screenshot of the dashboard after adding/interacting with employee data here]

After adding employees or interacting with the app:
- Updated counters reflect the new employee count
- New employees appear in the employee list table
- Search functionality filters employees by name
- Delete buttons allow removing employees
- Form fields clear after adding each employee

## Run the backend

1. Open PowerShell in the `backend` folder:
   ```powershell
   cd c:\Kumar_All_Data\Devops_Practice\two-tier-java-app\backend
   ```
2. Start the Spring Boot backend:
   ```powershell
   mvn spring-boot:run
   ```

### What to expect in the logs

When the backend starts successfully, you should see messages like:
- `Spring Boot started` or `Started EmployeeDirectoryApplication`.
- `Tomcat started on port(s): 8080 (http)`.
- `Started EmployeeDirectoryApplication in ... seconds`.

These logs mean Spring Boot bootstrapped the app and embedded Tomcat is ready to accept connections on port `8080`.

### Backend API endpoints

The backend exposes these REST routes:

- `GET http://localhost:8080/api/employees`
  - Returns the full list of employees.
- `GET http://localhost:8080/api/employees/search?name=`
  - Returns employees whose names match the search term.
- `POST http://localhost:8080/api/employees`
  - Adds a new employee.
- `DELETE http://localhost:8080/api/employees/{id}`
  - Deletes an employee by numeric ID.

## Run the frontend

The frontend is a static website in the `frontend` folder. It calls the backend APIs from the browser.

### Option 1: VS Code Live Server

1. Open the `frontend` folder in Visual Studio Code.
2. Install the Live Server extension if needed.
3. Open `index.html`.
4. Click `Go Live` or right-click and choose `Open with Live Server`.
5. The frontend will open in a browser on a local port such as `5500`.

### Option 2: Python HTTP Server

If Python is installed, you can serve the frontend with one command:

```powershell
cd c:\Kumar_All_Data\Devops_Practice\two-tier-java-app\frontend
python -m http.server 5500
```

Then visit:

```text
http://localhost:5500
```

### Option 3: Nginx

Nginx can serve the frontend as static files and proxy API requests to the backend.

A simple Nginx config example:

```nginx
server {
    listen 80;
    server_name localhost;

    root c:/Kumar_All_Data/Devops_Practice/two-tier-java-app/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then restart Nginx and open:

```text
http://localhost
```

### Why frontend and backend use different ports

The frontend is served as static HTML/CSS/JavaScript from a web server.
The backend is a separate Spring Boot application that listens on port `8080`.
Using different ports keeps the frontend and backend separate, which is normal in two-tier development.

For example:
- Frontend: `http://localhost:5500`
- Backend: `http://localhost:8080`

The frontend sends API requests to the backend URL so the two parts work together.

## API communication flow

1. The browser loads `frontend/index.html`.
2. JavaScript in `script.js` sends a `fetch()` request to the backend.
3. The backend receives the request in Tomcat.
4. Spring MVC routes the request to `EmployeeController`.
5. The controller calls `EmployeeService` to read or update the in-memory list.
6. The backend returns JSON data.
7. The browser receives the response and updates the UI.

## CORS and why it is needed

CORS stands for Cross-Origin Resource Sharing.

Because the frontend and backend use different origins (different ports), the browser blocks API requests unless the backend explicitly allows them.

This app configures CORS in `EmployeeDirectoryApplication.java` so the backend accepts requests from the frontend origin.
Without CORS, you may see an error like `Access to fetch at ... from origin ... has been blocked by CORS policy.`

## Troubleshooting

### Port already in use

If port `8080` or another port is already used, the backend will fail to start.

Fix:
- Close the process using that port.
- Or change the backend port in `backend/src/main/resources/application.properties`:
  ```properties
  server.port=8081
  ```

### Maven not found

If PowerShell reports `mvn : The term 'mvn' is not recognized`, then Maven is not installed or not on `Path`.

Fix:
- Install Maven.
- Add the Maven `bin` folder to the `Path` environment variable.
- Restart PowerShell and run `mvn -version`.

### Java not found

If PowerShell reports `java : The term 'java' is not recognized`, then Java is not installed or `JAVA_HOME` is not set correctly.

Fix:
- Install Java 21 JDK.
- Set `JAVA_HOME` to the JDK folder.
- Add `%JAVA_HOME%\bin` to `Path`.
- Restart PowerShell and run `java -version`.

### CORS error

If the browser shows a CORS error, the backend is not allowing the frontend origin.

Fix:
- Ensure the backend is running.
- Confirm `EmployeeDirectoryApplication.java` has `CorsRegistry` configured for `/api/**`.
- Use the correct frontend port in the browser.

### Application startup failure

If the backend fails to start:
- Check the PowerShell logs for the first error message.
- Verify `pom.xml` is present and valid.
- Ensure source files are in `src/main/java/com/example/employeedirectory`.
- Run `mvn clean spring-boot:run` to see the full error.

### Java annotations not found (jakarta vs javax)

If you see `package javax.annotation does not exist`, the code is using the old namespace.

Spring Boot 3.x uses Jakarta EE, not the old Java EE.

Fix:
- Change `import javax.annotation.PostConstruct` to `import jakarta.annotation.PostConstruct`.
- Change `import javax.servlet` to `import jakarta.servlet`.
- This applies to any annotation or class that used `javax` before.

This is expected when upgrading to Java 21 and Spring Boot 3.x.

## Quick start checklist

1. Open PowerShell in `backend`.
2. Run `mvn spring-boot:run`.
3. Confirm logs show Spring Boot and Tomcat started on port `8080`.
4. Open the frontend using Live Server or Python HTTP server.
5. Visit the frontend URL and use the app.

## Notes

- This app stores employee data in memory.
- Restarting the backend resets the sample employee list.
- The frontend and backend remain separate but communicate through REST APIs.
