import * as TelegramBot from "node-telegram-bot-api";
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Ollama } from 'ollama-node';


@Injectable()
export class Gadacz1Service implements OnModuleInit {

  private bot: TelegramBot;
  private readonly logger: Logger = new Logger(Gadacz1Service.name);
  private readonly maxContextSize: number = 1024;
  private ollama: Ollama = new Ollama();
  private index: number = 0;

  constructor(
    private readonly http: HttpService,
  ) { }

  async onModuleInit() {
    this.bot = new TelegramBot(process.env.TOKEN1, { polling: true });
    await this.ollama.setModel('gemma2:9b');

    this.ollama.setSystemPrompt(process.env.OLLAMA_PROMPT);
    this.logger.log("Gadacz1 ready to talk.");
  }

  private trimContext(context: number[]) {
    while (context.join(' ').length > this.maxContextSize) {
      context.shift();
    }
    return context;
  }

  public prompt = async (prompt: string): Promise<void> => {

    const time = Date.now();
    this.logger.log(`Rozpoczynam generowanie odpowiedzi ${this.index}.`);

    try {
      const response = await this.ollama.generate(prompt);
      this.ollama.setContext(this.trimContext(response.stats.context));

      const newResponse = response.output.toString().replaceAll('\n', "");
      this.bot.sendMessage(process.env.GROUP_CHAT_ID, newResponse);

      this.http.post(process.env.HOST2, { prompt: newResponse }).subscribe();
    } catch (err) {
      this.logger.error(`Przepełniony kontekst`);
    }

    this.logger.log(`Zakończyłem generowanie odpowiedzi ${this.index++}. Czas trwania (${Date.now() - time})`)
  }

}
