pipeline {
  agent {
    docker {
      image 'node:18-alpine'
      args '-u root'
    }
  }

  environment {
    NODE_ENV = 'production'
    AWS_REGION = 'ap-south-1'    // change to your region
    S3_BUCKET = 'your-bucket-name' // change to your bucket
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'master', url: 'https://github.com/DileepTeeparthi/node-sample--project.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh '''
          apk add --no-cache python3 make g++
          npm ci
        '''
      }
      post {
        success {
          stash name: 'node_modules', includes: 'node_modules/**'
        }
      }
    }

    stage('Run Tests') {
      steps {
        retry(3) {
          timeout(time: 5, unit: 'MINUTES') {
            sh 'npm test'
          }
        }
      }
    }

    stage('Build') {
      steps {
        unstash 'node_modules'
        sh 'npm run build'
      }
    }

    stage('Deploy to S3') {
      steps {
        // Use the AWS Credentials binding plugin (configured with ID 'aws-jenkins-creds')
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: '1']]) {
          sh '''
            apk add --no-cache python3 py3-pip
            pip3 install --no-cache-dir awscli
            aws s3 sync build/ s3://$S3_BUCKET --region $AWS_REGION --delete
          '''
        }
      }
    }
  }

  post {
    success {
      echo '✅ Build and deployment succeeded!'
      // slackSend channel: '#devops', message: '✅ Build succeeded!'    // optional if slack configured
    }
    failure {
      echo '❌ Build or deployment failed.'
      // slackSend channel: '#devops', message: '❌ Build failed!'     // optional
    }
  }
}
