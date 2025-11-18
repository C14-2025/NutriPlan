pipeline {
    agent any

    tools {
        maven 'Maven-3.9.11'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        MAVEN_OPTS = '-Dmaven.test.failure.ignore=false'
        ARTIFACT_DIR = 'target'
        REPORTS_DIR = 'target/surefire-reports'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Fazendo checkout do código...'
                checkout scm
            }
        }

        stage('Build & Test') {
            parallel {
                stage('Tests') {
                    steps {
                        echo 'Executando testes unitários...'
                        bat "mvn -B test -Dtest='!NutriPlanApplicationTests'"
                    }
                    post {
                        always {
                            junit "${REPORTS_DIR}/**/*.xml"
                            archiveArtifacts artifacts: "${REPORTS_DIR}/**/*", fingerprint: true
                        }
                    }
                }

                stage('Package') {
                    steps {
                        echo 'Gerando pacote...'
                        bat 'mvn -B -DskipTests clean package'
                    }
                    post {
                        success {
                            archiveArtifacts artifacts: "${ARTIFACT_DIR}/*.jar", fingerprint: true
                        }
                    }
                }

                stage('Code Format Check') {
                    steps {
                        echo 'Verificando formatação do código...'
                        bat 'mvn spotless:check'
                    }
                }

                stage('Lint / Code Quality') {
                    steps {
                        echo 'Executando checagem de qualidade de código...'
                        // Se tiver plugin de análise (como Checkstyle ou SpotBugs):
                        // bat 'mvn checkstyle:check'
                        bat 'dir'
                    }
                }
            }
        }

        stage('Deploy (opcional)') {
            when {
                branch 'main'
            }
            steps {
                echo 'Implantando versão em ambiente de testes...'
                // Exemplo:
                // bat 'scp target/*.jar user@server:/apps/nutriplan/'
            }
        }
    }

    post {
        success {
            echo 'Build concluída com sucesso!'
        }
        failure {
            echo 'Falha detectada no pipeline.'
            
            // Se falhou por formatação, triggerar auto-format
            script {
                if (currentBuild.rawBuild.getLog(50).join('\n').contains('spotless:check')) {
                    echo '🔧 Triggerando formatação automática...'
                    build job: 'NutriPlan-Auto-Format', 
                          parameters: [
                              string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)
                          ],
                          wait: false
                }
            }
        }
        always {
            echo 'Enviando notificação de conclusão...'
            emailext(
                subject: "NutriPlan Pipeline - ${currentBuild.currentResult}",
                body: """<p>Pipeline finalizada para o commit <b>${env.GIT_COMMIT}</b> na branch <b>${env.BRANCH_NAME}</b>.</p>
                         <p>Resultado da build: <b>${currentBuild.currentResult}</b></p>
                         <p><a href="${env.BUILD_URL}">Ver detalhes no Jenkins</a></p>""",
                mimeType: 'text/html',
                to: 'srsilveira03@gmail.com'
            )
        }
    }
}
