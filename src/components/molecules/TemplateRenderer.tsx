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

import { ShortInput } from '@/components/ui/ShortInput';
import { LongInput } from '@/components/ui/LongInput';
import { ContentCard } from '@/components/atoms/ContentCard';
import { Button } from '@/components/ui/button';
import { StaticEditor } from '@/components/molecules/StaticEditor';
import { useFetch } from '@/hooks/useFetch';

function BaseTemplateRenderer({
  templateCode,
  onSubmit,
}: {
  templateCode: string;
  onSubmit: (code: string) => void;
}): ReactElement {
  const [currentCode, setCurrentCode] = useState(() => templateCode);

  const onChange = useRef<() => void | null>(null);

  const parts = useMemo(() => {
    const _parts = groupSub(templateCode, {
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
  }, [templateCode]);

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
      <ContentCard className="grow shrink basis-0 min-w-0">
        <pre className="text-start">
          {parts.map(part => (part === '\n' ? <br /> : typeof part === 'string' ? part : part.component))}
        </pre>
        <hr className="m-6 border-zinc-300 dark:border-zinc-600" />
        <Button onClick={() => console.log(getCurrentCode())}>Submit!</Button>
      </ContentCard>
      <ContentCard className="grow shrink basis-0 min-w-0">
        <StaticEditor code={currentCode} />
      </ContentCard>
    </div>
  );
}

export function TemplateRenderer({
  template,
  onSubmit,
}: {
  template: string;
  onSubmit: (code: string) => void;
}): ReactElement {
  const { data, loading, error } = useFetch<{ template: string }>(`/api/templates/${template}`);

  return (
    <>
      {loading ? <ContentCard>Loading...</ContentCard> : null}
      {data ? <BaseTemplateRenderer onSubmit={onSubmit} templateCode={data.template} /> : null}
      {error ? <ContentCard>Template not found.</ContentCard> : null}
    </>
  );
}
