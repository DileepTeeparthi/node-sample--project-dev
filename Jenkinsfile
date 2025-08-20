pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        EC2_HOST = 'ec2-user@43.205.235.218'   // EC2 username + Public IP
        EC2_KEY = 'pemkey303'                  // Jenkins Credentials ID (SSH private key)
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/DileepTeeparthi/node-sample--project-dev.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat """
                docker run --rm ^
                    -u root ^
                    -w /app ^
                    -v %CD%:/app ^
                    node:18-alpine sh -c "apk add --no-cache python3 make g++ && npm ci"
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
                    node:18-alpine sh -c "npm test"
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent([env.EC2_KEY]) {
                    bat """
                        REM Copy project files to EC2
                        scp -o StrictHostKeyChecking=no -r * %EC2_HOST%:/home/ec2-user/app

                        REM SSH into EC2 and restart app
                        ssh -o StrictHostKeyChecking=no %EC2_HOST% "cd /home/ec2-user/app && npm install --production && pkill -f 'node server.js' || true && nohup node server.js > app.log 2>&1 &"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build and deployment to EC2 succeeded!"
        }
        failure {
            echo "❌ Deployment failed."
        }
    }
}
