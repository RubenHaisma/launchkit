'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Copy, Eye, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { openTwitterIntent, copyToClipboard, parseThreadContent, markTweetAsPosted } from '@/lib/utils/twitter';
import toast from 'react-hot-toast';

interface TwitterPosterProps {
  content: string;
  onPosted?: (posted: boolean) => void;
}

export function TwitterPoster({ content, onPosted }: TwitterPosterProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  
  const twitterContent = parseThreadContent(content);
  const { text, isThread, threadParts } = twitterContent;

  const handlePostToTwitter = () => {
    setIsPreviewOpen(false);
    openTwitterIntent(twitterContent);
    
    if (isThread && threadParts && threadParts.length > 1) {
      toast.success(`🐦 Opened Twitter with first tweet! Remaining ${threadParts.length - 1} tweets copied to clipboard.`);
    } else {
      toast.success('🐦 Opened Twitter with your tweet!');
    }
  };

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success('📋 Copied to clipboard!');
    } else {
      toast.error('❌ Failed to copy to clipboard');
    }
  };

  const handleMarkAsPosted = (checked: boolean) => {
    setIsPosted(checked);
    if (checked) {
      markTweetAsPosted(Date.now().toString(), content, isThread);
      toast.success('✅ Marked as posted!');
      onPosted?.(true);
    } else {
      onPosted?.(false);
    }
  };

  const previewContent = isThread && threadParts ? threadParts : [text];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isThread && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
              Thread ({threadParts?.length || 1} tweets)
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {text.length} characters
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="posted"
            checked={isPosted}
            onCheckedChange={handleMarkAsPosted}
          />
          <label htmlFor="posted" className="text-sm text-muted-foreground cursor-pointer">
            Mark as posted
          </label>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="glassmorphism">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl glassmorphism-dark">
            <DialogHeader>
              <DialogTitle>
                Twitter {isThread ? 'Thread' : 'Tweet'} Preview
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {previewContent.map((tweet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glassmorphism-dark rounded-lg p-4 border-l-4 border-blue-500"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-400 font-medium">
                      {isThread ? `Tweet ${index + 1}/${previewContent.length}` : 'Tweet'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tweet.length} chars
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{tweet}</div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
              <Button variant="outline" onClick={handleCopyToClipboard} className="glassmorphism">
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
              <Button onClick={handlePostToTwitter} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Twitter className="h-4 w-4 mr-2" />
                Post to X
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          onClick={handleCopyToClipboard}
          className="glassmorphism"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>

        <Button
          onClick={handlePostToTwitter}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Post to X
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {isPosted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-green-400 text-sm"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Marked as posted</span>
        </motion.div>
      )}
    </div>
  );
}