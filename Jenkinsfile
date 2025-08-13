pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        AWS_REGION = 'ap-south-1'
        S3_BUCKET = 'nodebuck'
        DOCKER_NODE_IMAGE = 'node:18-alpine'
        DOCKER_AWS_CLI_IMAGE = 'amazon/aws-cli'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/DileepTeeparthi/node-sample--project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat """
                    docker run --rm ^
                      -u root ^
                      -w /app ^
                      -v %CD%:/app ^
                      %DOCKER_NODE_IMAGE% sh -c "apk add --no-cache python3 make g++ && npm ci"
                """
            }
        }

        stage('Run Tests') {
            steps {
                bat """
                    docker run --rm ^
                      -u root ^
                      -w /app ^
                      -v %CD%:/app ^
                      %DOCKER_NODE_IMAGE% sh -c "npm test"
                """
            }
        }

        stage('Build') {
            steps {
                bat """
                    docker run --rm ^
                      -u root ^
                      -w /app ^
                      -v %CD%:/app ^
                      %DOCKER_NODE_IMAGE% sh -c "npm run build"
                """
            }
        }

        stage('Deploy to S3') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: '1']]) {
                    bat """
                        docker run --rm ^
                          -w /app ^
                          -v %CD%/build:/app/build ^
                          -e AWS_ACCESS_KEY_ID=%AWS_ACCESS_KEY_ID% ^
                          -e AWS_SECRET_ACCESS_KEY=%AWS_SECRET_ACCESS_KEY% ^
                          %DOCKER_AWS_CLI_IMAGE% s3 sync build/ s3://%S3_BUCKET% --region %AWS_REGION% --delete
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build and deployment succeeded!"
        }
        failure {
            echo "❌ Build or deployment failed."
        }
    }
}
