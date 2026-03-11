import { SettingsUtils } from "@/utilities/settings-utils";

type LogLevel = "debug" | "error" | "info" | "warn";

class Logger {
    private static enabled = false;
    private static initialized = false;
    private static readonly prefix = "[Extended GitHub]";

    static async refresh(): Promise<void> {
        this.enabled = await SettingsUtils.isDebugLoggingEnabled();
        this.initialized = true;
    }

    static isEnabled(): boolean {
        return this.enabled;
    }

    static debug(message: string, data?: unknown): void {
        this.write("debug", message, data);
    }

    static info(message: string, data?: unknown): void {
        this.write("info", message, data);
    }

    static warn(message: string, data?: unknown): void {
        this.write("warn", message, data);
    }

    static error(message: string, data?: unknown): void {
        this.write("error", message, data);
    }

    private static write(
        level: LogLevel,
        message: string,
        data?: unknown
    ): void {
        if (!this.enabled) {
            return;
        }

        if (!this.initialized) {
            // Avoid surprising logs before settings are loaded.
            return;
        }

        const formatted = `${this.prefix} ${message}`;
        if (data === undefined) {
            console[level](formatted);
            return;
        }

        console[level](formatted, data);
    }
}

export { Logger };
