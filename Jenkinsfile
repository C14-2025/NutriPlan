pipeline {
    agent any

    parameters {
        choice(
            name: 'BRANCH',
            choices: ['main', 'Joao'],
            description: 'Branch para build'
        )
    }

    triggers {
        pollSCM('H/5 * * * *')  // Poll SCM a cada 5 minutos
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH}"]],
                    userRemoteConfigs: [[url: 'URL_DO_SEU_REPOSITORIO']]
                ])
            }
        }

        stage('Setup Java') {
            steps {
                script {
                    def javaHome = tool name: 'java-17', type: 'jdk'
                    env.JAVA_HOME = javaHome
                    env.PATH = "${javaHome}/bin:${env.PATH}"
                }
            }
        }

        stage('Parallel Execution') {
            failFast false
            parallel {
                stage('Tests') {
                    steps {
                        script {
                            // Cache Maven (simulação)
                            sh 'mvn -B dependency:go-offline'

                            // Run tests
                            sh 'mvn -B test -Dtest="!NutriPlanApplicationTests"'
                        }
                    }
                    post {
                        always {
                            junit 'target/surefire-reports/*.xml'
                            archiveArtifacts 'target/surefire-reports/**/*'
                        }
                    }
                }

                stage('Package') {
                    steps {
                        script {
                            // Build package (skip tests)
                            sh 'mvn -B -DskipTests clean package'
                        }
                    }
                    post {
                        always {
                            archiveArtifacts 'target/*.jar'
                        }
                    }
                }

                stage('Lint Check') {
                    steps {
                        script {
                            sh 'ls -R .'
                            // Adicione aqui ferramentas de lint específicas
                            sh 'mvn checkstyle:check || echo "Checkstyle issues found"'
                        }
                    }
                }
            }
        }

        stage('Security Scan') {
            when {
                expression { currentBuild.result != 'FAILURE' }
            }
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        // OWASP Dependency Check
                        dependencyCheck arguments: '''
                            --project "NutriPlan"
                            --scan "."
                            --format "ALL"
                            --out "dependency-check-report"
                            --disableUpdate true
                            --failOnCVSS 10
                        ''', odcInstallation: 'dependency-check'

                        dependencyCheckPublisher pattern: 'dependency-check-report/dependency-check-report.html'
                    }
                }
            }
            post {
                always {
                    archiveArtifacts 'dependency-check-report/**/*'
                }
            }
        }
    }

    post {
        always {
            script {
                // Notificação por email
                def status = currentBuild.result ?: 'SUCCESS'
                def subject = "NutriPlan Pipeline - ${status}"
                def body = """
                    Pipeline Status Report:

                    Build: ${currentBuild.fullDisplayName}
                    Status: ${status}
                    URL: ${env.BUILD_URL}
                    Branch: ${params.BRANCH}
                    Commit: ${sh(script: 'git rev-parse HEAD', returnStdout: true).trim()}
                """

                emailext (
                    subject: subject,
                    body: body,
                    to: 'RECIPIENT_EMAIL@example.com',
                    attachLog: true
                )
            }
        }

        success {
            echo 'Pipeline executado com sucesso!'
        }

        failure {
            echo 'Pipeline falhou!'
        }

        unstable {
            echo 'Pipeline está instável (possivelmente security scan falhou)'
        }
    }
}