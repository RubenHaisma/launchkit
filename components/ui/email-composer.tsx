'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Eye, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { sendEmail, saveEmailLog, type EmailData } from '@/lib/utils/email';
import toast from 'react-hot-toast';

interface EmailComposerProps {
  initialSubject?: string;
  initialContent?: string;
  recipientEmail?: string;
  onSent?: (success: boolean) => void;
}

export function EmailComposer({ 
  initialSubject = '', 
  initialContent = '', 
  recipientEmail = '',
  onSent 
}: EmailComposerProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [recipient, setRecipient] = useState(recipientEmail);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastSendResult, setLastSendResult] = useState<'success' | 'error' | null>(null);

  const handleSendEmail = async () => {
    if (!recipient || !subject || !content) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSending(true);
    setLastSendResult(null);

    try {
      const emailData: EmailData = {
        to: recipient,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">LaunchPilot</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              ${content.split('\n').map(line => `<p style="margin: 10px 0;">${line}</p>`).join('')}
            </div>
            <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>Sent via LaunchPilot - Your AI Marketing Co-founder</p>
            </div>
          </div>
        `,
        type: 'campaign',
      };

      const result = await sendEmail(emailData);
      saveEmailLog(result);

      if (result.status === 'sent') {
        setLastSendResult('success');
        toast.success('✅ Email sent successfully!');
        onSent?.(true);
      } else {
        setLastSendResult('error');
        toast.error(`❌ Failed to send email: ${result.error}`);
        onSent?.(false);
      }
    } catch (error) {
      setLastSendResult('error');
      toast.error('❌ Failed to send email');
      onSent?.(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!subject || !content) {
      toast.error('Please add subject and content first');
      return;
    }

    setIsSending(true);

    try {
      const emailData: EmailData = {
        to: 'test@example.com', // You can change this to your test email
        subject: `[TEST] ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #ff6b6b; padding: 10px; text-align: center; color: white;">
              <strong>🧪 TEST EMAIL - NOT SENT TO ACTUAL RECIPIENT</strong>
            </div>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">LaunchPilot</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              ${content.split('\n').map(line => `<p style="margin: 10px 0;">${line}</p>`).join('')}
            </div>
            <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>Sent via LaunchPilot - Your AI Marketing Co-founder</p>
            </div>
          </div>
        `,
        type: 'test',
      };

      const result = await sendEmail(emailData);
      saveEmailLog(result);

      if (result.status === 'sent') {
        toast.success('🧪 Test email sent!');
      } else {
        toast.error(`❌ Test email failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('❌ Failed to send test email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="recipient">Recipient Email</Label>
          <Input
            id="recipient"
            type="email"
            placeholder="recipient@example.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="glassmorphism-dark border-white/20"
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            placeholder="Your compelling subject line"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="glassmorphism-dark border-white/20"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="content">Email Content</Label>
        <Textarea
          id="content"
          placeholder="Write your email content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="glassmorphism-dark border-white/20 min-h-[200px]"
        />
      </div>

      <div className="flex items-center justify-between">
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
                <DialogTitle>Email Preview</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="glassmorphism-dark rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">Subject:</div>
                  <div className="font-semibold">{subject || 'No subject'}</div>
                </div>
                <div className="glassmorphism-dark rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">Content:</div>
                  <div className="whitespace-pre-wrap">{content || 'No content'}</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={handleSendTestEmail}
            disabled={isSending || !subject || !content}
            className="glassmorphism"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Test
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          {lastSendResult && (
            <div className="flex items-center space-x-2">
              {lastSendResult === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
            </div>
          )}
          
          <Button
            onClick={handleSendEmail}
            disabled={isSending || !recipient || !subject || !content}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </div>
      </div>
    </div>
  );
}