import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const admin = await prisma.user.upsert({
    where: { discordId: '1047719075322810378' },
    update: {},
    create: {
      discordId: '1047719075322810378',
      username: 'Admin',
      email: 'admin@fivemtools.net',
      avatar: '/admin-avatar.png',
      membership: 'admin',
      isAdmin: true,
      coins: 999999,
    }
  })

  console.log('✅ Admin user created')

  const assets = [
    { title: "Advanced Banking System", description: "Complete banking system with ATM, bank robbery, loans, and wire transfers.", category: "scripts", framework: "qbcore", version: "2.5.0", coinPrice: 0, thumbnail: "/banking-system-ui-dark-theme.jpg", downloads: 12580, tags: ["banking", "economy"], fileSize: "2.4 MB", downloadLink: "/uploads/banking.zip", authorId: admin.discordId },
    { title: "Realistic Vehicle System", description: "Advanced vehicle handling with realistic physics.", category: "scripts", framework: "standalone", version: "3.0.0", coinPrice: 0, thumbnail: "/car-unlock-system-gta.jpg", downloads: 8920, tags: ["vehicle"], fileSize: "1.8 MB", downloadLink: "/uploads/vehicle.zip", authorId: admin.discordId },
    { title: "Character Customization Pro", description: "Full character customization.", category: "scripts", framework: "standalone", version: "4.2.0", coinPrice: 0, thumbnail: "/character-customization-ui.jpg", downloads: 21500, tags: ["appearance"], fileSize: "3.2 MB", downloadLink: "/uploads/character.zip", authorId: admin.discordId },
    { title: "Electron Anti-Cheat V7", description: "Enterprise-grade anti-cheat.", category: "scripts", framework: "standalone", version: "7.0.0", coinPrice: 300, thumbnail: "/anticheat-security-shield.jpg", downloads: 35000, tags: ["anticheat"], fileSize: "5.8 MB", downloadLink: "/uploads/anticheat.zip", authorId: admin.discordId },
    { title: "Legion Square Premium MLO", description: "High-quality Legion Square interior.", category: "mlo", framework: "standalone", version: "2.0.0", coinPrice: 250, thumbnail: "/gta-legion-square-building-interior.jpg", downloads: 4580, tags: ["interior"], fileSize: "45 MB", downloadLink: "/uploads/legion.zip", authorId: admin.discordId },
    { title: "Lamborghini Collection Pack", description: "15 high-quality Lamborghini vehicles.", category: "vehicles", framework: "standalone", version: "1.5.0", coinPrice: 200, thumbnail: "/lamborghini-sports-car-gta.jpg", downloads: 7800, tags: ["lamborghini"], fileSize: "120 MB", downloadLink: "/uploads/lambo.zip", authorId: admin.discordId },
    { title: "Police EUP Department Pack", description: "Complete police uniform pack.", category: "clothing", framework: "standalone", version: "3.0.0", coinPrice: 0, thumbnail: "/police-uniform-gta-roleplay.jpg", downloads: 18900, tags: ["police"], fileSize: "85 MB", downloadLink: "/uploads/police.zip", authorId: admin.discordId },
    { title: "Pillbox Hospital MLO", description: "Fully detailed hospital interior.", category: "mlo", framework: "standalone", version: "1.8.0", coinPrice: 200, thumbnail: "/hospital-interior-gta-mlo.jpg", downloads: 6200, tags: ["hospital"], fileSize: "52 MB", downloadLink: "/uploads/hospital.zip", authorId: admin.discordId },
    { title: "Multi-Level Garage System", description: "Advanced garage system.", category: "scripts", framework: "esx", version: "2.1.0", coinPrice: 0, thumbnail: "/garage-system-gta.jpg", downloads: 15600, tags: ["garage"], fileSize: "1.9 MB", downloadLink: "/uploads/garage.zip", authorId: admin.discordId },
    { title: "Drug Production System", description: "Complete drug production system.", category: "scripts", framework: "qbcore", version: "1.3.0", coinPrice: 150, thumbnail: "/drug-system-dark-ui.jpg", downloads: 8900, tags: ["drugs"], fileSize: "2.1 MB", downloadLink: "/uploads/drugs.zip", authorId: admin.discordId },
    { title: "BMW M5 F90 Competition", description: "High-quality BMW M5.", category: "vehicles", framework: "standalone", version: "1.0.0", coinPrice: 0, thumbnail: "/bmw-m5-f90-gta-style.jpg", downloads: 23400, tags: ["bmw"], fileSize: "18 MB", downloadLink: "/uploads/bmw.zip", authorId: admin.discordId },
    { title: "Fire Station MLO", description: "Complete fire station interior.", category: "mlo", framework: "standalone", version: "1.2.0", coinPrice: 0, thumbnail: "/fire-station-interior-gta.jpg", downloads: 7800, tags: ["fire"], fileSize: "38 MB", downloadLink: "/uploads/fire.zip", authorId: admin.discordId },
    { title: "QBox Core Framework", description: "Modern FiveM framework.", category: "scripts", framework: "qbox", version: "1.0.0", coinPrice: 0, thumbnail: "/qbox-framework-logo.jpg", downloads: 45000, tags: ["framework"], fileSize: "8.5 MB", downloadLink: "/uploads/qbox.zip", authorId: admin.discordId },
    { title: "Advanced MDT System", description: "Police MDT system.", category: "scripts", framework: "qbcore", version: "2.0.0", coinPrice: 150, thumbnail: "/police-mdt-computer-system.jpg", downloads: 12300, tags: ["police"], fileSize: "4.2 MB", downloadLink: "/uploads/mdt.zip", authorId: admin.discordId },
  ]

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { 
        title_authorId: {
          title: asset.title,
          authorId: asset.authorId
        }
      },
      update: {},
      create: asset
    })
  }

  console.log('✅ Assets seeded')

  const threads = [
    { title: "Welcome to FiveM Tools V7!", content: "Welcome everyone! Feel free to share your resources and ask questions. This is a community-driven platform for FiveM developers and server owners.", categoryId: "general", authorId: admin.discordId, isPinned: true, views: 1250 },
    { title: "How to install QBCore scripts?", content: "I need help installing QBCore scripts. Can someone guide me through the process? I'm new to FiveM development.", categoryId: "help", authorId: admin.discordId, views: 450 },
    { title: "Best MLO packs for 2025?", content: "What are the best MLO packs you recommend for a new server? Looking for high-quality interiors.", categoryId: "discussion", authorId: admin.discordId, views: 780 },
    { title: "Electron AC Review", content: "Just installed Electron AC and it's amazing! No more cheaters on my server. Highly recommended!", categoryId: "reviews", authorId: admin.discordId, views: 920, likes: 45 },
    { title: "QBox Framework vs QBCore - Which is better?", content: "I'm starting a new server and can't decide between QBox and QBCore. What are your experiences?", categoryId: "discussion", authorId: admin.discordId, views: 650 },
    { title: "Free Banking System Released!", content: "I've just released a free banking system for QBCore. Check it out in the scripts section!", categoryId: "releases", authorId: admin.discordId, views: 1100, likes: 78 },
  ]

  for (const thread of threads) {
    await prisma.forumThread.create({
      data: thread
    })
  }

  console.log('✅ Forum threads seeded')
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
