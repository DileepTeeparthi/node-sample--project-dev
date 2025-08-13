pipeline {
  agent none  // We'll define agents per stage

  environment {
    NODE_ENV = 'production'
    AWS_REGION = 'ap-south-1'     // change to your AWS region
    S3_BUCKET = 'nodebuck'        // change to your bucket name
  }

  stages {
    stage('Checkout') {
      agent {
        docker {
          image 'node:18-alpine'
          args '-u root'
        }
      }
      steps {
        git branch: 'master', url: 'https://github.com/DileepTeeparthi/node-sample--project.git'
      }
    }

    stage('Install Dependencies') {
      agent {
        docker {
          image 'node:18-alpine'
          args '-u root'
        }
      }
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
      agent {
        docker {
          image 'node:18-alpine'
          args '-u root'
        }
      }
      steps {
        unstash 'node_modules'
        retry(3) {
          timeout(time: 5, unit: 'MINUTES') {
            sh 'npm test'
          }
        }
      }
    }

    stage('Build') {
      agent {
        docker {
          image 'node:18-alpine'
          args '-u root'
        }
      }
      steps {
        unstash 'node_modules'
        sh 'npm run build'
        stash name: 'build_artifacts', includes: 'build/**'
      }
    }

    stage('Deploy to S3') {
      agent {
        docker { image 'amazon/aws-cli' }
      }
      steps {
        unstash 'build_artifacts'
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: '1']]) {
          sh 'aws s3 sync build/ s3://$S3_BUCKET --region $AWS_REGION --delete'
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
