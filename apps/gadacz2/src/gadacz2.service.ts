import * as TelegramBot from "node-telegram-bot-api";
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Ollama } from 'ollama-node';

@Injectable()
export class Gadacz2Service implements OnModuleInit {

  private bot: TelegramBot;
  private readonly logger: Logger = new Logger(Gadacz2Service.name);
  private ollama: Ollama = new Ollama();
  private readonly maxContextSize: number = 2048;

  constructor(
    private readonly http: HttpService,
  ) { }

  async onModuleInit() {
    this.bot = new TelegramBot(process.env.TOKEN2, { polling: true });
    await this.ollama.setModel('gemma2:9b');

    this.ollama.setSystemPrompt(process.env.OLLAMA_PROMPT);
    this.logger.log("Gadacz2 ready to talk.");
  }

  private trimContext(context: number[]) {
    while (context.join(' ').length > this.maxContextSize) {
      context.shift();
    }
    return context;
  }

  public prompt = async (prompt: string): Promise<void> => {
    try {
      const response = await this.ollama.generate(prompt);
      this.ollama.setContext(this.trimContext(response.stats.context));

      const newResponse = response.output.toString().replaceAll('\n', "");
      this.bot.sendMessage(process.env.GROUP_CHAT_ID, newResponse);

      this.http.post(process.env.HOST1, { prompt: newResponse });
    } catch (err) {
      this.logger.error(`Przepełniony kontekst`);
    }
  }

}
