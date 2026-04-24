import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

import path from "node:path";

dotenv.config({
	path: path.resolve(process.cwd(), "../../apps/web/.env"),
});

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
});
