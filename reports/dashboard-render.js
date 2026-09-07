// @ts-nocheck
/* eslint-disable */

/**
 * ============================================================
 * Playwright Dashboard — Render Logic
 * ============================================================
 * This script reads window.__REPORT_DATA__ (injected by the
 * dashboard generator) and renders all dashboard sections.
 * ============================================================
 */

let trendChartInstance = null;
let pieChartInstance = null;

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    var themeIcon = document.getElementById('theme-icon');
    var themeText = document.getElementById('theme-text');
    if (themeIcon && themeText) {
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-sun';
            themeIcon.style.color = '#e3b341';
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeIcon.style.color = '#a371f7';
            themeText.textContent = 'Dark Mode';
        }
    }

    var textColor = theme === 'light' ? '#656d76' : '#8b949e';
    var gridColor = theme === 'light' ? '#e1e4e8' : '#30363d';
    if (trendChartInstance) {
        trendChartInstance.options.scales.y.grid.color = gridColor;
        trendChartInstance.options.scales.y.ticks.color = textColor;
        trendChartInstance.options.scales.x.ticks.color = textColor;
        trendChartInstance.update();
    }
}

function initTheme() {
    var savedTheme = localStorage.getItem('reporter-theme');
    var systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    var initialTheme = savedTheme ? savedTheme : (systemPrefersLight ? 'light' : 'dark');
    applyTheme(initialTheme);

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
            if (!localStorage.getItem('reporter-theme')) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    var toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        toggleBtn.onclick = function() {
            var currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            var newTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('reporter-theme', newTheme);
            applyTheme(newTheme);
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    var data = window.__REPORT_DATA__;
    if (!data) {
        var dataScript = document.getElementById('report-data');
        if (dataScript && dataScript.textContent) {
            try {
                data = JSON.parse(dataScript.textContent);
                window.__REPORT_DATA__ = data;
            } catch (e) {
                // Ignore parse error
            }
        }
    }
    if (!data) data = {};

    // Set report title
    if (data.projectName) {
        document.getElementById('report-subtitle').textContent = data.projectName + ' \u2014 Test Report';
        document.title = data.projectName + ' \u2014 Playwright Test Report';
    }

    // Set report timestamp
    var reportTime = data.timestamp || new Date().toISOString();
    var reportDate = new Date(reportTime);
    var timeStr = reportDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
                    reportDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('report-time').innerHTML = '<i class="fa-regular fa-calendar"></i> ' + timeStr;
    document.getElementById('bottom-time').textContent = 'Report generated on ' + timeStr;

    // Build browser/project tabs
    var projects = [];
    var projectSet = new Set();
    if (Array.isArray(data.suites)) {
        data.suites.forEach(function(s) { if (s.project && s.project !== 'setup') projectSet.add(s.project); });
    }
    if (projectSet.size > 0) {
        projects = Array.from(projectSet).map(function(id) {
            var name = id;
            var l = id.toLowerCase();
            if (l === 'chromium' || l.includes('chrome')) name = 'Chrome';
            else if (l === 'firefox') name = 'Firefox';
            else if (l === 'webkit' || l.includes('safari')) name = 'WebKit';
            else name = id.replace(/\b\w/g, function(c) { return c.toUpperCase(); });
            return { id: id, name: name };
        });
    } else {
        projects = [{ id: 'all', name: 'All Tests' }];
    }

    function getBrowserIcon(label, id) {
        var str = (label + ' ' + id).toLowerCase();
        if (str.includes('chrome') || str.includes('chromium')) return '<i class="fa-brands fa-chrome" style="color: #4285F4;"></i>';
        if (str.includes('firefox')) return '<i class="fa-brands fa-firefox-browser" style="color: #FF7139;"></i>';
        if (str.includes('safari') || str.includes('webkit')) return '<i class="fa-brands fa-safari" style="color: #006CFF;"></i>';
        return '<i class="fa-solid fa-globe" style="color: var(--highlight);"></i>';
    }

    var activeProjectId = projects[0] ? projects[0].id : 'all';
    var tabsListContainer = document.getElementById('browser-tabs-list');
    tabsListContainer.innerHTML = '';

    projects.forEach(function(proj, idx) {
        var btn = document.createElement('button');
        btn.className = 'browser-tab-btn' + (idx === 0 ? ' active' : '');
        btn.setAttribute('data-project', proj.id);
        btn.innerHTML = getBrowserIcon(proj.name, proj.id) + ' <span>' + proj.name + '</span>';
        btn.onclick = function() { switchBrowserTab(proj.id); };
        tabsListContainer.appendChild(btn);
    });

    function switchBrowserTab(projectId) {
        activeProjectId = projectId;
        document.querySelectorAll('.browser-tab-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-project') === projectId);
        });

        var isSingleOrAll = projects.length <= 1 || projectId === 'all';
        var activeSuites = data.suites.filter(function(s) {
            return s.project === projectId || isSingleOrAll;
        });
        var activeFailedTests = data.failedTests.filter(function(f) {
            return f.project === projectId || isSingleOrAll;
        });
        var activePassedTests = data.passedTests.filter(function(p) {
            return p.project === projectId || isSingleOrAll;
        });

        var passedCount = 0, failedCount = 0, skippedCount = 0;
        activeSuites.forEach(function(s) {
            passedCount += (s.passed || 0);
            failedCount += (s.failed || 0);
            skippedCount += (s.skipped || 0);
        });

        var totalCount = passedCount + failedCount + skippedCount;
        var passRateVal = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
        var passRateStr = passRateVal + '%';

        document.getElementById('summary-total').textContent = totalCount;
        document.getElementById('summary-passed').textContent = passedCount;
        document.getElementById('summary-failed').textContent = failedCount;
        document.getElementById('summary-skipped').textContent = skippedCount;
        document.getElementById('summary-duration').textContent = data.summary.totalDuration || '0s';
        document.getElementById('summary-rate').textContent = passRateStr;

        document.getElementById('legend-passed').textContent = passedCount;
        document.getElementById('legend-failed').textContent = failedCount;
        document.getElementById('legend-skipped').textContent = skippedCount;
        document.getElementById('pie-center-val').textContent = passRateStr;

        if (pieChartInstance) {
            pieChartInstance.data.datasets[0].data = [passedCount, failedCount, skippedCount];
            pieChartInstance.update();
        }

        renderSuites(activeSuites);
        renderFailedTests(activeFailedTests);
        renderPassedTests(activePassedTests);
        updateBrowserFooterInfo(projectId);
    }

    // Doughnut Chart
    var ctxPie = document.getElementById('pieChart').getContext('2d');
    pieChartInstance = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Passed', 'Failed', 'Skipped'],
            datasets: [{
                data: [data.summary.passed, data.summary.failed, data.summary.skipped],
                backgroundColor: ['#238636', '#da3633', '#d29922'],
                borderWidth: 0,
                cutout: '72%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    // Line Trend Chart
    var filledTrend = (data.trend || [0]).slice();
    while (filledTrend.length < 10) filledTrend.unshift(null);

    var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    var textColor = currentTheme === 'light' ? '#656d76' : '#8b949e';
    var gridColor = currentTheme === 'light' ? '#e1e4e8' : '#30363d';

    var ctxTrend = document.getElementById('trendChart').getContext('2d');
    trendChartInstance = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: Array.from({ length: 10 }, function(_, i) { return 'Run ' + (i + 1); }),
            datasets: [{
                label: 'Pass Rate (%)',
                data: filledTrend,
                borderColor: '#238636',
                backgroundColor: 'rgba(35, 134, 54, 0.08)',
                borderWidth: 2,
                pointBackgroundColor: '#238636',
                pointBorderColor: '#fff',
                pointRadius: 4,
                spanGaps: true,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 100, grid: { color: gridColor }, ticks: { color: textColor, callback: function(v) { return v + '%'; } } },
                x: { grid: { display: false }, ticks: { color: textColor } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Expand All functionality
    var allExpanded = false;
    document.getElementById('expand-all-btn').onclick = function() {
        allExpanded = !allExpanded;
        document.querySelectorAll('.suite-tests-block').forEach(function(el) {
            el.style.display = allExpanded ? 'block' : 'none';
        });
        var btn = document.getElementById('expand-all-btn');
        btn.innerHTML = allExpanded
            ? '<i class="fa-solid fa-chevron-up"></i> Collapse All'
            : '<i class="fa-solid fa-chevron-down"></i> Expand All';
    };

    function renderSuites(suitesToRender) {
        var suitesList = document.getElementById('suites-list');
        suitesList.innerHTML = '';

        if (!suitesToRender || suitesToRender.length === 0) {
            suitesList.innerHTML = '<div class="empty-state"><i class="fa-solid fa-folder-open"></i><div>No test suites executed for this browser.</div></div>';
            return;
        }

        suitesToRender.forEach(function(suite, sIdx) {
            var badges = [];
            if (suite.passed > 0) badges.push('<span class="stat-badge stat-passed"><i class="fa-regular fa-circle-check"></i> ' + suite.passed + ' passed</span>');
            if (suite.failed > 0) badges.push('<span class="stat-badge stat-failed"><i class="fa-regular fa-circle-xmark"></i> ' + suite.failed + ' failed</span>');
            if (suite.skipped > 0) badges.push('<span class="stat-badge stat-skipped"><i class="fa-regular fa-circle-minus"></i> ' + suite.skipped + ' skipped</span>');

            var testsHtml = '';
            if (suite.tests && suite.tests.length > 0) {
                testsHtml = '<div class="suite-tests-block" id="suite-tests-' + sIdx + '" style="display: none; background: var(--subrow-bg); border-top: 1px solid var(--border-color);">';
                suite.tests.forEach(function(test) {
                    var icon;
                    if (test.status === 'passed') {
                        icon = '<i class="fa-regular fa-circle-check" style="color:var(--pass-color)"></i>';
                    } else if (test.status === 'failed') {
                        icon = '<i class="fa-regular fa-circle-xmark" style="color:var(--fail-color)"></i>';
                    } else {
                        icon = '<i class="fa-regular fa-circle-minus" style="color:var(--skip-color)"></i>';
                    }
                    testsHtml += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; border-bottom: 1px solid var(--border-color);">' +
                        '<div style="display: flex; align-items: center; gap: 10px;">' + icon + ' <span style="font-size: 0.88rem;">' + escapeHtml(test.title) + '</span></div>' +
                        '<div style="color: var(--text-muted); font-size: 0.8rem; font-family: var(--mono-font);">' + test.duration + '</div>' +
                        '</div>';
                });
                testsHtml += '</div>';
            }

            var wrapper = document.createElement('div');
            wrapper.innerHTML =
                '<div class="suite-row" data-suite-idx="' + sIdx + '">' +
                    '<div class="suite-info">' +
                        '<i class="fa-solid fa-chevron-right suite-title-icon" style="color: var(--text-muted); font-size: 0.8rem;"></i>' +
                        '<div>' +
                            '<div class="suite-title">' + escapeHtml(suite.name) + '</div>' +
                            '<div class="suite-file">' + escapeHtml(suite.file) + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="suite-stats">' + badges.join('') + '</div>' +
                '</div>' +
                testsHtml;

            var row = wrapper.querySelector('.suite-row');
            row.onclick = (function(idx) {
                return function() {
                    var el = document.getElementById('suite-tests-' + idx);
                    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
                };
            })(sIdx);

            while (wrapper.firstChild) suitesList.appendChild(wrapper.firstChild);
        });
    }

    function renderFailedTests(failedToRender) {
        var failedSection = document.getElementById('failed-section');
        var listEl = document.getElementById('failed-list');
        var detailsEl = document.getElementById('failed-details-view');

        listEl.innerHTML = '';
        detailsEl.innerHTML = '';

        if (!failedToRender || failedToRender.length === 0) {
            failedSection.classList.add('hidden');
            return;
        }

        failedSection.classList.remove('hidden');
        document.getElementById('failed-count-title').textContent = failedToRender.length;

        var renderDetails = function(test) {
            var screenshotHtml = test.screenshot
                ? '<img src="' + test.screenshot + '" alt="Error screenshot" />'
                : '<div class="empty-state"><i class="fa-regular fa-image"></i><div>No screenshot captured for this test</div></div>';

            detailsEl.innerHTML =
                '<div class="failed-details-header-wrapper">' +
                    '<div class="failed-details-header">' +
                        '<div class="failed-details-title">' +
                            '<span>' + escapeHtml(test.name) + '</span>' +
                            '<span class="badge-fail">Failed</span>' +
                        '</div>' +
                        '<div class="failed-details-duration"><i class="fa-regular fa-clock"></i> ' + test.duration + '</div>' +
                    '</div>' +
                    '<div class="failed-details-filepath">' +
                        '<i class="fa-regular fa-file-code"></i> <span>' + escapeHtml(test.file) + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="tabs">' +
                    '<div class="tab active" data-target="content-screenshot"><i class="fa-solid fa-camera"></i> Screenshot</div>' +
                    '<div class="tab" data-target="content-error"><i class="fa-solid fa-circle-exclamation"></i> Error</div>' +
                    '<div class="tab" data-target="content-stacktrace"><i class="fa-solid fa-list"></i> Stack Trace</div>' +
                '</div>' +
                '<div id="content-screenshot" class="tab-content" style="display: block;">' +
                    '<div class="error-content-wrapper">' +
                        '<div class="error-screenshot">' + screenshotHtml + '</div>' +
                    '</div>' +
                '</div>' +
                '<div id="content-error" class="tab-content" style="display: none;">' +
                    '<div class="error-section">' +
                        '<pre>' + escapeHtml(test.error || 'No error message available') + '</pre>' +
                    '</div>' +
                '</div>' +
                '<div id="content-stacktrace" class="tab-content" style="display: none;">' +
                    '<div class="error-section">' +
                        '<pre style="border-color: var(--border-color); color: var(--text-main);">' + escapeHtml(test.stackTrace || 'No stack trace available') + '</pre>' +
                    '</div>' +
                '</div>';

            detailsEl.querySelectorAll('.tab').forEach(function(tab) {
                tab.onclick = function() {
                    detailsEl.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
                    detailsEl.querySelectorAll('.tab-content').forEach(function(c) { c.style.display = 'none'; });
                    tab.classList.add('active');
                    document.getElementById(tab.getAttribute('data-target')).style.display = 'block';
                };
            });
        };

        failedToRender.forEach(function(test, idx) {
            var item = document.createElement('div');
            item.className = 'failed-item' + (idx === 0 ? ' active' : '');
            item.innerHTML =
                '<div class="failed-item-title">' + escapeHtml(test.name) + '</div>' +
                '<div class="failed-item-file">' + escapeHtml(test.file) + '</div>' +
                '<div class="failed-item-status"><i class="fa-regular fa-circle-xmark"></i> Failed</div>';
            item.onclick = function() {
                document.querySelectorAll('.failed-item').forEach(function(el) { el.classList.remove('active'); });
                item.classList.add('active');
                renderDetails(test);
            };
            listEl.appendChild(item);
        });

        if (failedToRender.length > 0) renderDetails(failedToRender[0]);
    }

    function renderPassedTests(passedToRender) {
        var passedSection = document.getElementById('passed-section');
        var listEl = document.getElementById('passed-list');
        listEl.innerHTML = '';

        if (!passedToRender || passedToRender.length === 0) {
            passedSection.classList.add('hidden');
            return;
        }

        passedSection.classList.remove('hidden');
        document.getElementById('passed-count-title').textContent = passedToRender.length;

        passedToRender.forEach(function(test) {
            listEl.innerHTML +=
                '<div class="passed-test-row">' +
                    '<div class="passed-test-info">' +
                        '<i class="fa-regular fa-circle-check" style="color: var(--pass-color); flex-shrink: 0;"></i>' +
                        '<div style="min-width: 0; flex: 1;">' +
                            '<div class="passed-test-name">' + escapeHtml(test.name) + '</div>' +
                            '<div class="passed-test-file">' + escapeHtml(test.file) + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="passed-test-duration">' + test.duration + '</div>' +
                '</div>';
        });
    }

    function updateBrowserFooterInfo(projectId) {
        var bConfig = (data.browserConfigs && data.browserConfigs[projectId]) ? data.browserConfigs[projectId] : (data.browser || {});
        document.getElementById('browser-info').innerHTML =
            '<div class="info-label">Browser</div><div class="info-value">' + escapeHtml(bConfig.name || projectId) + '</div>' +
            '<div class="info-label">Headless</div><div class="info-value">' + (bConfig.headless !== undefined ? bConfig.headless : 'true') + '</div>' +
            '<div class="info-label">Viewport</div><div class="info-value">' + escapeHtml(bConfig.viewport || '1280x720') + '</div>';
    }

    // Environment Info
    var envGrid = document.getElementById('env-info');
    envGrid.innerHTML = '';
    var envData = data.environment || {};
    Object.entries(envData).forEach(function(entry) {
        var k = entry[0], v = entry[1];
        envGrid.innerHTML += '<div class="info-label">' + escapeHtml(k.charAt(0).toUpperCase() + k.slice(1)) + '</div><div class="info-value">' + escapeHtml(String(v)) + '</div>';
    });

    // Execution Info
    var execGrid = document.getElementById('execution-info');
    execGrid.innerHTML = '';
    var execData = data.execution || {};
    Object.entries(execData).forEach(function(entry) {
        var k = entry[0], v = entry[1];
        execGrid.innerHTML += '<div class="info-label">' + escapeHtml(k.charAt(0).toUpperCase() + k.slice(1)) + '</div><div class="info-value">' + escapeHtml(String(v)) + '</div>';
    });

    // Initial render
    switchBrowserTab(activeProjectId);
});
