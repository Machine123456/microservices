FROM bellsoft/liberica-openjdk-alpine:17

# Refer to Maven build -> finalName
ARG JAR_FILE=./app/target/authentication-service.jar

# cd /opt/app
WORKDIR /opt/app

# cp app/target/authentication-service.jar /opt/app/app.jar
COPY ${JAR_FILE} app.jar

# java -jar /opt/app/app.jar
ENTRYPOINT ["java","-jar","app.jar"]