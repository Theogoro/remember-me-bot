import { calendar_v3, google } from 'googleapis';
import { GoogleAuth } from '../utils/google-auth';
import { EventAI } from '../types/bot';
import env from '../utils/env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listEvents = async (query?: any) => {
  const auth = await GoogleAuth.getInstance().authorize();
  const calendar = google.calendar({ version: 'v3', auth });
  query = {...query, calendarId: env.calendarId};
  return calendar.events.list(query);
}

async function createEvent(event: EventAI) {
  const auth = await GoogleAuth.getInstance().authorize();
  const calendar = google.calendar({ version: 'v3', auth });
  const payload: calendar_v3.Params$Resource$Events$Insert = {
    calendarId: env.calendarId,
    auth,
    requestBody: {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: event.start
      },
      end: {
        dateTime: event.end
      },
    }
  }
  return calendar.events.insert(payload);
}

export { listEvents, createEvent };

// // console.log("List Events", { events: listEvents() });
// listEvents().then(({ data }) => {
//   console.log('Upcoming 10 events:');
//   // console.log({ data });
//   data.items?.forEach((event: any) => {
//     const start = event.start.dateTime || event.start.date;
//     console.log(`${start} - ${event.summary}`);
//   });
// });
