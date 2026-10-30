import { execSync } from "child_process";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { withTestSchema } from "./test-database-url.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, ".env") });

const adminUrl = process.env.DATABASE_URL;
const adminDirectUrl = process.env.DIRECT_URL || adminUrl;
if (!adminUrl) {
  throw new Error("DATABASE_URL no definida");
}

const { url: testDirectUrl, testSchema } = withTestSchema(adminDirectUrl, adminDirectUrl);
const { url: testUrl } = withTestSchema(adminUrl, adminDirectUrl);

const sql = `CREATE SCHEMA IF NOT EXISTS "${testSchema.replace(/"/g, '""')}";`;

execSync("npx prisma db execute --stdin --url " + JSON.stringify(adminDirectUrl), {
  cwd: root,
  input: sql,
  stdio: ["pipe", "inherit", "inherit"],
});

execSync("npx prisma migrate deploy", {
  cwd: root,
  env: {
    ...process.env,
    DATABASE_URL: testUrl,
    DIRECT_URL: testDirectUrl,
  },
  stdio: "inherit",
});

console.log(`Schema de prueba listo: ${testSchema}`);
