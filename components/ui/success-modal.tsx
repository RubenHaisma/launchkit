'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Copy, Download, Share2, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  content: string;
  type: 'twitter' | 'blog' | 'email' | 'reddit' | 'launch';
}

export function SuccessModal({ isOpen, onClose, title, message, content, type }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(content.substring(0, 200) + '...');
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative glassmorphism rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-white/20 max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold font-sora mb-2">{title}</h2>
              <p className="text-muted-foreground">{message}</p>
            </div>

            <div className="glassmorphism-dark rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-purple-400">Generated Content</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="glassmorphism text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glassmorphism text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-muted-foreground">
                  {content}
                </pre>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 glassmorphism"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-4 w-4 mr-2" />
                Share on LinkedIn
              </Button>
              
              <Button
                variant="outline"
                className="glassmorphism"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 p-4 glassmorphism-dark rounded-lg">
              <div className="text-sm font-semibold mb-2 text-purple-400">💡 Next Steps</div>
              <div className="text-sm text-muted-foreground space-y-1">
                {type === 'twitter' && (
                  <>
                    <div>• Schedule this thread for optimal engagement times</div>
                    <div>• Create follow-up content to maintain momentum</div>
                    <div>• Engage with replies to boost visibility</div>
                  </>
                )}
                {type === 'email' && (
                  <>
                    <div>• Set up your email sequence in the outreach dashboard</div>
                    <div>• Import your lead list for personalization</div>
                    <div>• Track open rates and optimize subject lines</div>
                  </>
                )}
                {type === 'blog' && (
                  <>
                    <div>• Optimize for SEO with relevant keywords</div>
                    <div>• Add internal links to boost page authority</div>
                    <div>• Share across social media channels</div>
                  </>
                )}
                {(type === 'reddit' || type === 'launch') && (
                  <>
                    <div>• Review community guidelines before posting</div>
                    <div>• Engage authentically with comments</div>
                    <div>• Follow up with interested users via DM</div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}