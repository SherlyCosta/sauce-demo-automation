/**
 * ============================================================
 * Playwright Custom Dashboard Generator
 * ============================================================
 *
 * Parses JUnit XML test results and generates a self-contained
 * HTML dashboard report. This script is PROJECT-AGNOSTIC — the
 * same template works for any Playwright project.
 *
 * Usage:
 *   node reports/generate-dashboard.js [options]
 *
 * Options (via CLI flags or environment variables):
 *   --project-name <name>    Project display name          (env: PROJECT_NAME)
 *   --environment <env>      Target environment            (env: TEST_ENV)
 *   --browser <browser>      Browser used                  (env: BROWSER)
 *   --branch <branch>        Git branch                    (env: BRANCH_NAME)
 *   --junit-path <path>      Path to junit.xml             (default: test-results/junit.xml)
 *   --output-dir <path>      Output directory for report   (default: reports/)
 *
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --------------------------------------------------
// CLI argument parsing
// --------------------------------------------------

function getArg(flag, envVar, defaultValue) {
    const idx = process.argv.indexOf(flag);
    if (idx !== -1 && process.argv[idx + 1]) {
        return process.argv[idx + 1];
    }
    if (envVar && process.env[envVar]) {
        return process.env[envVar];
    }
    return defaultValue;
}

const projectRoot = path.resolve(__dirname, '..');
const projectName = getArg('--project-name', 'PROJECT_NAME', 'Playwright Tests');
const environment = getArg('--environment', 'TEST_ENV', 'Staging');
const browserParam = getArg('--browser', 'BROWSER', '');
const branchParam = getArg('--branch', 'BRANCH_NAME', '');
const junitPath = path.resolve(projectRoot, getArg('--junit-path', null, 'test-results/junit.xml'));
const outputDir = path.resolve(projectRoot, getArg('--output-dir', null, 'reports'));
const templatePath = path.join(__dirname, 'dashboard-template.html');
const historyPath = path.join(outputDir, 'run-history.json');

// --------------------------------------------------
// Validate inputs
// --------------------------------------------------

if (!fs.existsSync(junitPath)) {
    console.error(`[ERROR] JUnit XML not found: ${junitPath}`);
    console.error('Run Playwright tests first to generate test results.');
    process.exit(1);
}

if (!fs.existsSync(templatePath)) {
    console.error(`[ERROR] Dashboard template not found: ${templatePath}`);
    process.exit(1);
}

console.log('='.repeat(60));
console.log('  Playwright Custom Dashboard Generator');
console.log('='.repeat(60));
console.log(`  Project:     ${projectName}`);
console.log(`  Environment: ${environment}`);
console.log(`  JUnit XML:   ${junitPath}`);
console.log(`  Output:      ${outputDir}`);
console.log('='.repeat(60));

// --------------------------------------------------
// Lightweight XML parser (no dependencies needed)
// --------------------------------------------------

function parseXmlAttributes(tag) {
    const attrs = {};
    const regex = /(\w[\w-]*)="([^"]*)"/g;
    let match;
    while ((match = regex.exec(tag)) !== null) {
        attrs[match[1]] = match[2];
    }
    return attrs;
}

function extractCDATA(text) {
    const match = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    return match ? match[1] : text;
}

function parseJunitXml(xmlContent) {
    const result = {
        totalTests: 0,
        totalFailures: 0,
        totalSkipped: 0,
        totalTime: 0,
        timestamp: '',
        suites: []
    };

    // Parse top-level <testsuites> attributes
    const testsuitesMatch = xmlContent.match(/<testsuites\s([^>]*)>/);
    if (testsuitesMatch) {
        const attrs = parseXmlAttributes(testsuitesMatch[1]);
        result.totalTests = parseInt(attrs.tests || '0', 10);
        result.totalFailures = parseInt(attrs.failures || '0', 10);
        result.totalSkipped = parseInt(attrs.skipped || '0', 10);
        result.totalTime = parseFloat(attrs.time || '0');
    }

    // Parse each <testsuite>
    const suiteRegex = /<testsuite\s([^>]*)>([\s\S]*?)<\/testsuite>/g;
    let suiteMatch;

    while ((suiteMatch = suiteRegex.exec(xmlContent)) !== null) {
        const suiteAttrs = parseXmlAttributes(suiteMatch[1]);
        const suiteBody = suiteMatch[2];

        const suite = {
            name: suiteAttrs.name || 'Unknown Suite',
            hostname: suiteAttrs.hostname || '',
            tests: parseInt(suiteAttrs.tests || '0', 10),
            failures: parseInt(suiteAttrs.failures || '0', 10),
            skipped: parseInt(suiteAttrs.skipped || '0', 10),
            time: parseFloat(suiteAttrs.time || '0'),
            timestamp: suiteAttrs.timestamp || '',
            testcases: []
        };

        if (!result.timestamp && suite.timestamp) {
            result.timestamp = suite.timestamp;
        }

        // Parse each <testcase> within this suite
        const testcaseRegex = /<testcase\s([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g;
        let tcMatch;

        while ((tcMatch = testcaseRegex.exec(suiteBody)) !== null) {
            const tcAttrs = parseXmlAttributes(tcMatch[1]);
            const tcBody = tcMatch[2] || '';

            const testcase = {
                name: tcAttrs.name || 'Unknown Test',
                classname: tcAttrs.classname || '',
                time: parseFloat(tcAttrs.time || '0'),
                status: 'passed',
                error: '',
                stackTrace: '',
                screenshot: ''
            };

            // Check for <failure>
            const failureMatch = tcBody.match(/<failure\s[^>]*>([\s\S]*?)<\/failure>/);
            if (failureMatch) {
                testcase.status = 'failed';
                const failureContent = extractCDATA(failureMatch[1]);

                // Split error message from stack trace
                const errorLines = failureContent.trim().split('\n');
                const errorParts = [];
                const stackParts = [];
                let inStack = false;

                for (const line of errorLines) {
                    if (line.trim().startsWith('at ') || line.trim().startsWith('at Function.')) {
                        inStack = true;
                    }
                    if (inStack) {
                        stackParts.push(line);
                    } else {
                        errorParts.push(line);
                    }
                }

                testcase.error = errorParts.join('\n').trim();
                testcase.stackTrace = failureContent.trim();
            }

            // Check for <skipped>
            if (tcBody.includes('<skipped')) {
                testcase.status = 'skipped';
            }

            // Check for screenshot attachments in <system-out>
            const sysOutMatch = tcBody.match(/<system-out>([\s\S]*?)<\/system-out>/);
            if (sysOutMatch) {
                const sysOutContent = extractCDATA(sysOutMatch[1]);
                const attachmentMatch = sysOutContent.match(/\[\[ATTACHMENT\|([^\]]*\.png)\]\]/);
                if (attachmentMatch) {
                    testcase.screenshotRelPath = attachmentMatch[1].replace(/\\/g, '/');
                }
            }

            suite.testcases.push(testcase);
        }

        result.suites.push(suite);
    }

    return result;
}

// --------------------------------------------------
// Parse JUnit XML
// --------------------------------------------------

const xmlContent = fs.readFileSync(junitPath, 'utf8');
const parsed = parseJunitXml(xmlContent);

// --------------------------------------------------
// Build screenshot base64 data URIs
// --------------------------------------------------

function loadScreenshotBase64(relPath) {
    if (!relPath) return '';

    // Screenshots are in test-results/ relative to project root
    const fullPath = path.join(projectRoot, 'test-results', relPath);

    if (fs.existsSync(fullPath)) {
        try {
            const data = fs.readFileSync(fullPath);
            const ext = path.extname(fullPath).toLowerCase();
            const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
            return `data:${mime};base64,${data.toString('base64')}`;
        } catch (e) {
            console.warn(`  [WARN] Could not read screenshot: ${fullPath}`);
        }
    } else {
        console.warn(`  [WARN] Screenshot not found: ${fullPath}`);
    }
    return '';
}

// --------------------------------------------------
// Build report data structure
// --------------------------------------------------

function formatDuration(seconds) {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
}

function formatTestDuration(seconds) {
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
    return `${seconds.toFixed(2)}s`;
}

function extractSuiteName(filePath) {
    // Extract a friendly name from the test file path
    // e.g., "tests\cart\emptyCart.spec.ts" -> "Empty Cart"
    const base = path.basename(filePath, '.spec.ts').replace('.spec', '');
    return base
        .replace(/([A-Z])/g, ' $1')
        .replace(/[-_]/g, ' ')
        .trim()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

// Compute summary
const totalPassed = parsed.totalTests - parsed.totalFailures - parsed.totalSkipped;
const passRate = parsed.totalTests > 0
    ? Math.round((totalPassed / parsed.totalTests) * 100)
    : 0;

// Build suites data
const suitesData = [];
const failedTestsData = [];
const passedTestsData = [];

for (const suite of parsed.suites) {
    const suitePassed = suite.tests - suite.failures - suite.skipped;
    const suiteTests = suite.testcases.map(tc => ({
        title: tc.name,
        status: tc.status,
        duration: formatTestDuration(tc.time)
    }));

    suitesData.push({
        name: extractSuiteName(suite.name),
        file: suite.name,
        project: suite.hostname || 'chromium',
        passed: suitePassed,
        failed: suite.failures,
        skipped: suite.skipped,
        duration: formatDuration(suite.time),
        tests: suiteTests
    });

    for (const tc of suite.testcases) {
        if (tc.status === 'failed') {
            const screenshotBase64 = loadScreenshotBase64(tc.screenshotRelPath);
            failedTestsData.push({
                name: tc.name,
                file: suite.name,
                project: suite.hostname || 'chromium',
                duration: formatTestDuration(tc.time),
                error: tc.error,
                stackTrace: tc.stackTrace,
                screenshot: screenshotBase64
            });
        } else if (tc.status === 'passed') {
            passedTestsData.push({
                name: tc.name,
                file: suite.name,
                project: suite.hostname || 'chromium',
                duration: formatTestDuration(tc.time)
            });
        }
    }
}

// --------------------------------------------------
// Detect environment information
// --------------------------------------------------

function getGitBranch() {
    if (branchParam) return branchParam;
    try {
        return execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: projectRoot,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        }).trim();
    } catch {
        return 'unknown';
    }
}

function getPlaywrightVersion() {
    try {
        const pkgPath = path.join(projectRoot, 'node_modules', '@playwright', 'test', 'package.json');
        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            return pkg.version || 'unknown';
        }
    } catch {}
    return 'unknown';
}

function getNodeVersion() {
    return process.version;
}

// --------------------------------------------------
// Build browser configs
// --------------------------------------------------

const browserConfigs = {};
const detectedBrowsers = new Set();

for (const suite of parsed.suites) {
    if (suite.hostname && suite.hostname !== 'setup') {
        detectedBrowsers.add(suite.hostname);
        if (!browserConfigs[suite.hostname]) {
            browserConfigs[suite.hostname] = {
                name: suite.hostname,
                headless: 'true',
                viewport: '1280x720'
            };
        }
    }
}

// --------------------------------------------------
// Run history (trend chart)
// --------------------------------------------------

let runHistory = [];

if (fs.existsSync(historyPath)) {
    try {
        runHistory = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        if (!Array.isArray(runHistory)) runHistory = [];
    } catch {
        runHistory = [];
    }
}

runHistory.push(passRate);

// Keep only last 10 entries
if (runHistory.length > 10) {
    runHistory = runHistory.slice(-10);
}

// Save updated history
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(historyPath, JSON.stringify(runHistory, null, 2));

// --------------------------------------------------
// Build the complete report data object
// --------------------------------------------------

const branch = getGitBranch();
const playwrightVersion = getPlaywrightVersion();
const timestamp = parsed.timestamp || new Date().toISOString();

const reportData = {
    projectName: projectName,
    timestamp: timestamp,
    summary: {
        total: parsed.totalTests,
        passed: totalPassed,
        failed: parsed.totalFailures,
        skipped: parsed.totalSkipped,
        totalDuration: formatDuration(parsed.totalTime),
        passRate: `${passRate}%`
    },
    suites: suitesData,
    failedTests: failedTestsData,
    passedTests: passedTestsData,
    browserConfigs: browserConfigs,
    browser: {
        name: browserParam || Array.from(detectedBrowsers).join(', ') || 'chromium',
        headless: 'true',
        viewport: '1280x720'
    },
    trend: runHistory,
    environment: {
        project: projectName,
        environment: environment,
        os: process.platform,
        node: getNodeVersion(),
        playwright: playwrightVersion
    },
    execution: {
        branch: branch,
        timestamp: new Date(timestamp).toLocaleString(),
        duration: formatDuration(parsed.totalTime),
        browser: browserParam || Array.from(detectedBrowsers).join(', ') || 'chromium',
        suite: getArg('--test-suite', 'TEST_SUITE', 'All')
    }
};

// --------------------------------------------------
// Generate dashboard HTML
// --------------------------------------------------

let template = fs.readFileSync(templatePath, 'utf8');
const reportDataJson = JSON.stringify(reportData);
const dashboard = template.replace('{{REPORT_DATA}}', reportDataJson);

const dashboardOutputPath = path.join(outputDir, 'dashboard.html');
fs.writeFileSync(dashboardOutputPath, dashboard, 'utf8');

// --------------------------------------------------
// Summary output
// --------------------------------------------------

console.log('');
console.log('  Test Execution Summary');
console.log('  ' + '-'.repeat(40));
console.log(`  Total:    ${parsed.totalTests}`);
console.log(`  Passed:   ${totalPassed}`);
console.log(`  Failed:   ${parsed.totalFailures}`);
console.log(`  Skipped:  ${parsed.totalSkipped}`);
console.log(`  Pass Rate: ${passRate}%`);
console.log(`  Duration: ${formatDuration(parsed.totalTime)}`);
console.log(`  Branch:   ${branch}`);
console.log('');
console.log(`  Dashboard generated: ${dashboardOutputPath}`);
console.log(`  Run history updated: ${historyPath}`);
console.log('');
console.log('  [OK] Dashboard generation complete.');
console.log('='.repeat(60));
