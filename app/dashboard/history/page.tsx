'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Copy, 
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
import toast from 'react-hot-toast';

type HistoryType = 'tweet' | 'email' | 'blog' | 'launch'

interface HistoryItem {
  id: string
  source: 'generation' | 'tweet' | 'outreach' | 'post'
  type: HistoryType
  content: string
  prompt?: string | null
  tone?: string | null
  audience?: string | null
  subject?: string | null
  title?: string | null
  url?: string | null
  published?: boolean | null
  createdAt: string
}

const typeIcons: Record<HistoryType, any> = {
  tweet: Twitter,
  email: Mail,
  blog: FileText,
  launch: Rocket,
}

const typeColors: Record<HistoryType, string> = {
  tweet: 'from-blue-500 to-cyan-500',
  email: 'from-pink-500 to-rose-500',
  blog: 'from-green-500 to-emerald-500',
  launch: 'from-purple-500 to-pink-500',
}

const typeLabels: Record<HistoryType, string> = {
  tweet: 'tweets',
  email: 'emails',
  blog: 'blogs',
  launch: 'launches',
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [items, setItems] = useState<HistoryItem[]>([])
  const [counts, setCounts] = useState<Record<HistoryType, number>>({ tweet: 0, email: 0, blog: 0, launch: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/history')
        const data = await res.json()
        if (res.ok && data.success) {
          setItems(data.items || [])
          setCounts(data.counts || { tweet: 0, email: 0, blog: 0, launch: 0 })
        } else {
          toast.error(data.error || 'Failed to load history')
        }
      } catch (e) {
        toast.error('Failed to load history')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredContent = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const list = items.filter((content) => {
      const hay = `${content.content} ${content.prompt || ''} ${content.subject || ''} ${content.title || ''}`.toLowerCase()
      const matchesSearch = term.length === 0 || hay.includes(term)
      const matchesType = filterType === 'all' || content.type === (filterType as HistoryType)
      return matchesSearch && matchesType
    })
    return list.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
  }, [items, searchTerm, filterType, sortBy])

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
        {(Object.keys(typeIcons) as HistoryType[]).map((type) => {
          const Icon = typeIcons[type]
          return (
            <div key={type} className="glassmorphism rounded-xl p-4 text-center">
              <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${typeColors[type]} flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold">{counts[type] || 0}</div>
              <div className="text-sm text-muted-foreground capitalize">{typeLabels[type]}</div>
            </div>
          )
        })}
      </motion.div>

      {/* Content List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filteredContent.length > 0 ? (
          filteredContent.map((content, index) => {
            const Icon = typeIcons[content.type]
            const colorClass = typeColors[content.type]
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
                        {content.tone && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                            {content.tone}
                          </span>
                        )}
                        {content.audience && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                            {content.audience}
                          </span>
                        )}
                        {content.published !== null && content.published !== undefined && (
                          <span className={`text-xs px-2 py-1 rounded-full ${content.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-300'}`}>
                            {content.published ? 'Published' : 'Draft'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(content.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(content.content)} className="p-2">
                      <Copy className="h-4 w-4" />
                    </Button>
                    {content.url && (
                      <Button size="sm" variant="ghost" onClick={() => window.open(content.url as string, '_blank')} className="p-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Meta fields */}
                {content.subject && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Subject:</div>
                    <div className="text-sm bg-white/5 rounded-lg p-3">{content.subject}</div>
                  </div>
                )}
                {content.title && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Title:</div>
                    <div className="text-sm bg-white/5 rounded-lg p-3">{content.title}</div>
                  </div>
                )}
                {content.prompt && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Prompt:</div>
                    <div className="text-sm bg-white/5 rounded-lg p-3">{content.prompt}</div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Content:</div>
                  <div className="text-sm bg-white/5 rounded-lg p-3 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {content.content}
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="text-center py-12">
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filters' : 'Start generating content to see your history here'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}