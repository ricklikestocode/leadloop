const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const userCount = await prisma.user.count()
    const workspaceCount = await prisma.workspace.count()
    console.log(`USERS: ${userCount}`)
    console.log(`WORKSPACES: ${workspaceCount}`)
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({ take: 1 })
      console.log('FIRST USER:', JSON.stringify(users[0], null, 2))
    }
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
