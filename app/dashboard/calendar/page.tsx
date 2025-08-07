'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock,
  Twitter,
  Mail,
  FileText,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

interface ScheduledItem {
  id: string;
  title: string;
  content: string;
  type: 'tweet' | 'email' | 'blog' | 'launch';
  scheduledFor: string;
  status: 'scheduled' | 'published' | 'draft';
}

const typeIcons = {
  tweet: Twitter,
  email: Mail,
  blog: FileText,
  launch: Rocket,
};

const typeColors = {
  tweet: 'from-blue-500 to-cyan-500',
  email: 'from-pink-500 to-rose-500',
  blog: 'from-green-500 to-emerald-500',
  launch: 'from-purple-500 to-pink-500',
};

const mockScheduledItems: ScheduledItem[] = [
  {
    id: '1',
    title: 'Product Launch Tweet',
    content: '🚀 Excited to announce LaunchPilot is now live! The AI marketing co-founder you\'ve been waiting for...',
    type: 'tweet',
    scheduledFor: '2024-01-25T10:00:00',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Weekly Newsletter',
    content: 'This week in AI marketing: New features, success stories, and tips...',
    type: 'email',
    scheduledFor: '2024-01-26T09:00:00',
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'Blog Post: AI Marketing Guide',
    content: 'The complete guide to AI-powered marketing for SaaS founders...',
    type: 'blog',
    scheduledFor: '2024-01-27T14:00:00',
    status: 'draft'
  }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>(mockScheduledItems);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    content: '',
    type: 'tweet' as const,
    scheduledFor: '',
    time: '09:00'
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getItemsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return scheduledItems.filter(item => item.scheduledFor.startsWith(dateStr));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.scheduledFor || !newEvent.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const event: ScheduledItem = {
      id: Date.now().toString(),
      title: newEvent.title,
      content: newEvent.content,
      type: newEvent.type,
      scheduledFor: `${newEvent.scheduledFor}T${newEvent.time}:00`,
      status: 'scheduled'
    };

    setScheduledItems(prev => [...prev, event]);
    setNewEvent({ title: '', content: '', type: 'tweet', scheduledFor: '', time: '09:00' });
    setShowNewEvent(false);
    toast.success('Event scheduled!');
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">
            Content <span className="text-gradient">Calendar</span>
          </h1>
          <p className="text-muted-foreground">
            Schedule and manage your content across all platforms
          </p>
        </div>
        
        <Button
          onClick={() => setShowNewEvent(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Content
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="glassmorphism rounded-xl p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-sora">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="glassmorphism"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="glassmorphism"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-3 h-24" />;
                }
                
                const items = getItemsForDate(day);
                const isToday = new Date().getDate() === day && 
                               new Date().getMonth() === currentDate.getMonth() && 
                               new Date().getFullYear() === currentDate.getFullYear();
                
                return (
                  <div
                    key={day}
                    className={`p-2 h-24 border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer ${
                      isToday ? 'bg-purple-500/20 border-purple-500/50' : ''
                    }`}
                    onClick={() => setSelectedDate(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-purple-400' : ''}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {items.slice(0, 2).map(item => {
                        const Icon = typeIcons[item.type];
                        return (
                          <div
                            key={item.id}
                            className={`text-xs p-1 rounded bg-gradient-to-r ${typeColors[item.type]} text-white truncate flex items-center space-x-1`}
                          >
                            <Icon className="h-2 w-2" />
                            <span>{item.title}</span>
                          </div>
                        );
                      })}
                      {items.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{items.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {showNewEvent ? (
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-lg font-bold font-sora mb-4">Schedule Content</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventTitle">Title</Label>
                  <Input
                    id="eventTitle"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Product Launch Tweet"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                
                <div>
                  <Label>Content Type</Label>
                  <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tweet">Tweet</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="launch">Launch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="eventContent">Content</Label>
                  <Textarea
                    id="eventContent"
                    value={newEvent.content}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Content preview..."
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="eventDate">Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={newEvent.scheduledFor}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, scheduledFor: e.target.value }))}
                      className="glassmorphism-dark border-white/20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="eventTime">Time</Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      className="glassmorphism-dark border-white/20"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button onClick={addEvent} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Schedule
                  </Button>
                  <Button onClick={() => setShowNewEvent(false)} variant="outline" className="glassmorphism">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Upcoming Events */}
              <div className="glassmorphism rounded-xl p-6">
                <h3 className="text-lg font-bold font-sora mb-4">Upcoming</h3>
                <div className="space-y-3">
                  {scheduledItems
                    .filter(item => new Date(item.scheduledFor) > new Date())
                    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
                    .slice(0, 5)
                    .map(item => {
                      const Icon = typeIcons[item.type];
                      return (
                        <div key={item.id} className="glassmorphism-dark rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`p-1 rounded bg-gradient-to-r ${typeColors[item.type]}`}>
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-semibold">{item.title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(item.scheduledFor).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glassmorphism rounded-xl p-6">
                <h3 className="text-lg font-bold font-sora mb-4">This Month</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Scheduled</span>
                    <span className="text-sm font-semibold text-blue-400">
                      {scheduledItems.filter(i => i.status === 'scheduled').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Published</span>
                    <span className="text-sm font-semibold text-green-400">
                      {scheduledItems.filter(i => i.status === 'published').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Drafts</span>
                    <span className="text-sm font-semibold text-yellow-400">
                      {scheduledItems.filter(i => i.status === 'draft').length}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}