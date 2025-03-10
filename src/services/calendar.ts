import { calendar_v3, google } from 'googleapis';
import { GoogleAuth } from '../utils/google-auth';
import { EventAI } from '../types/bot';
import env from '../utils/env';

function listEvents() {
  return GoogleAuth.getInstance().authorize().then(auth => {
    const calendar = google.calendar({ version: 'v3', auth });
    return calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
  });
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
