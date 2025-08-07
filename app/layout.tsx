import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: 'LaunchPilot - Your AI Marketing Co-founder',
  description: 'The ultimate AI-powered SaaS platform that replaces Jasper, TweetHunter, Mailchimp & more. Launch faster, market smarter.',
  keywords: 'AI marketing, SaaS, content generation, Product Hunt, email marketing, social media',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} font-inter antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}