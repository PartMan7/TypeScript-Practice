import '@/index.css';
import { type ReactElement, type ReactNode, useCallback, useState } from 'react';
import { type Theme, ThemeProvider } from '@/components/layout/ThemeProvider';
import '@theme-toggles/react/css/Classic.css';
import { GitHub } from '@/components/layout/GitHub';
import { Classic as ThemeToggle } from '@theme-toggles/react';

export function Layout({ header, children }: { header: ReactNode; children: ReactNode }): ReactElement {
  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  });

  const onToggle = useCallback(() => {
    setTheme(oldTheme => {
      const newTheme = oldTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(newTheme);
      return newTheme;
    });
  }, []);

  return (
    <ThemeProvider value={theme}>
      <div className="h-full w-full mx-auto p-8 pb-0 text-center relative z-10 flex flex-col">
        <div className="flex grow-0 items-start">
          {header}
          <div className="grow" />
          <ThemeToggle
            toggled={theme === 'dark'}
            duration={750}
            onToggle={onToggle}
            placeholder="Toggle theme"
            className="text-4xl"
          />
        </div>
        <div className="grow flex flex-col items-center">{children}</div>
        <div className="flex grow-0 shrink-0 justify-end items-center min-h-24">
          <a href="https://github.com/PartMan7/Typescript-Practice" target="_blank">
            <GitHub />
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
