export type LogMessages = { [key in `error` | `warn` | `log`]: LogMessage };
type LogMessage = { [key: string]: LogFunction };
type LogFunction = (() => string) | ((param?: number | string) => string);

export type LoggerConfig = {
    context?: any,
    save?: boolean,
}

export type ErrorConfig = LoggerConfig & {
    error?: Error | string,
}