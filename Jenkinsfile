pipeline {
    agent any

    environment {
        WORKSPACE_DIR = "${JENKINS_HOME}/workspace/${JOB_NAME}"
        DOCKERHUB_REPO = "andrealao/microservices"
        GITHUB_REPO = "Machine123456/microservices"
        IMAGE_VERSION = "1"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    def service_branches = []
                    def branches = sh(script: "git ls-remote --heads https://github.com/${env.GITHUB_REPO}.git | cut -f2", returnStdout: true).trim().split('\n')
                    
                    for (def branch in branches) {
                        def branchName = branch.substring(branch.lastIndexOf('/') + 1)
                         
                        if (branchName != "main") {
                            echo "service: " + branchName
                            service_branches.add(branchName)
                        }
                        
                           
                        checkout([$class: 'GitSCM',
                                branches: [[name: branch]],
                                doGenerateSubmoduleConfigurations: false,
                                extensions: [[$class: 'RelativeTargetDirectory',relativeTargetDir: "${branchName}/"]],
                                userRemoteConfigs: [[url: "https://github.com/${env.GITHUB_REPO}.git"]]])
                        
                    }
                    
                    env.SERVICE_BRANCHES = service_branches.join(',')
                }
            }
        }
        
        stage("Build JARs") {
            steps {
                script {
                    def service_branches = env.SERVICE_BRANCHES.split(',')
                    for (def service in service_branches) {
                        def branchDir = "${env.WORKSPACE_DIR}/${service}"
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
                   def service_branches = env.SERVICE_BRANCHES.split(',')
                    for (def service in service_branches) {
                        def branchDir = "${env.WORKSPACE_DIR}/${service}"
                        dir(branchDir) {
                            def imageTag = "${env.DOCKERHUB_REPO}:${service}-${env.IMAGE_VERSION}.${BUILD_NUMBER}"
                            echo imageTag
                            def image = docker.build(imageTag)//, "${branchDir}")

                            withDockerRegistry([credentialsId: "dockerHubAccount", url: ""]) {
                                image.push()
                            }
                        }
                    }
                }
            }
        }
    }
}
