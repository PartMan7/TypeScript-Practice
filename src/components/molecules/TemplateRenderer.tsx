import {
  type ReactElement,
  type ReactNode,
  Suspense,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { groupSub } from 'group-sub';
import { ErrorBoundary } from 'react-error-boundary';

import { ShortInput } from '@/components/molecules/ShortInput';
import { LongInput } from '@/components/molecules/LongInput';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StaticEditor } from '@/components/molecules/StaticEditor';

type TemplateRendererProps = { template: string; onSubmit: (code: string) => void };

function BaseTemplateRenderer({ template, onSubmit }: TemplateRendererProps): ReactElement {
  const [templateResponse, setTemplateResponse] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/templates/${template}`)
      .then(res => res.json() as Promise<{ template: string }>)
      .then(data => {
        if (isMounted) setTemplateResponse(data?.template);
      });
    return () => {
      isMounted = false;
    };
  }, [template]);

  const [currentCode, setCurrentCode] = useState(() => '');

  const onChange = useRef<() => void | null>(null);

  const parts = useMemo(() => {
    if (!templateResponse) return ['Loading...'];

    const _parts = groupSub(templateResponse, {
      '\n': '\n',
      '/* SHORT_INPUT */': ShortInput,
      '/* LONG_INPUT */': LongInput,
    }).map(part => {
      if (typeof part === 'string') return part;

      const Input = part;
      let value = '';
      return {
        getValue: () => value,
        component: (
          <Input
            onChange={newValue => {
              value = newValue;
              onChange.current?.();
            }}
          />
        ),
      };
    });
    setCurrentCode(_parts.map(part => (typeof part === 'string' ? part : part.getValue())).join(''));
    return _parts;
  }, [templateResponse]);

  const getCurrentCode = useCallback(() => {
    return parts.map(part => (typeof part === 'string' ? part : part.getValue())).join('');
  }, [parts]);

  useEffect(() => {
    onChange.current = () => {
      setCurrentCode(getCurrentCode());
    };
  }, [getCurrentCode]);

  return (
    <div className="flex gap-24 w-full justify-around m-12 max-w-full">
      <Card className="bg-card/50 backdrop-blur-sm border-muted grow shrink basis-0 min-w-0">
        <CardContent className="pt-6">
          <pre className="text-start">
            {parts.map(part => (part === '\n' ? <br /> : typeof part === 'string' ? part : part.component))}
          </pre>
          <hr className="m-6 border-zinc-300 dark:border-zinc-600" />
          <Button onClick={() => console.log(getCurrentCode())}>Submit!</Button>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm border-muted grow shrink basis-0 min-w-0">
        <CardContent className="pt-6">
          <StaticEditor code={currentCode} />
        </CardContent>
      </Card>
    </div>
  );
}

export function TemplateRenderer(props: TemplateRendererProps): ReactElement {
  return (
    <Suspense fallback={'Loading...'}>
      <ErrorBoundary fallback="Template not found.">
        <BaseTemplateRenderer {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
