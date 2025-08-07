'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/store/dashboard-store';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeIcons = {
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
  error: AlertCircle,
};

const typeColors = {
  success: 'text-green-400',
  info: 'text-blue-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

const typeBgColors = {
  success: 'bg-green-500/20',
  info: 'bg-blue-500/20',
  warning: 'bg-yellow-500/20',
  error: 'bg-red-500/20',
};

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markNotificationRead } = useDashboardStore();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch or use notifications from store
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationRead(notificationId);
    setLocalNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    localNotifications.forEach(notification => {
      if (!notification.read) {
        markNotificationRead(notification.id);
      }
    });
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = localNotifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed right-4 top-20 bottom-4 w-80 glassmorphism-dark rounded-xl border border-white/10 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {localNotifications.length > 0 ? (
              localNotifications.map((notification, index) => {
                const Icon = typeIcons[notification.type];
                const color = typeColors[notification.type];
                const bgColor = typeBgColors[notification.type];
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.05 }}
                    className={`glassmorphism-dark rounded-lg p-3 hover:bg-white/5 transition-colors cursor-pointer ${
                      !notification.read ? 'border-l-4 border-purple-500' : ''
                    }`}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-lg ${bgColor} flex-shrink-0`}>
                        <Icon className={`h-3 w-3 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium mb-1 ${!notification.read ? 'text-white' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                          )}
                        </div>
                        {notification.action && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = notification.action!.href;
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <div className="text-sm text-muted-foreground">No notifications yet</div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {localNotifications.length > 0 && (
          <div className="p-4 border-t border-white/10">
            <Button
              variant="outline"
              className="w-full glassmorphism text-sm"
              onClick={() => {
                // Navigate to full notifications page
                window.location.href = '/dashboard/notifications';
              }}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </motion.div>
    </>
  );
}
