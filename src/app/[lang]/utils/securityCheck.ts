interface SecurityCheckResponse {
    isAutoClicker: boolean;
    isScriptDetected: boolean;
    lastClickTime: number;
    clickCount: number;
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    type: 'AUTO_CLICKER' | 'SCRIPT' | 'RAPID_CLICKING';
}

class SecurityCheck {
    private static instance: SecurityCheck;
    private clickTimes: number[] = [];
    private readonly MAX_CLICKS = 5; // Number of clicks to analyze
    private readonly MIN_INTERVAL = 1000; // Minimum time between clicks in ms
    private readonly DETECTION_WINDOW = 10000; // Time window for detection in ms

    private constructor() {}

    public static getInstance(): SecurityCheck {
        if (!SecurityCheck.instance) {
            SecurityCheck.instance = new SecurityCheck();
        }
        return SecurityCheck.instance;
    }

    public recordClick(): void {
        const now = Date.now();
        this.clickTimes.push(now);
        
        // Keep only the last MAX_CLICKS clicks
        if (this.clickTimes.length > this.MAX_CLICKS) {
            this.clickTimes.shift();
        }
    }

    private async reportViolation(type: 'AUTO_CLICKER' | 'SCRIPT' | 'RAPID_CLICKING', severity: 'LOW' | 'MEDIUM' | 'HIGH', details: any) {
        try {
            await fetch('/api/security', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    severity,
                    details
                })
            });
        } catch (error) {
            console.error('Failed to report security violation:', error);
        }
    }

    public async checkSecurity(): Promise<SecurityCheckResponse> {
        const now = Date.now();
        const recentClicks = this.clickTimes.filter(time => now - time < this.DETECTION_WINDOW);
        
        // Clean up old clicks
        this.clickTimes = recentClicks;

        if (recentClicks.length < 2) {
            return {
                isAutoClicker: false,
                isScriptDetected: false,
                lastClickTime: recentClicks[0] || now,
                clickCount: recentClicks.length,
                message: "Normal activity",
                severity: 'LOW',
                type: 'RAPID_CLICKING'
            };
        }

        // Check for consistent intervals (auto-clicker detection)
        const intervals: number[] = [];
        for (let i = 1; i < recentClicks.length; i++) {
            intervals.push(recentClicks[i] - recentClicks[i - 1]);
        }

        // Calculate standard deviation of intervals
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);

        // If standard deviation is very low, it might be an auto-clicker
        const isAutoClicker = stdDev < 50 && intervals.length >= 3;

        // Check for rapid clicking
        const isScriptDetected = intervals.some(interval => interval < this.MIN_INTERVAL);

        let message = "Normal activity";
        let type: 'AUTO_CLICKER' | 'SCRIPT' | 'RAPID_CLICKING' = 'RAPID_CLICKING';
        let severity: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

        if (isAutoClicker) {
            message = "Auto-clicker detected: Too consistent click pattern";
            type = 'AUTO_CLICKER';
            severity = 'HIGH';
        } else if (isScriptDetected) {
            message = "Script detected: Clicks are too rapid";
            type = 'SCRIPT';
            severity = 'MEDIUM';
        }

        // Report violation if severity is not LOW
        if (severity !== 'LOW') {
            await this.reportViolation(type, severity, {
                clickInterval: avg,
                patternMatch: stdDev < 50 ? 98 : stdDev < 100 ? 75 : 45,
                clickCount: recentClicks.length,
                timestamp: new Date()
            });
        }

        return {
            isAutoClicker,
            isScriptDetected,
            lastClickTime: recentClicks[recentClicks.length - 1],
            clickCount: recentClicks.length,
            message,
            severity,
            type
        };
    }

    public reset(): void {
        this.clickTimes = [];
    }
}

export const securityCheck = SecurityCheck.getInstance();
