export type LogMessages = { [key in `error` | `warn` | `log`]: LogMessageContent };

export type LogMessageContent = {
    [key: string]: LogMessageFunction
};

type LogMessageFunction = (() => string) | ((param?: number | string) => string);

export type LoggerConfig = {
    context?: any,
    save?: boolean,
}

export type ErrorConfig = LoggerConfig & {
    error?: Error | string,
}
