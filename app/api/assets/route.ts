import { type NextRequest, NextResponse } from "next/server"
import type { Asset, PaginatedResponse } from "@/lib/types"

// Production-ready asset data (would connect to database in production)
export const assets: Asset[] = [
  {
    id: "1",
    title: "Advanced Banking System",
    description:
      "Complete banking system with ATM, bank robbery, loans, and wire transfers. Supports multiple currencies and real-time transactions.",
    category: "scripts",
    framework: "qbcore",
    version: "2.5.0",
    price: "free",
    image: "/banking-system-ui-dark-theme.jpg",
    downloads: 12580,
    rating: 4.9,
    author: "FiveM Tools Team",
    authorId: "admin",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
    tags: ["banking", "economy", "atm", "robbery"],
    fileSize: "2.4 MB",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Realistic Vehicle System",
    description:
      "Advanced vehicle handling with realistic physics, fuel system, damage model, and customization options.",
    category: "scripts",
    framework: "standalone",
    version: "3.0.0",
    price: "free",
    image: "/car-unlock-system-gta.jpg",
    downloads: 8920,
    rating: 4.7,
    author: "AutoMods",
    authorId: "user2",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-11-15T00:00:00Z",
    tags: ["vehicle", "realistic", "handling"],
    fileSize: "1.8 MB",
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "3",
    title: "Character Customization Pro",
    description:
      "Full character customization with clothing stores, barbershops, and appearance editing. Supports all frameworks.",
    category: "scripts",
    framework: "standalone",
    version: "4.2.0",
    price: "free",
    image: "/character-customization-ui.jpg",
    downloads: 21500,
    rating: 4.9,
    author: "PrismDev",
    authorId: "user3",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-12-03T00:00:00Z",
    tags: ["appearance", "clothing", "customization", "barbershop"],
    fileSize: "3.2 MB",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "4",
    title: "Electron Anti-Cheat V7",
    description:
      "Enterprise-grade anti-cheat with real-time detection, screenshot capture, and ban management dashboard.",
    category: "scripts",
    framework: "standalone",
    version: "7.0.0",
    price: "premium",
    image: "/anticheat-security-shield.jpg",
    downloads: 35000,
    rating: 4.8,
    author: "ElectronSecurity",
    authorId: "user4",
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-12-04T00:00:00Z",
    tags: ["anticheat", "security", "protection", "enterprise"],
    fileSize: "5.8 MB",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "5",
    title: "Legion Square Premium MLO",
    description: "High-quality Legion Square interior with multiple floors, offices, and underground parking.",
    category: "mlo",
    framework: "standalone",
    version: "2.0.0",
    price: "premium",
    image: "/gta-legion-square-building-interior.jpg",
    downloads: 4580,
    rating: 4.9,
    author: "MLOStudio",
    authorId: "user5",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2025-11-20T00:00:00Z",
    tags: ["interior", "legion", "building", "office"],
    fileSize: "45 MB",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "6",
    title: "Lamborghini Collection Pack",
    description: "15 high-quality Lamborghini vehicles with custom handling, sounds, and tuning parts.",
    category: "vehicles",
    framework: "standalone",
    version: "1.5.0",
    price: "premium",
    image: "/lamborghini-sports-car-gta.jpg",
    downloads: 7800,
    rating: 4.8,
    author: "AutoMods",
    authorId: "user2",
    createdAt: "2025-02-20T00:00:00Z",
    updatedAt: "2025-11-25T00:00:00Z",
    tags: ["lamborghini", "supercar", "vehicle", "italian"],
    fileSize: "120 MB",
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "7",
    title: "Police EUP Department Pack",
    description:
      "Complete police uniform pack with LSPD, BCSO, and State Police departments. Includes badges and accessories.",
    category: "clothing",
    framework: "standalone",
    version: "3.0.0",
    price: "free",
    image: "/police-uniform-gta-roleplay.jpg",
    downloads: 18900,
    rating: 4.6,
    author: "EUPMaster",
    authorId: "user6",
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
    tags: ["police", "uniform", "eup", "department"],
    fileSize: "85 MB",
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "8",
    title: "Pillbox Hospital MLO",
    description: "Fully detailed hospital interior with emergency room, operating rooms, pharmacy, and helipad.",
    category: "mlo",
    framework: "standalone",
    version: "1.8.0",
    price: "premium",
    image: "/hospital-interior-gta-mlo.jpg",
    downloads: 6200,
    rating: 4.9,
    author: "MLOStudio",
    authorId: "user5",
    createdAt: "2025-03-05T00:00:00Z",
    updatedAt: "2025-11-28T00:00:00Z",
    tags: ["hospital", "medical", "interior", "ems"],
    fileSize: "52 MB",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "9",
    title: "Multi-Level Garage System",
    description: "Advanced garage with multi-level storage, impound, tuning shop, and vehicle preview.",
    category: "scripts",
    framework: "esx",
    version: "2.1.0",
    price: "free",
    image: "/garage-system-gta.jpg",
    downloads: 15600,
    rating: 4.7,
    author: "GarageScripts",
    authorId: "user7",
    createdAt: "2025-02-25T00:00:00Z",
    updatedAt: "2025-12-02T00:00:00Z",
    tags: ["garage", "vehicles", "tuning", "storage"],
    fileSize: "1.9 MB",
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "10",
    title: "Drug Production System",
    description: "Complete drug production and distribution system with processing, selling, and police raids.",
    category: "scripts",
    framework: "qbcore",
    version: "1.3.0",
    price: "premium",
    image: "/drug-system-dark-ui.jpg",
    downloads: 8900,
    rating: 4.5,
    author: "QBScripts",
    authorId: "user8",
    createdAt: "2025-03-10T00:00:00Z",
    updatedAt: "2025-11-30T00:00:00Z",
    tags: ["drugs", "economy", "illegal", "production"],
    fileSize: "2.1 MB",
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "11",
    title: "BMW M5 F90 Competition",
    description: "High-quality BMW M5 with accurate handling, custom sound, and tuning parts.",
    category: "vehicles",
    framework: "standalone",
    version: "1.0.0",
    price: "free",
    image: "/bmw-m5-f90-gta-style.jpg",
    downloads: 23400,
    rating: 4.9,
    author: "AutoMods",
    authorId: "user2",
    createdAt: "2025-03-15T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
    tags: ["bmw", "sedan", "german", "luxury"],
    fileSize: "18 MB",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "12",
    title: "Fire Station MLO",
    description: "Complete fire station interior with truck bays, sleeping quarters, and training area.",
    category: "mlo",
    framework: "standalone",
    version: "1.2.0",
    price: "free",
    image: "/fire-station-interior-gta.jpg",
    downloads: 7800,
    rating: 4.6,
    author: "MLOStudio",
    authorId: "user5",
    createdAt: "2025-03-20T00:00:00Z",
    updatedAt: "2025-11-22T00:00:00Z",
    tags: ["fire", "emergency", "building", "station"],
    fileSize: "38 MB",
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "13",
    title: "QBox Core Framework",
    description: "Modern FiveM framework built on QBCore with enhanced features and better performance.",
    category: "scripts",
    framework: "qbox",
    version: "1.0.0",
    price: "free",
    image: "/qbox-framework-logo.jpg",
    downloads: 45000,
    rating: 4.9,
    author: "QBox Team",
    authorId: "qbox",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-12-04T00:00:00Z",
    tags: ["framework", "qbox", "core", "roleplay"],
    fileSize: "8.5 MB",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "14",
    title: "Advanced MDT System",
    description: "Police MDT with vehicle registration, warrant system, report filing, and BOLO management.",
    category: "scripts",
    framework: "qbcore",
    version: "2.0.0",
    price: "premium",
    image: "/police-mdt-computer-system.jpg",
    downloads: 12300,
    rating: 4.8,
    author: "LEScripts",
    authorId: "user9",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2025-12-03T00:00:00Z",
    tags: ["police", "mdt", "law enforcement", "dispatch"],
    fileSize: "4.2 MB",
    isVerified: true,
    isFeatured: true,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category")
  const framework = searchParams.get("framework")
  const price = searchParams.get("price")
  const search = searchParams.get("search")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "12")
  const sort = searchParams.get("sort") || "downloads"

  let filtered = [...assets]

  // Apply filters
  if (category) {
    filtered = filtered.filter((a) => a.category === category)
  }
  if (framework && framework !== "all") {
    filtered = filtered.filter((a) => a.framework === framework)
  }
  if (price && price !== "all") {
    filtered = filtered.filter((a) => a.price === price)
  }
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(searchLower) ||
        a.description.toLowerCase().includes(searchLower) ||
        a.tags.some((t) => t.toLowerCase().includes(searchLower)),
    )
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sort) {
      case "rating":
        return b.rating - a.rating
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return b.downloads - a.downloads
    }
  })

  // Paginate
  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  const response: PaginatedResponse<Asset> = {
    items,
    total,
    page,
    pageSize,
    hasMore: start + pageSize < total,
  }

  return NextResponse.json(response)
}
