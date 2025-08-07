import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'twitter' | 'blog';
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  content: string;
  subject?: string;
  scheduledFor?: string;
  metrics?: {
    sent?: number;
    opened?: number;
    clicked?: number;
    impressions?: number;
    likes?: number;
    retweets?: number;
  };
  createdAt: string;
}

export interface GeneratedContent {
  id: string;
  type: 'tweet' | 'email' | 'blog' | 'launch';
  content: string;
  prompt: string;
  tone: string;
  audience: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  industry: string;
  apiKey?: string;
  twitterHandle?: string;
}

interface DashboardState {
  // User Profile
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;

  // Generated Content
  generatedContent: GeneratedContent[];
  addGeneratedContent: (content: Omit<GeneratedContent, 'id' | 'createdAt'>) => void;
  removeGeneratedContent: (id: string) => void;

  // Campaigns
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  removeCampaign: (id: string) => void;
  clearCampaigns: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // UI State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: {
        name: 'Demo User',
        email: 'demo@launchpilot.ai',
        company: 'LaunchPilot Demo',
        industry: 'productivity',
      },

      generatedContent: [],
      campaigns: [
        {
          id: '1',
          name: 'SaaS Founder Outreach',
          type: 'email',
          status: 'active',
          content: 'Hi {{firstName}}, I noticed you\'re working on {{company}}...',
          subject: 'Quick question about {{company}}',
          metrics: { sent: 89, opened: 34, clicked: 8 },
          createdAt: '2024-01-15T09:00:00Z',
        },
        {
          id: '2',
          name: 'Product Launch Thread',
          type: 'twitter',
          status: 'scheduled',
          content: '🚀 Just launched TaskFlow AI! Here\'s what makes it special...',
          scheduledFor: '2024-01-22T10:00:00Z',
          metrics: { impressions: 0, likes: 0, retweets: 0 },
          createdAt: '2024-01-20T14:30:00Z',
        },
      ],

      notifications: [
        {
          id: '1',
          type: 'success',
          title: 'Campaign Launched',
          message: 'Your Twitter thread is live and performing well',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: '2',
          type: 'info',
          title: 'Performance Update',
          message: 'Your email campaign has 38% open rate (+5% vs average)',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: false,
        },
      ],

      sidebarCollapsed: false,
      currentPage: 'Home',

      // Actions
      setProfile: (profileUpdates) =>
        set((state) => ({
          profile: { ...state.profile, ...profileUpdates },
        })),

      addGeneratedContent: (content) =>
        set((state) => ({
          generatedContent: [
            {
              ...content,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
            ...state.generatedContent,
          ],
        })),

      removeGeneratedContent: (id) =>
        set((state) => ({
          generatedContent: state.generatedContent.filter((c) => c.id !== id),
        })),

      addCampaign: (campaign) =>
        set((state) => ({
          campaigns: [
            {
              ...campaign,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
            ...state.campaigns,
          ],
        })),

      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      removeCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        })),

      clearCampaigns: () =>
        set({ campaigns: [] }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearNotifications: () =>
        set({ notifications: [] }),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      setCurrentPage: (page) =>
        set({ currentPage: page }),
    }),
    {
      name: 'launchpilot-dashboard',
      partialize: (state) => ({
        profile: state.profile,
        generatedContent: state.generatedContent,
        campaigns: state.campaigns,
        notifications: state.notifications,
      }),
    }
  )
);