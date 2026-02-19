import { PropsWithChildren, useEffect } from 'react';
import { bootstrapAuthSession } from '@/modules/auth/authService';

export function AuthBootstrap({ children }: PropsWithChildren) {
  useEffect(() => {
    bootstrapAuthSession();
  }, []);

  return <>{children}</>;
}
