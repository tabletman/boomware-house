'use client';

/**
 * Social Proof Notifications
 * Real-time activity notifications to build trust
 */

import { useEffect, useState } from 'react';
import { X, ShoppingCart, Eye, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'purchase' | 'view' | 'location';
  message: string;
  timestamp: Date;
}

const mockNotifications: Omit<Notification, 'id' | 'timestamp'>[] = [
  { type: 'purchase', message: 'Someone from Cleveland just purchased a Dell Laptop' },
  { type: 'view', message: '3 people are viewing this item right now' },
  { type: 'purchase', message: 'John from Warrensville Heights bought an Apple iMac' },
  { type: 'view', message: '12 people viewed this product in the last hour' },
  { type: 'location', message: 'Popular in your area - 5 sold this week' },
];

export function SocialProofNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Show first notification after 3 seconds
    const timer1 = setTimeout(() => {
      showRandomNotification();
    }, 3000);

    // Show subsequent notifications every 15-25 seconds
    const timer2 = setInterval(() => {
      showRandomNotification();
    }, 15000 + Math.random() * 10000);

    return () => {
      clearTimeout(timer1);
      clearInterval(timer2);
    };
  }, [dismissed]);

  const showRandomNotification = () => {
    const randomNotif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
    const newNotification: Notification = {
      ...randomNotif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setNotifications(prev => {
      // Keep only last 3 notifications
      const updated = [newNotification, ...prev].slice(0, 3);
      return updated;
    });

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      dismissNotification(newNotification.id);
    }, 8000);
  };

  const dismissNotification = (id: string) => {
    setDismissed(prev => new Set(prev).add(id));
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="h-4 w-4" />;
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'location':
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 space-y-2 max-w-sm">
      {notifications
        .filter(n => !dismissed.has(n.id))
        .map((notification, index) => (
          <div
            key={notification.id}
            className={cn(
              'bg-white border shadow-lg rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-left',
              'transition-all duration-300'
            )}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getTimeAgo(notification.timestamp)}
              </p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 300) return 'A few minutes ago';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  return `${Math.floor(seconds / 3600)} hours ago`;
}
