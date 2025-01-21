declare namespace NodeJS {
    export interface ProcessEnv {
        OLLAMA_PROMPT: string;
        HOST1: string;
        HOST2: string;
        PORT1: number;
        PORT2: number;
    }
}