'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Mail } from 'lucide-react';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

export const metadata = {
  title: 'Security - LaunchPilot',
  description: 'Learn how LaunchPilot keeps your data secure and protected.',
};

export default function SecurityPage() {
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
              <span className="text-sm font-medium">Security</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Your Data is <span className="text-gradient">Secure</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We implement industry-leading security measures to protect your data and ensure your privacy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <section className="glassmorphism rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">Data Encryption</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>All data transmitted to and from LaunchPilot is encrypted using industry-standard protocols:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>TLS 1.3:</strong> All data in transit is encrypted using the latest TLS protocol</li>
                  <li><strong>AES-256:</strong> Data at rest is encrypted using AES-256 encryption</li>
                  <li><strong>End-to-End:</strong> Your content is encrypted from your browser to our servers</li>
                  <li><strong>Database Encryption:</strong> All database connections use encrypted channels</li>
                </ul>
              </div>
            </section>

            <section className="glassmorphism rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">Stripe PCI Compliance</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>Payment processing is handled by Stripe, a PCI DSS Level 1 certified payment processor:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We never store your credit card information on our servers</li>
                  <li>All payment data is processed through Stripe's secure infrastructure</li>
                  <li>Stripe maintains the highest level of PCI compliance</li>
                  <li>Your financial information is protected by bank-level security</li>
                </ul>
              </div>
            </section>

            <section className="glassmorphism rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <Key className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">Account Security</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We provide multiple layers of account protection:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Password Hashing:</strong> Passwords are hashed using bcrypt with salt</li>
                  <li><strong>Session Management:</strong> Secure session handling with automatic expiration</li>
                  <li><strong>API Keys:</strong> Secure API key generation and management</li>
                  <li><strong>Access Logs:</strong> All account access is logged and monitored</li>
                </ul>
                <div className="glassmorphism-dark rounded-lg p-4 mt-4">
                  <p className="text-sm"><strong>Recommendation:</strong> Use a strong, unique password and consider enabling two-factor authentication when available.</p>
                </div>
              </div>
            </section>

            <section className="glassmorphism rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">Security Monitoring</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We continuously monitor our systems for security threats:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>24/7 automated security monitoring and alerting</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Intrusion detection and prevention systems</li>
                  <li>Automated backup and disaster recovery procedures</li>
                </ul>
              </div>
            </section>

            <section className="glassmorphism rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-sora">Report Security Issues</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>If you discover a security vulnerability, please report it responsibly:</p>
                <div className="glassmorphism-dark rounded-lg p-4">
                  <p><strong>Security Email:</strong> security@launchpilot.ai</p>
                  <p><strong>Response Time:</strong> We aim to respond within 24 hours</p>
                  <p><strong>Disclosure:</strong> We follow responsible disclosure practices</p>
                </div>
                <p className="text-sm">Please do not publicly disclose security issues until we have had a chance to address them.</p>
              </div>
            </section>

            <section className="glassmorphism rounded-xl p-8">
              <h2 className="text-2xl font-bold font-sora mb-6">Compliance & Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glassmorphism-dark rounded-lg p-4">
                  <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                  <p className="text-sm text-muted-foreground">Full compliance with European data protection regulations</p>
                </div>
                <div className="glassmorphism-dark rounded-lg p-4">
                  <h3 className="font-semibold mb-2">SOC 2 Type II</h3>
                  <p className="text-sm text-muted-foreground">Currently pursuing SOC 2 Type II certification</p>
                </div>
                <div className="glassmorphism-dark rounded-lg p-4">
                  <h3 className="font-semibold mb-2">ISO 27001</h3>
                  <p className="text-sm text-muted-foreground">Information security management standards</p>
                </div>
                <div className="glassmorphism-dark rounded-lg p-4">
                  <h3 className="font-semibold mb-2">CCPA Compliant</h3>
                  <p className="text-sm text-muted-foreground">California Consumer Privacy Act compliance</p>
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