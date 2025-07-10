import { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { groupSub } from 'group-sub';

import { ShortInput } from '@/components/ui/ShortInput';
import { LongInput } from '@/components/ui/LongInput';
import { ContentCard } from '@/components/atoms/ContentCard';
import { Button } from '@/components/ui/button';
import { StaticEditor } from '@/components/molecules/StaticEditor';
import { useFetch } from '@/hooks/useFetch';
import { getName, NameInput } from '@/components/molecules/NameInput';
import { PacmanLoader } from 'react-spinners';

function BaseTemplateRenderer({ templateCode, template }: { templateCode: string; template: string }): ReactElement {
  // I apologize to everyone who has ever taught me
  // This is disgusting, but I'm proud of it
  const [startTime] = useState(() => {
    const current = Date.now();
    localStorage.setItem(`STARTED_AT:${template}`, current.toString());
    return current;
  });

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

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<boolean | null>(null);

  const handleSubmit = useCallback<() => void>(() => {
    const code = getCurrentCode();
    const name = getName();

    if (!code || !name) return;

    setSubmitting(true);
    fetch(`/api/submit/${template}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code, start: startTime }),
    }).then(res => {
      if (!res.ok) {
        setStatus(false);
        setSubmitting(false);
      } else {
        setStatus(true);
        setSubmitting(false);
        // TODO: Store in localStorage
      }
    });
  }, [getCurrentCode, template, startTime]);

  return (
    <div className="flex gap-24 w-full justify-around m-12 max-w-full">
      <ContentCard className="grow shrink basis-0 min-w-0">
        <pre className="text-start">
          {parts.map(part => (part === '\n' ? <br /> : typeof part === 'string' ? part : part.component))}
        </pre>
        <hr className="m-6 border-zinc-300 dark:border-zinc-600" />
        <form className="flex gap-4 justify-center" action={handleSubmit}>
          <NameInput />
          <Button disabled={submitting} className="w-32">
            {submitting ? 'Submitting...' : 'Submit!'}
          </Button>
          {/*TODO*/}
          <div className="w-3 h-3">
            {submitting ? (
              <PacmanLoader
                size={12}
                color="var(--foreground)"
                className="mt-1"
                speedMultiplier={1.5}
                cssOverride={{ width: 0 }}
              />
            ) : typeof status === 'boolean' ? (
              status ? (
                ':D'
              ) : (
                ':<'
              )
            ) : null}
          </div>
        </form>
      </ContentCard>
      <ContentCard className="grow shrink basis-0 min-w-0">
        <StaticEditor code={currentCode} />
      </ContentCard>
    </div>
  );
}

export function TemplateRenderer({ template }: { template: string }): ReactElement {
  const { data, loading, error } = useFetch<{ template: string }>(`/api/templates/${template}`);

  return (
    <>
      {loading ? <ContentCard>Loading...</ContentCard> : null}
      {data ? <BaseTemplateRenderer templateCode={data.template} template={template} /> : null}
      {error ? <ContentCard>Template not found.</ContentCard> : null}
    </>
  );
}
