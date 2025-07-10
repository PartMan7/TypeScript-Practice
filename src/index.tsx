import { serve } from 'bun';
import z from 'zod';
import path from 'path';
import index from '@/index.html';
import { readdir } from 'fs/promises';
import { validate } from '@/checker';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/*': () => Response.json({ message: 'API not found!' }, { status: 404 }),

    '/socket': (req, server) => {
      if (!server.upgrade(req)) return new Response('Could not open socket.', { status: 500 });
    },

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
        const reqData = z.object({ code: z.string(), name: z.string() }).safeParse(await req.json());
        if (!reqData.success) return Response.json({ message: 'Invalid input' }, { status: 400 });

        try {
          const success = await validate(reqData.data.code, exercise);
          if (success) {
            // TODO: Dispatch to socket and store in state
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
  },

  websocket: {
    message(ws, message) {
      ws.send('Response!');
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
