import { Message } from 'telegraf/typings/core/types/typegram';
import TelegramBot from './bot';
import { cleanData, generateEventQuery } from './services/gemini';
import { Commands, EventAI } from './types/bot';
import env from './utils/env';
import { createEvent, listEvents } from './services/calendar';
import { calendar_v3 } from 'googleapis';



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
    },
    getEvents: async ctx => {
      try {
        ctx.reply('Getting events...');
        const message = ctx.message as Message.TextMessage;
        const query = await generateEventQuery(message.text || '');
        const queryObj = JSON.parse(query);
        console.log("Query:",{ queryObj });
        const events = await listEvents(queryObj);
        const { items } = events.data;
        items?.forEach((event: calendar_v3.Schema$Event) => {
          let start = 'All Day';
          if (event.start?.dateTime) {
            const date = new Date(event.start.dateTime);
            start = date.toLocaleString();
          }
          if (event.start?.date) {
            start = event.start.date;
          }
          // const start = event.start?.dateTime || event.start?.date || 'All Day'

          ctx.reply(`${start} - ${event.summary}`);
        });
      } catch (error) {
        ctx.reply('Error getting events - ' + error);
      }
    }
  };
  new TelegramBot(env.telegramToken, commands);
}

main();