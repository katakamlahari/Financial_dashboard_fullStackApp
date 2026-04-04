enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private logLevel: LogLevel;

  constructor() {
    const level = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
    this.logLevel = LogLevel[level as keyof typeof LogLevel] || LogLevel.INFO;
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = this.getTimestamp();
    const log = `[${timestamp}] [${level}] ${message}`;

    if (data) {
      console.log(log, JSON.stringify(data, null, 2));
    } else {
      console.log(log);
    }
  }

  debug(message: string, data?: any): void {
    if (this.logLevel === LogLevel.DEBUG) {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  info(message: string, data?: any): void {
    if (
      this.logLevel === LogLevel.DEBUG ||
      this.logLevel === LogLevel.INFO
    ) {
      this.log(LogLevel.INFO, message, data);
    }
  }

  warn(message: string, data?: any): void {
    if (
      this.logLevel === LogLevel.DEBUG ||
      this.logLevel === LogLevel.INFO ||
      this.logLevel === LogLevel.WARN
    ) {
      this.log(LogLevel.WARN, message, data);
    }
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }
}

export default new Logger();
