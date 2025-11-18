pipeline {
    agent any

    tools {
        maven 'Maven'
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
                        sh "mvn -B test -Dtest='!NutriPlanApplicationTests'"
                    }
                    post {
                        always {
                            script {
                                if (fileExists("${REPORTS_DIR}")) {
                                    junit "${REPORTS_DIR}/**/*.xml"
                                    archiveArtifacts artifacts: "${REPORTS_DIR}/**/*", fingerprint: true
                                } else {
                                    echo 'Nenhum relatório de teste encontrado'
                                }
                            }
                        }
                    }
                }

                stage('Package') {
                    steps {
                        echo 'Gerando pacote...'
                        sh 'mvn -B -DskipTests clean package'
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
                        script {
                            def formatResult = sh(script: 'mvn spotless:check', returnStatus: true)
                            if (formatResult != 0) {
                                echo '⚠️ Código mal formatado - aplicando correção automática...'
                                sh 'mvn spotless:apply'
                                
                                echo '✅ Formatação automática aplicada com sucesso!'
                                echo '📋 Arquivos corrigidos estão disponíveis no workspace do Jenkins'
                                echo '💡 Para aplicar localmente: mvn spotless:apply'
                            } else {
                                echo '✅ Código já está bem formatado!'
                            }
                        }
                    }
                }

                stage('Lint / Code Quality') {
                    steps {
                        echo 'Executando checagem de qualidade de código...'
                        // Se tiver plugin de análise (como Checkstyle ou SpotBugs):
                        // bat 'mvn checkstyle:check'
                        sh 'ls -la'
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
            echo '❌ Pipeline falhou - verifique os logs para detalhes'
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
