import { Logger } from "./logger.service"

export function InjectLogger(): ParameterDecorator {
    return function (target: any, key: string | symbol) {
        const value = new Logger();
        value.setContext(target.name);
        Object.defineProperty(target, key, {
            value,
            writable: false,
        });
    };
}