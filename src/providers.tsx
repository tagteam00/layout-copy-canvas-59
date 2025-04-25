
import { ReactNode } from 'react';
import { ThemeProvider } from './components/ui/theme-provider';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
