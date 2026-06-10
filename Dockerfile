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
EXPOSE 8080

# Start Spring Boot application
ENTRYPOINT ["java","-jar","app.jar"]
