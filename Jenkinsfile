pipeline {
    agent any

    environment {
        DOCKERHUB_REPO = "andrealao/microservices"
        GITHUB_ACCOUNT = "Machine123456"

        GITHUB_AUTHENTICATION_REPO_NAME = "authentication-service"
        GITHUB_PRODUCT_REPO_NAME = "product-service"

        IMAGE_VERSION = "1"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the authentication service repository
                checkout([$class: 'GitSCM',
                          branches: [[name: '*/main']],
                          userRemoteConfigs: [[url: "https://github.com/$GITHUB_ACCOUNT/$GITHUB_AUTHENTICATION_REPO_NAME.git"]]])
                
                // Checkout the product service repository
                checkout([$class: 'GitSCM',
                          branches: [[name: '*/main']],
                          userRemoteConfigs: [[url: "https://github.com/$GITHUB_ACCOUNT/$GITHUB_PRODUCT_REPO_NAME.git"]]])
            }
        }

        stage("Build JAR") {
            steps {
                // Build JAR for authentication service
                dir("$GITHUB_AUTHENTICATION_REPO_NAME") {
                    sh "cd ./app && mvn clean package"
                }
                // Build JAR for product service
                dir("$GITHUB_PRODUCT_REPO_NAME") {
                    sh "cd ./app && mvn clean package"
                }
            }
        }

        stage("Build and Push Docker Images") {
            steps {
                script {
                    // Build and tag the authentication service Docker image
                    def authenticationServiceImage = docker.build("$DOCKERHUB_REPO:$GITHUB_AUTHENTICATION_REPO_NAME-$IMAGE_VERSION.$BUILD_NUMBER", "./$GITHUB_AUTHENTICATION_REPO_NAME")
                    // Build and tag the product service Docker image
                    def productServiceImage = docker.build("$DOCKERHUB_REPO:$GITHUB_PRODUCT_REPO_NAME-$IMAGE_VERSION.$BUILD_NUMBER", "./$GITHUB_PRODUCT_REPO_NAME")

                    withDockerRegistry([ credentialsId: "dockerHubAccount", url: "" ]) {
                            // Push the Docker images to Docker Hub
                            authenticationServiceImage.push()
                            productServiceImage.push()
                        }
                }
            }
        }
    }
}