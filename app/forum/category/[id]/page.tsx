import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { mockForumCategories, mockThreads } from "@/lib/data"
import { ArrowLeft, Plus, MessageSquare, Heart, Eye, Pin, Crown, Shield } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const categoryId = Number(id)
  const category = mockForumCategories.find((c) => c.id === categoryId)

  if (!category) {
    notFound()
  }

  const categoryThreads = mockThreads.filter(
    (t) => t.category.toLowerCase() === category.name.toLowerCase() || t.category === category.name,
  )

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-72">
        <Header />
        <div className="p-6">
          {/* Back Button */}
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
              <p className="text-sm text-muted-foreground mt-2">{category.threadCount} threads</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              New Thread
            </Button>
          </div>

          {/* Threads */}
          <div className="space-y-3">
            {categoryThreads.length > 0 ? (
              categoryThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/forum/thread/${thread.id}`}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-primary/50 ${
                    thread.isPinned ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-secondary">
                    <img
                      src={thread.author.avatar || "/placeholder.svg"}
                      alt={thread.author.username}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {thread.isPinned && <Pin className="h-4 w-4 text-primary" />}
                      <h3 className="font-semibold text-foreground truncate">{thread.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {thread.author.membership === "vip" && <Crown className="h-3 w-3 text-primary" />}
                        {thread.author.membership === "admin" && <Shield className="h-3 w-3 text-destructive" />}
                        {thread.author.username}
                      </span>
                      <span>•</span>
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {thread.replies}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {thread.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {thread.views}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-border bg-card">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground">No threads yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to start a discussion!</p>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Thread
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
