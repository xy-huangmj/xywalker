# Lottery Application

This is a simple Spring Boot web application for a lottery system.

## Dockerfile

```dockerfile
FROM maven:3.8.7-openjdk-17 AS build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## How to Use Dockerfile

To build and run the Spring Boot Lottery Application using Docker, follow these steps:

1.  **Build the Docker image**:

    ```bash
    docker build -t lottery-app .
    ```

    This command builds a Docker image named `lottery-app` using the `Dockerfile` in the current directory.

2.  **Run the Docker container**:

    ```bash
    docker run -p 8080:8080 lottery-app
    ```

    This command runs a Docker container from the `lottery-app` image. The `-p 8080:8080` flag maps port 8080 of the host to port 8080 of the container, allowing you to access the application from your host machine.

    Once the container is running, you can access the application in your web browser at `http://localhost:8080`.
