'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

interface LaunchTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
}

const initialTasks: LaunchTask[] = [
  {
    id: '1',
    title: 'Create Product Hunt assets',
    description: 'Logo, screenshots, GIFs, and gallery images',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-01-25',
    category: 'Assets'
  },
  {
    id: '2',
    title: 'Write launch copy',
    description: 'Tagline, description, and maker comment',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-01-24',
    category: 'Content'
  },
  {
    id: '3',
    title: 'Build hunter list',
    description: 'Reach out to top hunters for support',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-01-26',
    category: 'Outreach'
  },
  {
    id: '4',
    title: 'Prepare social media posts',
    description: 'Twitter, LinkedIn, and other platform content',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-01-27',
    category: 'Social'
  },
  {
    id: '5',
    title: 'Email subscriber list',
    description: 'Notify existing users about the launch',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-01-28',
    category: 'Email'
  }
];

export default function LaunchPage() {
  const [tasks, setTasks] = useState<LaunchTask[]>(initialTasks);
  const [showNewTask, setShowNewTask] = useState(false);
  const [launchDate, setLaunchDate] = useState('2024-01-30');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
    category: 'General'
  });

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 
                         task.status === 'pending' ? 'in-progress' : 'completed';
        return { ...task, status: newStatus };
      }
      return task;
    }));
    toast.success('Task updated!');
  };

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error('Please fill in title and due date');
      return;
    }

    const task: LaunchTask = {
      id: Date.now().toString(),
      ...newTask,
      status: 'pending'
    };

    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: 'General' });
    setShowNewTask(false);
    toast.success('Task added!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-4">
          <Rocket className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium">Launch Planner</span>
        </div>
        <h1 className="text-3xl font-bold font-sora mb-2">
          Product Hunt <span className="text-gradient">Launch Plan</span>
        </h1>
        <p className="text-muted-foreground">
          Plan and execute your perfect Product Hunt launch
        </p>
      </motion.div>

      {/* Launch Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glassmorphism rounded-xl p-6 text-center">
          <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold mb-1">{launchDate}</div>
          <div className="text-sm text-muted-foreground">Launch Date</div>
        </div>
        
        <div className="glassmorphism rounded-xl p-6 text-center">
          <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold mb-1">{Math.round(progress)}%</div>
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
        
        <div className="glassmorphism rounded-xl p-6 text-center">
          <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold mb-1">{completedTasks}/{totalTasks}</div>
          <div className="text-sm text-muted-foreground">Tasks Complete</div>
        </div>
      </motion.div>

      {/* Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-sora">Launch Tasks</h2>
              <Button
                onClick={() => setShowNewTask(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status);
                const statusColor = getStatusColor(task.status);
                
                return (
                  <div key={task.id} className="glassmorphism-dark rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`p-1 rounded-full hover:bg-white/10 transition-colors ${statusColor}`}
                        >
                          <StatusIcon className="h-5 w-5" />
                        </button>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                          {task.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
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
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {showNewTask ? (
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-lg font-bold font-sora mb-4">Add New Task</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="taskTitle">Task Title</Label>
                  <Input
                    id="taskTitle"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Create demo video"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea
                    id="taskDescription"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Task details..."
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger className="glassmorphism-dark border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="glassmorphism-dark border-white/20"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newTask.category}
                    onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Content, Assets, Outreach"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button onClick={addTask} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Add Task
                  </Button>
                  <Button onClick={() => setShowNewTask(false)} variant="outline" className="glassmorphism">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Launch Tips */}
              <div className="glassmorphism rounded-xl p-6">
                <h3 className="text-lg font-bold font-sora mb-4 text-purple-400">🚀 Launch Tips</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Launch on Tuesday-Thursday for maximum visibility</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Submit your product at 12:01 AM PST</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Engage with comments throughout the day</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Share on social media and with your network</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glassmorphism rounded-xl p-6">
                <h3 className="text-lg font-bold font-sora mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">High Priority</span>
                    <span className="text-sm font-semibold text-red-400">
                      {tasks.filter(t => t.priority === 'high').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">In Progress</span>
                    <span className="text-sm font-semibold text-yellow-400">
                      {tasks.filter(t => t.status === 'in-progress').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overdue</span>
                    <span className="text-sm font-semibold text-red-400">
                      {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length}
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