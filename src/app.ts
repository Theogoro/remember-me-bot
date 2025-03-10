import { Message } from 'telegraf/typings/core/types/typegram';
import TelegramBot from './bot';
import { cleanData } from './services/gemini';
import { Commands, EventAI } from './types/bot';
import env from './utils/env';
import { createEvent } from './services/calendar';



function main() {
  console.log('Starting bot...');
  if (!env.telegramToken) {
    throw new Error('BOT_TOKEN must be provided!');
  }
  const commands: Commands = {
    start: ctx => ctx.reply('Welcome to remember-me  Bot!'),
    // recordar: ctx => {
    //   const message = ctx.message as Message.TextMessage;
    //   cleanData(message.text || '').then((response) => {
    //     ctx.reply(response);
    //   });
    // },
    recordar: ctx => {
      try{
        const message = ctx.message as Message.TextMessage;
        cleanData(message.text || '').then((response) => {
          const responseAsJSON = JSON.parse(response) as EventAI;
          createEvent(responseAsJSON).then(() => {
            ctx.reply(`I just created the event: ${responseAsJSON.title} - ${responseAsJSON.description}`);
          });
        });
      } catch (error) {
        ctx.reply('Error creating event - ' + error);
      }
    }
  };
  new TelegramBot(env.telegramToken, commands);
}

main();