/**
 * ============================================================
 * Playwright PDF Report Generator
 * ============================================================
 *
 * Opens the generated dashboard HTML in a headless Chromium
 * browser (using Playwright, which is already installed) and
 * prints it to a pixel-perfect PDF.
 *
 * Usage:
 *   node reports/generate-pdf.js [options]
 *
 * Options:
 *   --input <path>    Path to dashboard HTML  (default: reports/dashboard.html)
 *   --output <path>   Output PDF path         (default: reports/test-report.pdf)
 *
 * ============================================================
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// --------------------------------------------------
// CLI argument parsing
// --------------------------------------------------

function getArg(flag, defaultValue) {
    const idx = process.argv.indexOf(flag);
    if (idx !== -1 && process.argv[idx + 1]) {
        return process.argv[idx + 1];
    }
    return defaultValue;
}

const projectRoot = path.resolve(__dirname, '..');
const inputPath = path.resolve(projectRoot, getArg('--input', 'reports/dashboard.html'));
const outputPath = path.resolve(projectRoot, getArg('--output', 'reports/test-report.pdf'));

// --------------------------------------------------
// Validate input
// --------------------------------------------------

if (!fs.existsSync(inputPath)) {
    console.error(`[ERROR] Dashboard HTML not found: ${inputPath}`);
    console.error('Run "node reports/generate-dashboard.js" first to generate the dashboard.');
    process.exit(1);
}

// --------------------------------------------------
// Generate PDF
// --------------------------------------------------

async function generatePdf() {
    console.log('='.repeat(60));
    console.log('  Playwright PDF Report Generator');
    console.log('='.repeat(60));
    console.log(`  Input:  ${inputPath}`);
    console.log(`  Output: ${outputPath}`);
    console.log('');

    let browser;

    try {
        // Launch Chromium using Playwright
        browser = await chromium.launch({
            headless: true
        });

        const context = await browser.newContext({
            viewport: { width: 1440, height: 900 }
        });

        const page = await context.newPage();

        // Navigate to the dashboard HTML file
        const fileUrl = `file:///${inputPath.replace(/\\/g, '/')}`;
        console.log(`  Opening: ${fileUrl}`);

        await page.goto(fileUrl, {
            waitUntil: 'networkidle',
            timeout: 60000
        });

        // Wait for charts and images (including failure screenshots) to render
        await page.waitForTimeout(3000);
        await page.evaluate(async () => {
            const images = Array.from(document.images);
            await Promise.all(
                images
                    .filter(img => !img.complete)
                    .map(img => new Promise(resolve => {
                        img.onload = img.onerror = resolve;
                    }))
            );
        });

        // Ensure output directory exists
        const outputDirPath = path.dirname(outputPath);
        if (!fs.existsSync(outputDirPath)) {
            fs.mkdirSync(outputDirPath, { recursive: true });
        }

        // Generate PDF
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            displayHeaderFooter: false,
            preferCSSPageSize: false
        });

        console.log('');
        console.log(`  [OK] PDF generated successfully: ${outputPath}`);
        console.log(`  File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error(`  [ERROR] PDF generation failed: ${error.message}`);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

generatePdf();
