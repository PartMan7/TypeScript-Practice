import '../index.css';
import { type ReactElement, type ReactNode, useCallback, useState } from 'react';
import { type Theme, ThemeProvider } from '@/components/ThemeProvider';
import '@theme-toggles/react/css/Classic.css';
import { Classic as ThemeToggle } from '@theme-toggles/react';

export function Layout({ children }: { children: ReactNode }): ReactElement {
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
      <div className="h-full w-full mx-auto p-8 text-center relative z-10 flex flex-col">
        <div className="flex grow-0 items-start">
          <div className="grow"></div>
          <ThemeToggle
            toggled={theme === 'dark'}
            duration={750}
            onToggle={onToggle}
            placeholder="Toggle theme"
            className="text-4xl"
          />
        </div>
        <div className="grow flex flex-col items-center">{children}</div>
      </div>
    </ThemeProvider>
  );
}
