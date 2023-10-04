pipeline {
    agent any

    environment {
        WORKSPACE_DIR = "${JENKINS_HOME}/workspace/${JOB_NAME}"
        DOCKERHUB_REPO = "andrealao/microservices"
        GITHUB_REPO = "Machine123456/microservices"
        IMAGE_VERSION = "1"
        SERVICE_BRANCHES = ""  // Initialize as an empty string
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    def branches = sh(script: "git ls-remote --heads https://github.com/${env.GITHUB_REPO}.git | cut -f2", returnStdout: true).trim().split('\n')

                    for (def branch in branches) {
                        def branchName = branch.substring(branch.lastIndexOf('/') + 1)

                        if (branchName != "main") {
                            env.SERVICE_BRANCHES += "${branchName},"  // Add branchName to the string
                        }

                        checkout([$class: 'GitSCM',
                                branches: [[name: branch]],
                                doGenerateSubmoduleConfigurations: false,
                                userRemoteConfigs: [[url: "https://github.com/${env.GITHUB_REPO}.git"]]])
                    }

                    // Remove the trailing comma
                    env.SERVICE_BRANCHES = env.SERVICE_BRANCHES.take(env.SERVICE_BRANCHES.size() - 1)
                }
            }
        }

        stage("Build JAR") {
            steps {
                script {
                    def branchNames = env.SERVICE_BRANCHES.split(',')  // Split the string into a list

                    for (def branch in branchNames) {
                        def branchDir = "${env.WORKSPACE_DIR}/${branch}"
                        dir(branchDir) {
                            sh "cd ./app && mvn clean package"
                        }
                    }
                }
            }
        }

        stage("Build and Push Docker Images") {
            steps {
                script {
                    def branchNames = env.SERVICE_BRANCHES.split(',')  // Split the string into a list

                    for (def branch in branchNames) {
                        def branchDir = "${env.WORKSPACE_DIR}/${branch}"
                        def imageTag = "${env.DOCKERHUB_REPO}:${branch}-${env.IMAGE_VERSION}.${BUILD_NUMBER}"
                        def image = docker.build(imageTag, "${branchDir}")

                        withDockerRegistry([credentialsId: "dockerHubAccount", url: ""]) {
                            image.push()
                        }
                    }
                }
            }
        }
    }
}

    //stage('Checkout') {
    //    steps {
    //        // Checkout the authentication service repository
    //        checkout([$class: 'GitSCM',
    //                  branches: [[name: "*/$GITHUB_AUTHENTICATION_BRANCH_NAME"]],
    //                  userRemoteConfigs: [[url: "https://github.com/$GITHUB_REPO.git"]]])
    //        
    //        // Checkout the product service repository
    //        checkout([$class: 'GitSCM',
    //                  branches: [[name: "*/$GITHUB_PRODUCT_BRANCH_NAME"]],
    //                  userRemoteConfigs: [[url: "https://github.com/$GITHUB_REPO.git"]]])
    //    }
    //}

    //stage("Build JAR") {
    //    steps {
    //        // Build JAR for authentication service
    //        dir("$GITHUB_AUTHENTICATION_BRANCH_NAME") {
    //            sh "cd ./app && mvn clean package"
    //        }
    //        // Build JAR for product service
    //        dir("$GITHUB_PRODUCT_BRANCH_NAME") {
    //            sh "cd ./app && mvn clean package"
    //        }
    //    }
    //}

    //stage("Build and Push Docker Images") {
    //    steps {
    //        script {
    //            // Build and tag the authentication service Docker image
    //            def authenticationServiceImage = docker.build("$DOCKERHUB_REPO:$GITHUB_AUTHENTICATION_BRANCH_NAME-$IMAGE_VERSION.$BUILD_NUMBER", "./$GITHUB_AUTHENTICATION_BRANCH_NAME")
    //            // Build and tag the product service Docker image
    //            def productServiceImage = docker.build("$DOCKERHUB_REPO:$GITHUB_PRODUCT_BRANCH_NAME-$IMAGE_VERSION.$BUILD_NUMBER", "./$GITHUB_PRODUCT_BRANCH_NAME")

    //            withDockerRegistry([ credentialsId: "dockerHubAccount", url: "" ]) {
    //                    // Push the Docker images to Docker Hub
    //                    authenticationServiceImage.push()
    //                    productServiceImage.push()
    //            }
    //        }
    //    }
    //}
    
