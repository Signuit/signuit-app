import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
	path: path.resolve(process.cwd(), "../../.env"),
});

const url = process.env.DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Turso remote URL ise turso dialect, local file ise sqlite
const isRemote = url.startsWith("libsql://") || url.startsWith("https://");

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: isRemote ? "turso" : "sqlite",
	dbCredentials: isRemote ? { url, authToken } : { url },
});
