'use client';

import { motion } from 'framer-motion';
import { 
  PenTool, 
  Rocket, 
  MessageSquare, 
  FileText, 
  Mail, 
  Twitter,
  BarChart3,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: PenTool,
    title: 'AI Content Generator',
    description: 'Generate high-converting copy for any platform in seconds. Tweets, blogs, emails, and more.',
    color: 'from-purple-500 to-purple-600',
    delay: 0.1,
  },
  {
    icon: Rocket,
    title: 'Product Hunt Launch Engine',
    description: 'Complete launch strategy with optimized copy, maker comments, and hunter outreach.',
    color: 'from-orange-500 to-red-500',
    delay: 0.2,
  },
  {
    icon: MessageSquare,
    title: 'Reddit & IndieHackers Poster',
    description: 'AI-crafted posts that follow community guidelines and drive authentic engagement.',
    color: 'from-blue-500 to-cyan-500',
    delay: 0.3,
  },
  {
    icon: FileText,
    title: 'SEO Blog Generator',
    description: 'Long-form, SEO-optimized articles that rank on Google and convert readers to customers.',
    color: 'from-green-500 to-emerald-500',
    delay: 0.4,
  },
  {
    icon: Mail,
    title: 'Cold Email Engine',
    description: 'Personalized outreach sequences that get opened, read, and replied to.',
    color: 'from-pink-500 to-rose-500',
    delay: 0.5,
  },
  {
    icon: Twitter,
    title: 'Twitter Thread Writer',
    description: 'Viral-ready thread hooks, engaging content, and strategic call-to-actions.',
    color: 'from-sky-500 to-blue-500',
    delay: 0.6,
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Real-time insights on content performance, engagement rates, and conversion metrics.',
    color: 'from-violet-500 to-purple-500',
    delay: 0.7,
  },
  {
    icon: Zap,
    title: 'AI Strategy Planner',
    description: 'Custom 30-day marketing roadmaps tailored to your SaaS product and target audience.',
    color: 'from-yellow-500 to-orange-500',
    delay: 0.8,
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-sora mb-6">
            Everything You Need to{' '}
            <span className="text-gradient">Launch & Scale</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From ideation to execution, LaunchPilot provides all the AI-powered tools you need to build, launch, and grow your SaaS.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
              viewport={{ once: true }}
              className="group glassmorphism rounded-xl p-6 hover-lift cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold font-sora mb-3 group-hover:text-gradient transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-6 py-3">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="font-semibold">More features shipping every week</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}