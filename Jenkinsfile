pipeline {
    agent any

    tools {
        maven 'Maven-3.9.11'

    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Fazendo checkout do código...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Compilando projeto...'
                bat 'mvn clean compile -B'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Executando testes...'
                bat 'mvn test -B'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Package') {
            steps {
                echo '📦 Gerando pacote...'
                bat 'mvn package -DskipTests -B'
                archiveArtifacts 'target/*.jar'
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline finalizado!'
            cleanWs()
        }
        success {
            echo '🎉 Build e testes executados com sucesso!'
        }
        failure {
            echo '❌ Falha no pipeline!'
        }
    }
}