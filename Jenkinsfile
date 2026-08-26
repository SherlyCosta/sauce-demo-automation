pipeline {
    agent any

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['All', 'E2E', 'Smoke', 'Regression', 'Login', 'Inventory', 'Cart', 'Checkout', 'Navigation'],
            description: 'Select test suite to execute'
        )
        choice(
            name: 'BROWSER',
            choices: ['Chromium', 'All', 'Firefox', 'WebKit'],
            description: 'Select target browser project'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Check Node and npm') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def testCommand

                    if (params.TEST_SUITE == 'All') {
                        testCommand = 'npx playwright test'
                    } else if (params.TEST_SUITE == 'E2E') {
                        testCommand = 'npm run test:e2e'
                    } else if (params.TEST_SUITE == 'Smoke') {
                        testCommand = 'npm run test:smoke'
                    } else if (params.TEST_SUITE == 'Regression') {
                        testCommand = 'npm run test:regression'
                    } else if (params.TEST_SUITE == 'Login') {
                        testCommand = 'npm run test:login'
                    } else if (params.TEST_SUITE == 'Inventory') {
                        testCommand = 'npm run test:inventory'
                    } else if (params.TEST_SUITE == 'Cart') {
                        testCommand = 'npm run test:cart'
                    } else if (params.TEST_SUITE == 'Checkout') {
                        testCommand = 'npm run test:checkout'
                    } else if (params.TEST_SUITE == 'Navigation') {
                        testCommand = 'npm run test:navigation'
                    } else {
                        testCommand = 'npx playwright test'
                    }

                    if (params.BROWSER == 'All') {
                        bat testCommand
                    } else if (params.BROWSER == 'Chromium') {
                        bat "${testCommand} --project=chromium"
                    } else if (params.BROWSER == 'Firefox') {
                        bat "${testCommand} --project=firefox"
                    } else if (params.BROWSER == 'WebKit') {
                        bat "${testCommand} --project=webkit"
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**, playwright-custom-report/**, test-results/**', allowEmptyArchive: true

            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])

            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-custom-report',
                reportFiles: 'dashboard.html',
                reportName: 'Custom Dashboard Report'
            ])
        }
    }
}
