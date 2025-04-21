declare namespace NodeJS {
  export interface ProcessEnv {
    API_PORT: number;
    OLLAMA_HOST: string;

    TOKEN1: string;
    TOKEN2: string;

    TELEGRAM_INVITATION: string;
    PUBLIC_TELEGRAM_CHAT_ID: string;
    GROUP_CHAT_ID: string;

    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;
  }
}
