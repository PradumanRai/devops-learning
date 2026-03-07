/ Jenkinsfile for Abstergo Corp CI/CD Pipeline
pipeline {
    agent any
    
    environment {
        DOCKER_HUB_REPO = 'your-dockerhub-username/abstergo-ecommerce'
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'
        KUBECONFIG_CREDENTIALS = 'kubeconfig-credentials'
        GIT_REPO = 'https://github.com/PradumanRai/Abstergo-Corp-s-online-shopping-portal.git'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                git branch: 'main', url: "${GIT_REPO}"
            }
        }
        
        stage('Build Application') {
            steps {
                echo 'Building Node.js application...'
                sh 'npm install'
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    def buildNumber = env.BUILD_NUMBER
                    def imageTag = "${DOCKER_HUB_REPO}:${buildNumber}"
                    def latestTag = "${DOCKER_HUB_REPO}:latest"
                    
                    sh "docker build -t ${imageTag} ."
                    sh "docker tag ${imageTag} ${latestTag}"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                script {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_HUB_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh "docker push ${DOCKER_HUB_REPO}:${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_HUB_REPO}:latest"
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes cluster...'
                script {
                    withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS}", variable: 'KUBECONFIG')]) {
                        sh """
                            export KUBECONFIG=\$KUBECONFIG
                            kubectl set image deployment/abstergo-app abstergo-app=${DOCKER_HUB_REPO}:${BUILD_NUMBER} -n production
                            kubectl rollout status deployment/abstergo-app -n production
                        """
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                script {
                    withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS}", variable: 'KUBECONFIG')]) {
                        sh """
                            export KUBECONFIG=\$KUBECONFIG
                            kubectl get pods -n production
                            kubectl get services -n production
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
            // Send notification (Slack, Email, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Send alert notification
        }
        cleanup {
            echo 'Cleaning up Docker images...'
            sh "docker rmi ${DOCKER_HUB_REPO}:${BUILD_NUMBER} || true"
            sh "docker rmi ${DOCKER_HUB_REPO}:latest || true"
        }
    }
}
