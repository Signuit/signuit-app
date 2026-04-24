import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
	path: path.resolve(process.cwd(), "../../apps/web/.env"),
});

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
