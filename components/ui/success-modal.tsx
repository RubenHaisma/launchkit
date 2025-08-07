'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Copy, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  content?: string;
  type?: 'tweet' | 'email' | 'blog' | 'launch';
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  content, 
  type = 'tweet' 
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getEmoji = () => {
    switch (type) {
      case 'tweet': return '🐦';
      case 'email': return '📧';
      case 'blog': return '📝';
      case 'launch': return '🚀';
      default: return '🔥';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative glassmorphism rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
              className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <h3 className="text-2xl font-bold font-sora mb-2">
                {title} {getEmoji()}
              </h3>
              <p className="text-muted-foreground">{message}</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 glassmorphism-dark"
                disabled={!content}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 glassmorphism-dark"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </motion.div>

            {/* Celebration Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute -top-4 -left-4 text-4xl"
            >
              🎉
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-2 -right-2 text-3xl"
            >
              ✨
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-2 -left-2 text-2xl"
            >
              🔥
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}