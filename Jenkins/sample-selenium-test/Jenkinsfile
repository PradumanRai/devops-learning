pipeline {
    agent any
    stages {
        stage('Setup') {
            steps {
                sh 'chmod +x setup_selenium.sh'
                sh './setup_selenium.sh'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn clean test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
    }
}
