import { useEffect, useRef, useState, type ReactElement } from 'react';

export function StaticEditor({ code }: { code: string }): ReactElement {
  const [loaded, setLoaded] = useState(false);
  const sandboxRef = useRef(null);

  useEffect(() => {
    if (loaded) return;
    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = 'https://www.typescriptlang.org/js/vs.loader.js';
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {
      const require = window.require as unknown as typeof window.requirejs;

      require.config({
        paths: {
          vs: 'https://playgroundcdn.typescriptlang.org/cdn/4.0.5/monaco/min/vs',
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
          text: '// Your code will be rendered here once you start typing!',
          compilerOptions: {},
          domID: 'monaco-editor-embed',
        };

        // @ts-ignore -- TS added by script
        const sandbox = sandboxFactory.createTypeScriptSandbox(sandboxConfig, main, window.ts);

        sandbox.monaco.editor.setTheme('sandbox-dark');
        sandbox.editor.updateOptions({ readOnly: true, renderValidationDecorations: 'on' });

        sandboxRef.current = sandbox;
      });
    };

    document.body.appendChild(getLoaderScript);
    // Do not add loaded or code as a dependency!
  }, []);

  useEffect(() => {
    if (code !== sandboxRef.current?.getText?.()) sandboxRef.current?.setText?.(code);
  }, [code]);

  return (
    <>
      {loaded ? (
        <pre id="editor-loader" className="text-start">
          {code}
        </pre>
      ) : null}
      <div>
        <h2 className="font-bold text-2xl mb-4">Preview</h2>
        <div id="monaco-editor-embed" className="text-start w-full" style={{ height: 800 }}></div>
      </div>
    </>
  );
}
