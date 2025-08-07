import { Mail } from 'lucide-react';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';
import { ContactForm } from '@/components/contact-form';

export const metadata = {
  title: 'Contact Us - LaunchPilot',
  description: 'Get in touch with the LaunchPilot team. We\'re here to help with any questions.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-6">
              <Mail className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Contact Us</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about LaunchPilot? We're here to help. Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}