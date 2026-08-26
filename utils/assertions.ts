import { expect } from '@playwright/test';

export type DefectReport = {
    bugTitle: string;
    module: string;
    expectedResult: string;
    actualResult: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    recommendation?: string;
};

export class CustomAssertions {
    static formatDefectReport(report: DefectReport): string {
        return [
            `\n---------------------------------------------------------`,
            `DEFECT REPORT: ${report.bugTitle}`,
            `Module: ${report.module}`,
            `Severity: ${report.severity}`,
            `Expected Result: ${report.expectedResult}`,
            `Actual Result:   ${report.actualResult}`,
            report.recommendation ? `Recommendation:  ${report.recommendation}` : '',
            `---------------------------------------------------------`,
        ].filter(Boolean).join('\n');
    }

    static assertBusinessRule(condition: boolean, report: DefectReport): void {
        const formattedMessage = this.formatDefectReport(report);
        expect(condition, formattedMessage).toBeTruthy();
    }

    static assertStringContains(actual: string, expectedSubstring: string, customMessage?: string): void {
        expect(actual, customMessage).toContain(expectedSubstring);
    }

    static assertNumberEquals(actual: number, expected: number, customMessage?: string): void {
        expect(actual, customMessage).toBe(expected);
    }

    static assertIsTrue(condition: boolean, customMessage?: string): void {
        expect(condition, customMessage).toBeTruthy();
    }
}
