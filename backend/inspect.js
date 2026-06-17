const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      name: true
    }
  });
  fs.writeFileSync("inspect_result.json", JSON.stringify(users, null, 2));
  console.log("Users written to inspect_result.json successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
