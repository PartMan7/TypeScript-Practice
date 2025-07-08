/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from './components/Layout';

import { Index } from './pages/index';
import { Exercise } from './pages/Exercise';
import { Page404 } from './pages/404';

const route = window.location.pathname.replace(/^\/|\/$/g, '');
const path = route.split('/');

let page;
if (route.length === 0) page = <Index />;
else if (path[0] === 'exercise') {
  if (path[1]) page = <Exercise template={path[1]} />;
  else page = <Page404 />; // TODO
} else page = <Page404 />;

const elem = document.getElementById('root')!;
const app = (
  <StrictMode>
    <Layout>{page}</Layout>
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
