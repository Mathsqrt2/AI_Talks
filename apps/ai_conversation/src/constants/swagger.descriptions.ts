import { LogMessageContent } from "@libs/types/logs"

export class SwaggerMessages {

    public static description: LogMessageContent = {
        apiRoute: (): string => `api`,
        appVersion: (): string => `3.0`,
        appTitle: (): string => `AI Talks`,
        appHeadingTitle: (): string => `AI Talks Documentation`,
        appDescription: (): string => `The application initializes a conversation between two language models, whose task is to engage in continuous dialogue with each other. The goal of this experiment is to stimulate the emergence of interesting digressions between the models. This API enables dynamic management of the application's settings via HTTP requests.`,
    }

    public static example: LogMessageContent = {

    }

}