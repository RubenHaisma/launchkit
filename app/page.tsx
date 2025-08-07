import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesGrid } from '@/components/sections/features-grid';
import { ReplacementTools } from '@/components/sections/replacement-tools';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { CTASection } from '@/components/sections/cta-section';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';
import { AiDemo } from '@/components/ai-demo';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <div className="py-20 bg-gradient-to-b from-background via-purple-900/20 to-background">
        <AiDemo />
      </div>
      <ReplacementTools />
      <FeaturesGrid />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}