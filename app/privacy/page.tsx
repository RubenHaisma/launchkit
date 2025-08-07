'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Mail } from 'lucide-react';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

export const metadata = {
  title: 'Privacy Policy - LaunchPilot',
  description: 'Learn how LaunchPilot protects your privacy and handles your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Privacy Policy</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Your <span className="text-gradient">Privacy Matters</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're committed to protecting your privacy and being transparent about how we collect, use, and share your information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 2024
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glassmorphism rounded-xl p-8 space-y-8"
          >
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">Data Collection</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Create an account or update your profile</li>
                  <li>Use our AI content generation services</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                  <li>Contact us for support or feedback</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p>This may include your name, email address, company information, and content you generate using our platform.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">Data Usage</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent transactions</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">Your Rights (GDPR)</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>If you are located in the European Union, you have the following rights:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                  <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                  <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                </ul>
                <p>To exercise these rights, please contact us using the information below.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">Contact Information</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="glassmorphism-dark rounded-lg p-4">
                  <p><strong>Email:</strong> privacy@launchpilot.ai</p>
                  <p><strong>Data Protection Officer:</strong> dpo@launchpilot.ai</p>
                  <p><strong>Address:</strong> LaunchPilot, Inc.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sora mb-4">Data Security</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sora mb-4">Changes to This Policy</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
              </div>
            </section>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}