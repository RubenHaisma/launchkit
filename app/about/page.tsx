'use client';

import { motion } from 'framer-motion';
import { Rocket, Heart, Target, Users } from 'lucide-react';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

const timeline = [
  { year: '2023', title: 'The Idea', description: 'Frustrated with juggling 6+ marketing tools, we decided to build one platform to rule them all.' },
  { year: '2024', title: 'First Users', description: 'Launched in private beta. 500 indie makers signed up in the first week.' },
  { year: '2024', title: 'AI Revolution', description: 'Integrated GPT-4 and Claude for human-level marketing content generation.' },
  { year: '2024', title: 'Scale Mode', description: 'Now serving 10K+ creators worldwide with 2M+ pieces of content generated.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Built by <span className="text-gradient">Indie Hackers</span>,
              <br />
              For Indie Hackers
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We know the struggle of building a SaaS solo. LaunchPilot was born from our own pain of managing too many marketing tools and not enough time.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          >
            <div className="glassmorphism rounded-xl p-8 text-center hover-lift">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold font-sora mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                Democratize world-class marketing for every indie maker, regardless of budget or experience.
              </p>
            </div>

            <div className="glassmorphism rounded-xl p-8 text-center hover-lift">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold font-sora mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                A world where great products succeed because creators can focus on building, not marketing.
              </p>
            </div>

            <div className="glassmorphism rounded-xl p-8 text-center hover-lift">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold font-sora mb-4">Our Values</h3>
              <p className="text-muted-foreground">
                Transparency, simplicity, and relentless focus on helping our community succeed.
              </p>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-24"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-sora text-center mb-16">
              Our <span className="text-gradient">Journey</span>
            </h2>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
              
              <div className="space-y-16">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="glassmorphism rounded-xl p-6">
                        <div className="text-2xl font-bold text-gradient mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold font-sora mb-3">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-background" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Team Section - Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-sora mb-16">
              Built by <span className="text-gradient">Indie Makers</span>
            </h2>
            
            <div className="glassmorphism rounded-xl p-8 max-w-2xl mx-auto">
              <p className="text-lg text-muted-foreground mb-6">
                LaunchPilot is built by a passionate team of indie makers who understand the challenges of building and marketing SaaS products.
              </p>
              <p className="text-muted-foreground">
                We're a remote-first team focused on creating tools that actually help founders succeed. 
                Our mission is to democratize world-class marketing for every indie maker.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}