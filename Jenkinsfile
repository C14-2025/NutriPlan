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
            echo 'Enviando notificação de conclusão...'
            emailext(
                subject: "NutriPlan Pipeline - ${currentBuild.currentResult}",
                body: """Pipeline finalizada para o commit ${env.GIT_COMMIT} na branch ${env.BRANCH_NAME}.
                
                Resultado da build: ${currentBuild.currentResult}

                Verifique os logs no Jenkins para mais detalhes.""",
                to: "batistanatp@gmail.com"
            )
        }
    }
}
