import { AuthProvider } from '@/providers/auth-provider';
import { MockProvider } from '@/components/mock-provider';
import { StickyHeader } from '@/components/ui/base';

import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Metra',
  description: 'Community food sharing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MockProvider>
          <AuthProvider>
            <StickyHeader />
            {children}
          </AuthProvider>
        </MockProvider>
      </body>
    </html>
  );
}