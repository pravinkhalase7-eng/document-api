pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "pravinkhalase90/khalaspr:${BUILD_NUMBER}"
        APP_NAME = "docvault-api"
        VPS_IP = "YOUR_SERVER_IP"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/pravinkhalase7-eng/document-api.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $DOCKER_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to VPS') {
            steps {
                sshagent(['vps-ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no root@$VPS_IP << EOF
                      echo "🚀 Deploying build ${BUILD_NUMBER}"

                      docker pull $DOCKER_IMAGE

                      docker stop $APP_NAME || true
                      docker rm $APP_NAME || true

                      docker run -d \
                        --name $APP_NAME \
                        -p 3000:3000 \
                        --restart unless-stopped \
                        $DOCKER_IMAGE

                      echo "✅ Deployment Done"
                    EOF
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deploy Successful"
        }
        failure {
            echo "❌ Build Failed"
        }
    }
}