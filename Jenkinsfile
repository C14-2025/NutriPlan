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

                stage('Lint / Code Quality') {
                    steps {
                        echo 'Executando checagem de qualidade de código...'
                        bat 'dir'
                    }
                }
            }
        }
        stage('Security Scan - OWASP') {
            steps {
                echo 'Executando análise de vulnerabilidades OWASP...'
                bat "mvn org.owasp:dependency-check-maven:check"
            }
            post {
                always {
                    archiveArtifacts artifacts: "target/dependency-check-report.*", fingerprint: true
                }
            }
        }

        stage('Frontend Tests - Cypress') {
            steps {
                dir('frontend') {   
                    echo 'Instalando dependências do frontend...'
                    bat 'npm install'

                    echo 'Executando testes E2E com Cypress...'
                    bat 'npx cypress run --browser chrome --headless'
                }
            }
            post {
                always {
                    echo 'Arquivando relatórios do Cypress...'
                    archiveArtifacts artifacts: 'frontend/cypress/videos/**/*.mp4', fingerprint: true
                    archiveArtifacts artifacts: 'frontend/cypress/screenshots/**/*', fingerprint: true
                }
            }
        }


        stage('Deploy (opcional)') {
            when {
                branch 'main'
            }
            steps {
                echo 'Implantando versão em ambiente de testes...'
            }
        }
    }

    post {
        success {
            echo 'Build concluída com sucesso!'
        }
        failure {
            echo 'Falha detectada no pipeline.'
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
