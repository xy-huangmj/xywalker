FROM maven:latest AS build
WORKDIR /app
COPY pom.xml ./
COPY settings.xml /usr/share/maven/ref/settings-docker.xml
COPY src ./src
RUN mvn clean package -DskipTests -s /usr/share/maven/ref/settings-docker.xml

FROM openjdk:17-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
