import type { Metadata } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { SafetyProvider } from '@/lib/store';
import { ToastProvider } from '@/components/ui/toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Guardian | Campus Safety Reporter',
  description: 'Premium campus safety, incident reporting, and real-time hazard map for university students and administrators.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-surface-50 font-sans antialiased text-slate-800">
        <SafetyProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </SafetyProvider>
      </body>
    </html>
  );
}
