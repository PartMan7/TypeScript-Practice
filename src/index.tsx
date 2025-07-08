import { serve } from 'bun';
import path from 'path';
import index from './index.html';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/*': () => Response.json({ message: 'API not found!' }, { status: 404 }),

    '/socket': (req, server) => {
      if (!server.upgrade(req)) return new Response('Could not open socket.', { status: 500 });
    },

    '/api/hello': {
      async GET(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'GET',
        });
      },
      async PUT(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'PUT',
        });
      },
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

    '/api/hello/:name': async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  websocket: {
    message(ws, message) {
      ws.send('Response!');
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
