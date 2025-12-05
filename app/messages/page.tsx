import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ChatSystem } from "@/components/chat-system"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, ImageIcon, Mic } from "lucide-react"

const mockConversations = [
  {
    id: "1",
    user: { name: "FiveM Admin", avatar: "/admin-avatar.png", online: true, role: "admin" },
    lastMessage: "Welcome to FiveM Tools! Let me know if you need any help.",
    timestamp: "2 min ago",
    unread: 2,
  },
  {
    id: "2",
    user: { name: "ScriptMaster", avatar: "/gamer-avatar-blue.jpg", online: false, role: "vip" },
    lastMessage: "Thanks for the purchase! Here's the support link...",
    timestamp: "1 hour ago",
    unread: 0,
  },
  {
    id: "3",
    user: { name: "MLOStudio", avatar: "/studio-avatar.jpg", online: true, role: "vip" },
    lastMessage: "The custom MLO is ready for review.",
    timestamp: "Yesterday",
    unread: 0,
  },
  {
    id: "4",
    user: { name: "CarModder", avatar: "/gamer-avatar.png", online: false, role: "free" },
    lastMessage: "Can you send me the vehicle files?",
    timestamp: "2 days ago",
    unread: 0,
  },
]

const mockMessages = [
  {
    id: "1",
    sender: "other",
    content: "Welcome to FiveM Tools! Let me know if you need any help getting started.",
    time: "10:30 AM",
  },
  {
    id: "2",
    sender: "other",
    content: "We have a great collection of scripts and MLOs that might interest you.",
    time: "10:31 AM",
  },
  { id: "3", sender: "me", content: "Thanks! I'm looking for some good banking scripts.", time: "10:35 AM" },
  {
    id: "4",
    sender: "other",
    content:
      "Check out our Prism Banking system - it's one of our most popular scripts with ATM support, bank robbery mechanics, and more!",
    time: "10:36 AM",
  },
  { id: "5", sender: "me", content: "That sounds perfect! Is it compatible with QBCore?", time: "10:38 AM" },
]

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-72">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Conversations List */}
          <div className="w-80 border-r border-border glass">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Messages</h2>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-secondary">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10 h-10 bg-secondary/50 border-border/50 rounded-xl"
                />
              </div>
            </div>
            <div className="overflow-y-auto scrollbar-thin h-[calc(100%-88px)]">
              {mockConversations.map((conv, i) => (
                <button
                  key={conv.id}
                  className={`w-full flex items-center gap-3 p-4 transition-colors border-l-2 ${
                    i === 0 ? "bg-primary/10 border-l-primary" : "border-l-transparent hover:bg-secondary/30"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.user.avatar || "/placeholder.svg?height=48&width=48&query=user avatar"}
                      alt={conv.user.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    {conv.user.online && (
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full status-online border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{conv.user.name}</span>
                      <span className="text-[10px] text-muted-foreground">{conv.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 glass">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/admin-avatar.png"
                    alt="FiveM Admin"
                    className="h-11 w-11 rounded-xl object-cover"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full status-online border-2 border-card" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">FiveM Admin</h3>
                  <p className="text-xs text-success">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <Video className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              <div className="text-center">
                <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">Today</span>
              </div>
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === "me" ? "justify-end" : ""}`}>
                  {msg.sender !== "me" && (
                    <img src="/admin-avatar.png" alt="Admin" className="h-8 w-8 rounded-lg shrink-0 mt-1" />
                  )}
                  <div className={`max-w-md ${msg.sender === "me" ? "order-1" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.sender === "me" ? "bg-primary text-primary-foreground rounded-br-md" : "glass rounded-bl-md"
                      }`}
                    >
                      <p className={msg.sender === "me" ? "text-primary-foreground" : "text-foreground"}>
                        {msg.content}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] text-muted-foreground mt-1 block ${msg.sender === "me" ? "text-right" : ""}`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50 glass">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                </div>
                <Input
                  placeholder="Type a message..."
                  className="flex-1 h-11 bg-secondary/50 border-border/50 rounded-xl"
                />
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button size="icon" className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 glow-sm">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
