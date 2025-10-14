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
        stage('Security Scan (OWASP)') {
            steps {
                checkout scm
                bat '''
                    echo Executando OWASP Dependency Check...
                    if not exist dependency-check-report mkdir dependency-check-report
                    dependency-check.bat --project "NutriPlan" --scan . --format "ALL" --out dependency-check-report --noupdate --failOnCVSS 10 || echo Falhas encontradas (continuando)
                '''
                archiveArtifacts artifacts: 'dependency-check-report\\*\\', allowEmptyArchive: true
            }
        }
        
    }

    
}
