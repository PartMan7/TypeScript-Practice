import { type ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '@/components/layout/Layout';
import { Header as DefaultHeader } from '@/components/layout/Header';

type Header = ReactNode;
type Body = ReactNode;

const elem = document.getElementById('root')!;

export function render(body: Body, header: Header = <DefaultHeader />): void {
  const app = (
    <StrictMode>
      <Layout header={header}>{body}</Layout>
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
}
