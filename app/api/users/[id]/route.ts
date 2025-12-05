import { NextResponse } from "next/server"

const mockUsers = [
  {
    id: "user1",
    username: "ServerOwner",
    email: "owner@server.com",
    avatar: "/gamer-avatar.png",
    discordId: "123456789",
    membership: "vip",
    downloads: 45,
    reputation: 125,
    points: 680,
    bio: "FiveM server owner since 2020.",
    createdAt: "2024-01-15",
  },
]

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = mockUsers.find((u) => u.id === id)
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  
  return NextResponse.json({ user })
}
