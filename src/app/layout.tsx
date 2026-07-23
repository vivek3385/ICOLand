import { ReactNode } from 'react';
import '../index.css';
import '../App.css';

export const metadata = {
  title: 'ICOLand',
  description: 'Powering Data For The New Equity Blockchain',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
