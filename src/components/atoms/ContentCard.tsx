import type { ReactElement, ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';

export function ContentCard({ className, children }: { className?: string; children: ReactNode }): ReactElement {
  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-muted ${className || ''}`}>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
