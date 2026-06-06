import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

declare global {
  var prisma: PrismaClient | undefined
}

// In Vercel, copy the template database to a versioned path in /tmp and override DATABASE_URL
if (process.env.VERCEL === "1") {
  const dbVersion = "v5"
  const dbPath = `/tmp/dev_${dbVersion}.db`
  const templatePath = path.join(process.cwd(), "prisma", "dev.db.template")
  
  // Override the environment variable so Prisma Client connects to the versioned file
  process.env.DATABASE_URL = `file:${dbPath}`
  
  if (!fs.existsSync(dbPath)) {
    try {
      const dir = path.dirname(dbPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      // Copy template to the versioned path
      fs.copyFileSync(templatePath, dbPath)
      console.log(`Database template successfully copied to ${dbPath}`)
    } catch (error) {
      console.error("Failed to copy database template:", error)
    }
  }
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db
