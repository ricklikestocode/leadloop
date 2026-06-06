import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

declare global {
  var prisma: PrismaClient | undefined
}

// In Vercel, copy the template database to /tmp if it doesn't exist or if the schema/size has changed
if (process.env.VERCEL === "1") {
  const dbPath = "/tmp/dev.db"
  const templatePath = path.join(process.cwd(), "prisma", "dev.db.template")
  
  let shouldCopy = false
  if (!fs.existsSync(dbPath)) {
    shouldCopy = true
  } else {
    try {
      const templateSize = fs.statSync(templatePath).size
      const dbSize = fs.statSync(dbPath).size
      if (templateSize !== dbSize) {
        shouldCopy = true
      }
    } catch (e) {
      shouldCopy = true
    }
  }
  
  if (shouldCopy) {
    try {
      const dir = path.dirname(dbPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      // Delete existing file before copying to prevent busy/locked errors
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath)
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
