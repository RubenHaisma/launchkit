'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    }));
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    }));
    setShowBanner(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="glassmorphism-dark border border-white/20 rounded-xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                    <Cookie className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">We use cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      We use cookies to enhance your experience, analyze site traffic, and personalize content.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeBanner}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {!showPreferences ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={acceptAll}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={acceptNecessary}
                    variant="outline"
                    className="glassmorphism"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    onClick={() => setShowPreferences(true)}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Preferences
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glassmorphism rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Necessary</h4>
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Required for the website to function properly.
                      </p>
                    </div>
                    <div className="glassmorphism rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Analytics</h4>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Help us understand how visitors use our site.
                      </p>
                    </div>
                    <div className="glassmorphism rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Marketing</h4>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Used to personalize ads and content.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={acceptAll}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Save Preferences
                    </Button>
                    <Button
                      onClick={() => setShowPreferences(false)}
                      variant="outline"
                      className="glassmorphism"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-4">
                By continuing to use our site, you agree to our{' '}
                <a href="/privacy" className="text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms" className="text-purple-400 hover:text-purple-300">
                  Terms of Service
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}