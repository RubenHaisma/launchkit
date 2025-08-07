import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesGrid } from '@/components/sections/features-grid';
import { ReplacementTools } from '@/components/sections/replacement-tools';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { CTASection } from '@/components/sections/cta-section';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ReplacementTools />
      <FeaturesGrid />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}