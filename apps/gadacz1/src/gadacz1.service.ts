import { Injectable, OnModuleInit } from '@nestjs/common';
import { Ollama } from 'ollama-node';

@Injectable()
export class Gadacz1Service implements OnModuleInit {


  private ollama: Ollama = new Ollama();


  async onModuleInit() {
    await this.ollama.setModel('gemma2:9b');
    this.ollama.setSystemPrompt(process.env.OLLAMA_PROMPT);

    const print = (word: string) => {
      process.stdout.write(word);
    }

    // const g1 = this.ollama.streamingGenerate("Why is sky blue?", print);
    // const g2 = this.ollama.streamingGenerate("o co pytałem Cię wcześniej?", print);

    // await Promise.all([g1, g2]);

    console.log("-------------------------------------------------");
  }

}
