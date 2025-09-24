import { LoggerTarget } from "@libs/types/logger.types";
import { Inject, Type } from "@nestjs/common";
export const getLoggerToken = (target: Type<LoggerTarget>) => `LOGGER_${target.name}`;
export const InjectLogger = (target: Type<LoggerTarget>) => Inject(getLoggerToken(target));