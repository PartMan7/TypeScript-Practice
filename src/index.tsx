import { serve } from 'bun';
import path from 'path';
import index from '@/index.html';
import { readdir } from 'fs/promises';

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
      } catch (e) {
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
