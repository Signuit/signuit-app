import "dotenv/config";
import { db } from "@nexus/db";
import { user } from "@nexus/db/schema/auth";
import { eq } from "drizzle-orm";
import "../../apps/web/.env";

const DEMO_USERS = [
	{ email: "demo-vantage@signuit.app", name: "Vantage Capital" },
	{ email: "demo-primebank@signuit.app", name: "Prime Bank" },
	{ email: "demo-operator@signuit.app", name: "SignUIT Operator" },
];

async function seedDemoUsers() {
	console.log("Seeding demo users...");

	for (const u of DEMO_USERS) {
		const existing = await db.query.user.findFirst({
			where: eq(user.email, u.email),
		});

		if (!existing) {
			await db.insert(user).values({
				id: crypto.randomUUID(),
				name: u.name,
				email: u.email,
				emailVerified: true,
			});
			console.log(`✓ Created: ${u.email}`);
		} else {
			console.log(`✓ Already exists: ${u.email}`);
		}
	}

	console.log("✓ Demo users seeded!");
}

seedDemoUsers().catch(console.error);
