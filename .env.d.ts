declare namespace NodeJS {
  export interface ProcessEnv {
    OLLAMA_PROMPT: string;
    OLLAMA_PROMPT1: string;
    OLLAMA_PROMPT2: string;
    HOST1: string;
    HOST2: string;

    OLLAMA_HOST1: string;
    OLLAMA_HOST2: string;

    PORT1: number;
    PORT2: number;

    TOKEN1: string;
    TOKEN2: string;

    GROUP_CHAT_ID: string;
    INITIAL_PROMPT: string;

    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;

    REDIS_HOST: string;
    REDIS_PORT: number;
  }
}
