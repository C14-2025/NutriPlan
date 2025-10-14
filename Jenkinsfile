pipeline {
    agent any

    parameters {
        choice(
            name: 'BRANCH',
            choices: ['main', 'Joao', 'testePipelineJenkins'],
            description: 'Branch para build'
        )
    }

    triggers {
        pollSCM('H/5 * * * *')
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
                    userRemoteConfigs: [[
                        url: 'https://github.com/C14-2025/NutriPlan.git'
                        // Se precisar de credenciais, adicione: credentialsId: 'seu-credential-id'
                    ]]
                ])
            }
        }

        stage('Setup Java') {
            steps {
                script {
                    // Configurar Java para Windows
                    def javaHome = tool name: 'java-17', type: 'jdk'
                    env.JAVA_HOME = javaHome
                    env.PATH = "${javaHome}/bin;${env.PATH}"
                }
            }
        }

        stage('Parallel Execution') {
            failFast false
            parallel {
                stage('Tests') {
                    steps {
                        script {
                            // Usar bat para Windows em vez de sh
                            bat 'mvn -B dependency:go-offline'
                            bat 'mvn -B test -Dtest="!NutriPlanApplicationTests"'
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
                            bat 'mvn -B -DskipTests clean package'
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
                            bat 'dir /s'  // Equivalente a ls -R no Windows
                            bat 'mvn checkstyle:check || echo "Checkstyle issues found"'
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
                def status = currentBuild.result ?: 'SUCCESS'
                def commitHash = bat(script: 'git rev-parse HEAD', returnStdout: true).trim()

                emailext (
                    subject: "NutriPlan Pipeline - ${status}",
                    body: """
                        Pipeline Status Report:

                        Build: ${currentBuild.fullDisplayName}
                        Status: ${status}
                        URL: ${env.BUILD_URL}
                        Branch: ${params.BRANCH}
                        Commit: ${commitHash}
                    """,
                    to: 'RECIPIENT_EMAIL@example.com', // Substitua pelo email real
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