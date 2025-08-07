"use client";

import { FileText, AlertTriangle, Shield, Users } from 'lucide-react';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';
import { motion } from 'framer-motion';

export default function TermsPage() {
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
              <FileText className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Terms of Service</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Please read these terms carefully before using LaunchPilot.
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
              <h2 className="text-2xl font-bold font-sora mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>By accessing and using LaunchPilot ("Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">2. Service Description</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>LaunchPilot is an AI-powered marketing platform that provides:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>AI content generation for marketing materials</li>
                  <li>Social media management tools</li>
                  <li>Email marketing automation</li>
                  <li>Analytics and performance tracking</li>
                  <li>Product launch assistance</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">3. User Obligations</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>You agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information when creating your account</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use the Service in compliance with all applicable laws and regulations</li>
                  <li>Not use the Service for any unlawful or prohibited activities</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Not distribute malware or engage in any harmful activities</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">4. Usage Limits</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>Your use of the Service is subject to the following limitations:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Monthly credit limits based on your subscription plan</li>
                  <li>API rate limits to ensure fair usage</li>
                  <li>Storage limits for generated content</li>
                  <li>Reasonable use policies for AI generation features</li>
                </ul>
                <p>Excessive use may result in temporary suspension or additional charges.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sora mb-4">5. Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>You retain ownership of content you create using our Service. LaunchPilot retains ownership of the platform, software, and underlying technology.</p>
                <p>You grant us a limited license to use your content solely for the purpose of providing the Service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sora mb-4">6. Payment Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Subscription fees are billed in advance on a monthly or annual basis. All payments are processed securely through Stripe.</p>
                <p>Refunds are available within 7 days of initial subscription. No refunds for partial months.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sora mb-4">7. Limitation of Liability</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>LaunchPilot shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
                <p>Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sora mb-4">8. Termination</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Either party may terminate this agreement at any time. Upon termination:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your access to the Service will be suspended</li>
                  <li>Your data will be retained for 30 days for recovery purposes</li>
                  <li>After 30 days, your data will be permanently deleted</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sora mb-4">9. Changes to Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sora mb-4">10. Contact Information</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>For questions about these Terms of Service, please contact us:</p>
                <div className="glassmorphism-dark rounded-lg p-4">
                  <p><strong>Email:</strong> legal@launchpilot.ai</p>
                  <p><strong>Support:</strong> hello@launchpilot.ai</p>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}