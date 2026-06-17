import { createApp } from "./app";
import { env } from "./config/env";
import { ensureDefaultUsers } from "./db/seedHelper";

const app = createApp();

const startServer = async (port: number, retriesLeft = 10): Promise<void> => {
  // Ensure admin and default users exist
  await ensureDefaultUsers();

  // Dump DB to verify alignment
  try {
    const { prisma } = require("./db/prisma");
    const fs = require("fs");
    const path = require("path");
    const children = await prisma.child.findMany({});
    const sessions = await prisma.posyanduSession.findMany({
      include: { posyandu: true }
    });
    fs.writeFileSync(
      path.join(__dirname, "../../db_dump.json"),
      JSON.stringify({ children, sessions }, null, 2)
    );
    console.log("✅ Database dumped successfully to db_dump.json!");

    // Check file encodings
    try {
      const fs = require("fs");
      const path = require("path");
      const checkBOM = (filePath) => {
        if (!fs.existsSync(filePath)) return "does not exist";
        const buffer = fs.readFileSync(filePath);
        return {
          length: buffer.length,
          hex: buffer.slice(0, 10).toString("hex"),
          utf8Sample: buffer.slice(0, 100).toString("utf8")
        };
      };
      const editProfilePath = path.join(__dirname, "../../posco_app/posco_app/lib/features/orang_tua/edit_profile_screen.dart");
      const helpCenterPath = path.join(__dirname, "../../posco_app/posco_app/lib/features/orang_tua/help_center_screen.dart");
      fs.writeFileSync(
        path.join(__dirname, "../../file_encodings.json"),
        JSON.stringify({
          edit_profile: checkBOM(editProfilePath),
          help_center: checkBOM(helpCenterPath)
        }, null, 2)
      );
      console.log("✅ Wrote file_encodings.json successfully!");
    } catch (e) {
      console.error("❌ Failed to check file encodings:", e);
    }
  } catch (error) {
    console.error("❌ Startup diagnostics failed:", error);
  }

  const server = app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE" && retriesLeft > 0) {
      server.close();
      startServer(port + 1, retriesLeft - 1);
      return;
    }

    console.error(error);
    process.exit(1);
  });
};

startServer(env.port);
