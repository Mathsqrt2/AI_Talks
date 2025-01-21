import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Ollama } from 'ollama-node';

@Injectable()
export class Gadacz1Service implements OnModuleInit {

  private readonly logger: Logger = new Logger(Gadacz1Service.name);
  private ollama: Ollama = new Ollama();

  async onModuleInit() {
    await this.ollama.setModel('gemma2:9b');
    this.ollama.setSystemPrompt(process.env.OLLAMA_PROMPT);
    this.logger.log("Gadacz1 ready to talk.");
  }

  public prompt = async (prompt: string) => {
    const response = await this.ollama.generate(prompt);
    this.ollama.setContext(response.stats.context);
    this.logger.log(response.output.toString().replaceAll('\n', ""));

    return response.output;
  }

}
