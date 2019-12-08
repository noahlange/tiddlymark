declare module '$:/core/modules/utils/logger.js' {
  interface LoggerOptions {
    color?: string;
    enable?: boolean;
  }

  export default class Logger {
    public log(message: string): void;
    public table(value: any): void;
    public alert(...text: string[]): void;

    constructor(componentName?: string, options?: LoggerOptions);
  }
}
