pipeline {
    agent any

    tools {
            maven 'Maven-3.9.11'
    }

    options {
        timestamps()
    }

    stages {
        stage('Parallel Jobs') {
            parallel {
                stage('Tests') {
                    steps {
                        checkout scm
                        bat 'echo Configurando ambiente Java 17...'
                        bat 'mvn -B test -Dtest="!NutriPlanApplicationTests"'
                        archiveArtifacts artifacts: 'target\\surefire-reports\\*\\', fingerprint: true
                        junit 'target\\surefire-reports\\*.xml'
                    }
                }

                stage('Package') {
                    steps {
                        checkout scm
                        bat 'echo Compilando o projeto (sem testes)...'
                        bat 'mvn -B -DskipTests package'
                        archiveArtifacts artifacts: 'target\\*.jar', fingerprint: true
                    }
                }






    }

    post {
        always {
            echo "Pipeline finalizado com status: ${currentBuild.currentResult}"
        }
    }
}