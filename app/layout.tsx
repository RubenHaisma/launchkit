import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { Providers } from './providers';
import { CookieBanner } from '@/components/ui/cookie-banner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: 'LaunchPilot - Your AI Marketing Co-founder',
  description: 'The ultimate AI-powered SaaS platform that replaces Jasper, TweetHunter, Mailchimp & more. Launch faster, market smarter.',
  keywords: 'AI marketing, SaaS, content generation, Product Hunt, email marketing, social media',
  openGraph: {
    title: 'LaunchPilot - Your AI Marketing Co-founder',
    description: 'The ultimate AI-powered SaaS platform that replaces Jasper, TweetHunter, Mailchimp & more. Launch faster, market smarter.',
    url: 'https://launchpilot.ai',
    siteName: 'LaunchPilot',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaunchPilot - Your AI Marketing Co-founder',
    description: 'The ultimate AI-powered SaaS platform that replaces Jasper, TweetHunter, Mailchimp & more. Launch faster, market smarter.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} font-inter antialiased`}>
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}