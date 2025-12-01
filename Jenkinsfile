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

                stage('Code Format Check') {
                    steps {
                        echo 'Verificando formatação do código...'
                        script {
                            def formatResult = bat(script: 'mvn spotless:check', returnStatus: true)
                            if (formatResult != 0) {
                                echo '❌ CÓDIGO MAL FORMATADO DETECTADO!'
                                echo ''
                                echo '🚫 Build FALHOU - código não está seguindo padrões de formatação'
                                echo ''
                                echo '📋 Para corrigir:'
                                echo '   1. Execute: mvn spotless:apply'
                                echo '   2. Faça commit das alterações'
                                echo '   3. Faça push novamente'
                                echo ''
                                echo '💡 Isso garante que todo código siga o Google Java Format'
                                error('Build falhou: código mal formatado. Execute mvn spotless:apply para corrigir.')
                            } else {
                                echo '✅ Código está bem formatado!'
                            }
                        }
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
