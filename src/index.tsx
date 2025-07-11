import { serve, type ServerWebSocket } from 'bun';
import z from 'zod';
import path from 'path';
import { readdir } from 'fs/promises';
import { validate } from '@/checker';
import { getCurrentLogs, log } from '@/logger/logs.ts';

import exercises from '@/pages/exercises.html';
import exercise from '@/pages/exercise.html';
import logs from '@/pages/logs.html';
import page404 from '@/pages/404.html';

const connectedSockets: Set<ServerWebSocket<any>> = new Set();

const server = serve({
  routes: {
    '/': exercises,
    '/exercise/:exercise': exercise,
    '/logs': logs,

    '/*': page404,

    '/api/*': () => Response.json({ message: 'API not found!' }, { status: 404 }),
    '/api/templates/:template': async req => {
      const template = req.params.template;
      try {
        const templateData = await Bun.file(path.join(__dirname, '..', 'templates', `${template}.template.ts`)).text();
        return Response.json({ template: templateData });
      } catch {
        return Response.json({ message: 'Not found' }, { status: 404 });
      }
    },
    '/api/exercises': async () => {
      const files = await readdir(path.join(__dirname, '..', 'templates'));
      const exercises = files
        .filter(file => file.endsWith('.template.ts'))
        .map(file => file.replace('.template.ts', ''));
      return Response.json({ exercises });
    },
    '/api/submit/:exercise': {
      POST: async req => {
        const exercise = req.params.exercise;
        const reqData = z.object({ code: z.string(), name: z.string(), start: z.number() }).safeParse(await req.json());
        if (!reqData.success) return Response.json({ message: 'Invalid input' }, { status: 400 });

        try {
          const success = await validate(reqData.data.code, exercise);
          if (success) {
            log(
              {
                code: reqData.data.code,
                name: reqData.data.name,
                start: new Date(reqData.data.start),
                at: new Date(),
                template: exercise,
              },
              connectedSockets
            );
            return Response.json({ message: 'Valid input!' });
          } else return Response.json({ message: 'Failed.' }, { status: 400 });
        } catch {
          return Response.json({ message: 'Not found' }, { status: 404 });
        }
      },
    },

    '/favicon.ico': new Response(await Bun.file(path.join(__dirname, '..', 'assets', 'logo.png')).bytes(), {
      headers: { 'Content-Type': 'image/x-icon' },
    }),
    '/robots.txt': new Response(await Bun.file(path.join(__dirname, '..', 'assets', 'robots.txt')).bytes()),

    '/socket': (req, server) => {
      if (!server.upgrade(req)) return new Response('Could not open socket.', { status: 500 });
    },
  },

  websocket: {
    open(ws) {
      connectedSockets.add(ws);
      ws.send(getCurrentLogs());
    },
    message() {
      // Do nothing with incoming messages for sockets
    },
    close(ws) {
      connectedSockets.delete(ws);
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
