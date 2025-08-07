'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Copy, Twitter, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { copyToClipboard } from '@/lib/utils/twitter';
import toast from 'react-hot-toast';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  content: string;
  type: 'tweet' | 'email' | 'blog' | 'launch';
}

export function SuccessModal({ isOpen, onClose, title, message, content, type }: SuccessModalProps) {
  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success('📋 Copied to clipboard!');
    } else {
      toast.error('❌ Failed to copy to clipboard');
    }
  };

  const handleTwitterPost = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
    window.open(twitterUrl, '_blank');
    toast.success('🐦 Opened Twitter with your content!');
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'tweet':
        return Twitter;
      case 'email':
        return Mail;
      default:
        return CheckCircle;
    }
  };

  const Icon = getIcon();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glassmorphism-dark">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-green-500/20">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-sora">{title}</h3>
              <p className="text-muted-foreground">{message}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="glassmorphism-dark rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Icon className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Generated Content</span>
          </div>
          <div className="text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
            {content}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Button variant="outline" onClick={handleCopy} className="glassmorphism">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          
          {type === 'tweet' && (
            <Button onClick={handleTwitterPost} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Twitter className="h-4 w-4 mr-2" />
              Post to X
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
          
          <Button onClick={onClose} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}