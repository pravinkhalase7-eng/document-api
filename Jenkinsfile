pipeline {
    agent any

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/pravinkhalase7-eng/document-api.git'
            }
        }

        stage('Verify') {
            steps {
                sh 'ls -la'
            }
        }
    }
}