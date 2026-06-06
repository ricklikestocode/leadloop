import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

declare global {
  var prisma: PrismaClient | undefined
}

// In Vercel, copy the template database to /tmp if it doesn't exist
if (process.env.VERCEL === "1") {
  const dbPath = "/tmp/dev.db"
  const templatePath = path.join(process.cwd(), "prisma", "dev.db.template")
  
  if (!fs.existsSync(dbPath)) {
    try {
      const dir = path.dirname(dbPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      // Copy template
      fs.copyFileSync(templatePath, dbPath)
      console.log("Database template successfully copied to /tmp/dev.db")
    } catch (error) {
      console.error("Failed to copy database template:", error)
    }
  }
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db
