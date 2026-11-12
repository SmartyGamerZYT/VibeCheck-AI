import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibeCheck AI — Intelligent Brand Governance & Pre-Publication Compliance',
  description: 'AI-powered brand governance platform that reviews content before publication, checks against approved guidelines, and ensures flawless brand consistency.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <Script
          src="https://js.puter.com/v2/"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-sand-50 text-sand-900 selection:bg-sand-300 selection:text-sand-950">
        {children}
      </body>
    </html>
  );
}
