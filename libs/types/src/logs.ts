export type LogMessages = { [key in `error` | `warn` | `log`]: LogMessage };
type LogMessage = { [key: string]: LogFunction };
type LogFunction = (() => string) | ((param?: number | string) => string);