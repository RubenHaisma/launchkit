'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Trash2,
  Eye,
  Edit,
  Twitter,
  Mail,
  FileText,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import toast from 'react-hot-toast';

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

export default function HistoryPage() {
  const { generatedContent, removeGeneratedContent } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredContent = generatedContent
    .filter(content => {
      const matchesSearch = content.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           content.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || content.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(filteredContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'launchpilot-content-history.json';
    link.click();
    toast.success('Content exported!');
  };

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
            Content <span className="text-gradient">History</span>
          </h1>
          <p className="text-muted-foreground">
            View and manage all your generated content
          </p>
        </div>
        
        <Button onClick={exportContent} variant="outline" className="glassmorphism">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glassmorphism rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glassmorphism-dark border-white/20"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="glassmorphism-dark border-white/20 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tweet">Tweets</SelectItem>
              <SelectItem value="email">Emails</SelectItem>
              <SelectItem value="blog">Blog Posts</SelectItem>
              <SelectItem value="launch">Launch Copy</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="glassmorphism-dark border-white/20 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {Object.entries(typeIcons).map(([type, Icon]) => {
          const count = generatedContent.filter(c => c.type === type).length;
          return (
            <div key={type} className="glassmorphism rounded-xl p-4 text-center">
              <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${typeColors[type as keyof typeof typeColors]} flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-muted-foreground capitalize">{type}s</div>
            </div>
          );
        })}
      </motion.div>

      {/* Content List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredContent.length > 0 ? (
          filteredContent.map((content, index) => {
            const Icon = typeIcons[content.type as keyof typeof typeIcons];
            const colorClass = typeColors[content.type as keyof typeof typeColors];
            
            return (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glassmorphism rounded-xl p-6 hover-lift"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold capitalize">{content.type}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                          {content.tone}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                          {content.audience}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(content.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(content.content)}
                      className="p-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeGeneratedContent(content.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Prompt:</div>
                  <div className="text-sm bg-white/5 rounded-lg p-3">{content.prompt}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Generated Content:</div>
                  <div className="text-sm bg-white/5 rounded-lg p-3 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {content.content}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start generating content to see your history here'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}