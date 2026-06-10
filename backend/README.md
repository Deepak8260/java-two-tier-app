# Employee Directory Backend

This Spring Boot backend provides a simple in-memory employee directory REST API for learning Java, Spring Boot, Maven, and deployment concepts.

## Project structure

- `src/main/java/com/example/employeedirectory/controller` - REST controllers.
- `src/main/java/com/example/employeedirectory/service` - business logic and data storage.
- `src/main/java/com/example/employeedirectory/model` - data model for employees.
- `src/main/resources/application.properties` - runtime configuration.
- `pom.xml` - Maven build configuration.

## Run locally

1. Install Java 21 and Maven.
2. Open a terminal in `backend`.
3. Run:
   ```bash
   mvn spring-boot:run
   ```
4. The backend starts on `http://localhost:8080`.

## REST API endpoints

- `GET /api/employees` - list all employees.
- `POST /api/employees` - add a new employee.
- `DELETE /api/employees/{id}` - remove an employee by ID.
- `GET /api/employees/search?name=` - search employees by name.

## Frontend

Open `frontend/index.html` in a browser or use a simple static file server.

The frontend uses JavaScript to call backend APIs and display employee data.
