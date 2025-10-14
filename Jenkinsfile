pipeline {
    agent any

    tools {
        maven 'Maven-3.9.11'
    }

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Fazendo checkout do código...'
                checkout scm
            }
        }

        stage('Parallel Jobs') {
            parallel {
                stage('Tests') {
                    steps {
                        echo 'Executando testes...'
                        bat 'mvn -B test -Dtest="!NutriPlanApplicationTests"'
                        junit 'target\\surefire-reports\\**\\*.xml'
                        archiveArtifacts artifacts: 'target\\surefire-reports\\**\\*', fingerprint: true
                    }
                }

                stage('Package') {
                    steps {
                        echo 'Gerando pacote...'
                        bat 'mvn -B -DskipTests clean package'
                        archiveArtifacts artifacts: 'target\\*.jar', fingerprint: true
                    }
                }

                stage('Lint Check') {
                    steps {
                        echo 'Verificando estrutura...'
                        bat 'dir'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado!'
            cleanWs()
        }
        success {
            echo 'Build executado com sucesso!'
        }
        failure {
            echo 'Falha no pipeline!'
        }
    }
}