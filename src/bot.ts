import { Telegraf } from "telegraf";
import { Commands } from "./types/bot";

class TelegramBot {
  private ApiKey: string;
  private commands: Commands;
  private bot: Telegraf;

//   {
//     message: Update.New & Update.NonChannel & Message.TextMessage;
//     update_id: number;
// }


  constructor(ApiKey: string, commands: Commands) {
    this.ApiKey = ApiKey;
    this.bot = new Telegraf(ApiKey);
    this.bot.start(ctx => ctx.reply('Hi!'));
    this.commands = commands;
    this.initBot();
  }

  private initBot() {
    for (const command in this.commands) {
      this.bot.command(command, this.commands[command]);
    }
    this.bot.on('text', ctx => {
      console.log({
        text: ctx.message.text,
        from: ctx.message.from,
        chat: ctx.message.chat
      });
      ctx.reply('You said: ' + ctx.message.text);
    });
    this.bot.launch();
  }
}


export default TelegramBot;