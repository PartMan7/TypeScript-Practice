import type { ReactElement, ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card'

export function ContentCard({ children }: { children: ReactNode }): ReactElement {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-muted grow shrink basis-0 min-w-0">
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
