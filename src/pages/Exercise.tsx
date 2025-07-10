import { TemplateRenderer } from '@/components/molecules/TemplateRenderer';

export function Exercise({ template }: { template: string }) {
  return <TemplateRenderer template={template} />;
}
