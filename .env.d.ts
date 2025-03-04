declare namespace NodeJS {
  export interface ProcessEnv {
    API_PORT: number;
    HOST: string;
    OLLAMA_HOST: string;
    OLLAMA_PORT: number;

    TOKEN1: string;
    TOKEN2: string;

    PUBLIC_TELEGRAM_CHAT_ID: string;
    GROUP_CHAT_ID: string;

    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;
  }
}
