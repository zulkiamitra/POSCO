import { prisma } from "./db/prisma";
import fs from "fs";
import path from "path";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      name: true
    }
  });
  fs.writeFileSync(path.join(__dirname, "../inspect_result.json"), JSON.stringify(users, null, 2));
  console.log("Written to inspect_result.json successfully");
}

main().finally(() => prisma.$disconnect());
