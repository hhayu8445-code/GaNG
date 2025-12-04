import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageSquare, Download, Star, Award, Calendar, Crown, Shield, Heart } from "lucide-react"
import Link from "next/link"

const mockUser = {
  id: "user1",
  username: "ServerOwner",
  email: "owner@server.com",
  avatar: "/gamer-avatar.png",
  discordId: "123456789",
  membership: "vip" as "vip" | "admin",
  downloads: 45,
  reputation: 125,
  points: 680,
  bio: "FiveM server owner since 2020. Passionate about creating immersive roleplay experiences.",
  createdAt: "2024-01-15",
}

const mockAchievements = [
  { id: "1", name: "First Download", icon: "🏆" },
  { id: "2", name: "First Post", icon: "💬" },
  { id: "3", name: "Helpful Member", icon: "❤️" },
  { id: "4", name: "VIP Member", icon: "👑" },
]

const mockRecentPosts = [
  { id: "1", title: "How to optimize your server for 128 players", likes: 45, replies: 12, createdAt: "2024-03-08" },
  { id: "2", title: "My custom police department MLO showcase", likes: 89, replies: 34, createdAt: "2024-03-05" },
  { id: "3", title: "[HELP] ESX to QBCore migration tips?", likes: 23, replies: 8, createdAt: "2024-03-01" },
]

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
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
            Back
          </Link>

          {/* Profile Header */}
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <img
                  src={mockUser.avatar || "/placeholder.svg"}
                  alt={mockUser.username}
                  className="h-28 w-28 rounded-full object-cover border-4 border-primary/20"
                />
                {mockUser.membership === "vip" && (
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{mockUser.username}</h1>
                  {mockUser.membership === "vip" && (
                    <Badge className="bg-primary/20 text-primary">
                      <Crown className="h-3 w-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                  {mockUser.membership === "admin" && (
                    <Badge className="bg-destructive/20 text-destructive">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{mockUser.bio}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(mockUser.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning" />
                    {mockUser.reputation} reputation
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-primary" />
                    {mockUser.points} points
                  </span>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Stats */}
            <div className="col-span-1 space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground mb-4">Statistics</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Downloads
                    </span>
                    <span className="font-semibold text-foreground">{mockUser.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Posts
                    </span>
                    <span className="font-semibold text-foreground">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Likes Given
                    </span>
                    <span className="font-semibold text-foreground">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Likes Received
                    </span>
                    <span className="font-semibold text-foreground">342</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground mb-4">Achievements</h2>
                <div className="flex flex-wrap gap-2">
                  {mockAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2"
                      title={achievement.name}
                    >
                      <span className="text-lg">{achievement.icon}</span>
                      <span className="text-sm text-foreground">{achievement.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-span-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground mb-4">Recent Posts</h2>
                <div className="space-y-4">
                  {mockRecentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/forum/thread/${post.id}`}
                      className="block rounded-lg bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <h3 className="font-medium text-foreground mb-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes} likes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.replies} replies
                        </span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
