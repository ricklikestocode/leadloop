const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupTest() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      console.error("No workspace found. Please create one first.");
      return;
    }

    console.log(`Using workspace: ${workspace.name} (${workspace.id})`);

    await prisma.workspaceSettings.upsert({
      where: { workspaceId: workspace.id },
      update: {
        whatsappBusinessPhoneId: "your-phone-number-id",
        whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || "your-whatsapp-access-token",
        autoReplyEnabled: true,
      },
      create: {
        workspaceId: workspace.id,
        whatsappBusinessPhoneId: "your-phone-number-id",
        whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || "your-whatsapp-access-token",
        autoReplyEnabled: true,
      },
    });

    console.log("Test settings configured successfully.");
  } catch (error) {
    console.error("Error setting up test:", error);
  }
}

setupTest()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
