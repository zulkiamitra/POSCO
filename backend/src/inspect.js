const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const children = await prisma.child.findMany();
  console.log("=== CHILDREN ===");
  console.log(JSON.stringify(children, null, 2));

  const sessions = await prisma.posyanduSession.findMany({
    include: { posyandu: true }
  });
  console.log("=== SESSIONS ===");
  console.log(JSON.stringify(sessions, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
