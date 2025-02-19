declare namespace NodeJS {
  export interface ProcessEnv {
    API_PORT: number;

    OLLAMA_PROMPT: string;
    OLLAMA_PROMPT1: string;
    OLLAMA_PROMPT2: string;
    WORKER_CONTEXT: string;
    HOST: string;

    OLLAMA_HOST: string;
    OLLAMA_PORT: number;

    TOKEN1: string;
    TOKEN2: string;

    GROUP_CHAT_ID: string;
    INITIAL_PROMPT: string;

    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;
  }
}
