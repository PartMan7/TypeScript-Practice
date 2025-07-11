import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useTheme } from '@/components/layout/ThemeProvider';
import prettify from '@/lib/utils';

const SANDBOX_THEMES = {
  light: 'sandbox',
  dark: 'sandbox-dark',
};

export function StaticEditor({ code }: { code: string }): ReactElement {
  const [loaded, setLoaded] = useState(false);
  const sandboxRef = useRef(null);

  const theme = useTheme();

  useEffect(() => {
    if (loaded) return;
    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = 'https://www.typescriptlang.org/js/vs.loader.js';
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {
      const require = window.require as unknown as typeof window.requirejs;

      require.config({
        paths: {
          vs: 'https://playgroundcdn.typescriptlang.org/cdn/5.8.3/monaco/min/vs',
          sandbox: 'https://www.typescriptlang.org/js/sandbox',
        },
      });

      require(['vs/editor/editor.main', 'vs/language/typescript/tsWorker', 'sandbox/index'], (
        main,
        _tsWorker,
        sandboxFactory
      ) => {
        setLoaded(false);

        const sandboxConfig = {
          text: code,
          compilerOptions: {},
          domID: 'monaco-editor-embed',
        };

        // @ts-ignore -- TS added by script
        const sandbox = sandboxFactory.createTypeScriptSandbox(sandboxConfig, main, window.ts);

        sandbox.monaco.editor.setTheme(SANDBOX_THEMES[theme]);
        sandbox.editor.updateOptions({ readOnly: true, renderValidationDecorations: 'on' });

        sandboxRef.current = sandbox;
      });
    };

    document.body.appendChild(getLoaderScript);
    // Do not add code or loaded or theme as a dependency!
  }, []);

  useEffect(() => {
    prettify(code)
      .then(prettyCode => {
        sandboxRef.current?.setText?.(prettyCode);
      })
      .catch(() => sandboxRef.current?.setText?.(code));
  }, [code]);

  useEffect(() => {
    sandboxRef.current?.monaco.editor.setTheme(SANDBOX_THEMES[theme]);
  }, [theme]);

  return (
    <>
      {loaded ? (
        <pre id="editor-loader" className="text-start">
          {code}
        </pre>
      ) : null}
      <div>
        <h2 className="font-bold text-2xl mb-4">Preview</h2>
        <div id="monaco-editor-embed" className="text-start w-full" style={{ height: 600 }}></div>
      </div>
    </>
  );
}
