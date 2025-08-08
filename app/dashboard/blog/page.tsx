'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Sparkles, Globe, Copy, Eye, RefreshCw } from 'lucide-react'

export default function BlogPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [content, setContent] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [keywords, setKeywords] = useState('')
  const [callToAction, setCallToAction] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [embedSnippet, setEmbedSnippet] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const keywordArray = useMemo(() =>
    keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean),
    [keywords]
  )

  const fetchPosts = async () => {
    try {
      setRefreshing(true)
      const res = await fetch('/api/blog', { cache: 'no-store' })
      const data = await res.json()
      if (data?.success) setPosts(data.posts)
    } catch (e) {}
    finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setEmbedSnippet(null)
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || undefined,
          prompt: prompt || undefined,
          additionalContext: additionalContext || undefined,
          keywords: keywordArray,
          callToAction: callToAction || undefined,
          generate: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to generate')
      toast({ title: 'Blog post created', description: data.post.title })
      setEmbedSnippet(data.embedSnippet)
      setTitle('')
      setPrompt('')
      setAdditionalContext('')
      setKeywords('')
      setCallToAction('')
      fetchPosts()
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateManual = async () => {
    try {
      if (!title || !content) {
        toast({ title: 'Missing fields', description: 'Title and content are required', variant: 'destructive' })
        return
      }
      setLoading(true)
      setEmbedSnippet(null)
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, generate: false }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create')
      toast({ title: 'Blog post created', description: data.post.title })
      setEmbedSnippet(data.embedSnippet)
      setTitle('')
      setContent('')
      fetchPosts()
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Copied' })
    } catch {}
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2">
          <Globe className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium">Blog</span>
        </div>
        <h1 className="text-3xl font-bold font-sora">Create and manage blog posts</h1>
        <p className="text-muted-foreground">Generate posts using your business profile, or write manually. We provide an embed to track real views on your site.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Create a blog post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Title (optional when generating)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Prompt to generate (optional)" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
            <Textarea placeholder="Additional business/context (optional)" value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} rows={3} />
            <Input placeholder="Keywords (comma separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            <Input placeholder="Call to action (optional)" value={callToAction} onChange={(e) => setCallToAction(e.target.value)} />

            <div className="flex items-center gap-3">
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Generate with AI
              </Button>
              <div className="text-muted-foreground text-sm">or</div>
              <Button variant="secondary" onClick={handleCreateManual} disabled={loading}>
                Create manually
              </Button>
            </div>

            <Textarea placeholder="Manual content (use when creating manually)" value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embed tracking on your site</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">After creating a post, copy the embed below into the specific blog post page on your website to track real viewers.</p>
            {embedSnippet ? (
              <div className="space-y-2">
                <pre className="text-xs bg-black/40 p-3 rounded-md overflow-x-auto"><code>{embedSnippet}</code></pre>
                <Button size="sm" onClick={() => copy(embedSnippet)}>
                  <Copy className="h-4 w-4 mr-2" /> Copy snippet
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Create a post to generate a unique embed snippet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your posts</CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchPosts} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {posts.length === 0 && (
              <div className="text-sm text-muted-foreground">No posts yet.</div>
            )}
            {posts.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-white/5">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">Slug: {p.slug || '—'} • Tracking ID: {p.trackingId || '—'}</div>
                </div>
                <div className="flex items-center gap-2">
                  {p.published ? (
                    <Badge variant="default">Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copy(`<script>(function(){try{var i=new Image();var q='tid=${p.trackingId}&pid=${p.id}&url='+encodeURIComponent(window.location.href)+'&ref='+encodeURIComponent(document.referrer);i.referrerPolicy='no-referrer-when-downgrade';i.src='${window.location.origin}/api/blog/track?'+q;}catch(e){}})();<\/script>`)}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Copy tracking
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


