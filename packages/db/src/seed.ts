import "dotenv/config";
import { auth } from "@nexus/auth";
import { db } from "@nexus/db";
import { user } from "@nexus/db/schema/auth";
import { eq } from "drizzle-orm";
import "../../apps/web/.env";

/**
 * Demo password for all seeded users.
 * Matches DEMO.md documentation.
 */
const DEMO_PASSWORD = "demo-password-123";

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

		if (existing) {
			console.log(`✓ Already exists: ${u.email}`);
			continue;
		}

		// Use Better Auth's signUpEmail so password is hashed correctly
		// and databaseHooks fire (sets role + cantonPartyId automatically)
		const result = await auth.api.signUpEmail({
			body: {
				email: u.email,
				name: u.name,
				password: DEMO_PASSWORD,
			},
		});

		if (result?.user) {
			console.log(`✓ Created: ${u.email} (role + partyId auto-assigned via databaseHooks)`);
		} else {
			console.warn(`⚠ Could not create: ${u.email}`, result);
		}
	}

	console.log(`\n✓ Demo users seeded! Password for all accounts: ${DEMO_PASSWORD}`);
}

seedDemoUsers().catch(console.error);
