const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  const email = "test@example.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        name: "Test User",
        password: hashedPassword,
      },
    });
    console.log("Test user created/updated:", user.email);

    // Create a workspace for the user if it doesn't exist
    const existingWorkspaceUser = await prisma.workspaceUser.findFirst({
      where: { userId: user.id }
    });

    if (!existingWorkspaceUser) {
      const workspace = await prisma.workspace.create({
        data: {
          name: "Test Workspace",
          users: {
            create: {
              userId: user.id,
              role: "ADMIN",
              status: "ACTIVE"
            }
          }
        }
      });
      console.log("Workspace created:", workspace.name);
    } else {
      console.log("User already has a workspace.");
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
