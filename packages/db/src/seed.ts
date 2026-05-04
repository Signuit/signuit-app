import "dotenv/config";
import { db } from "@nexus/db";
import { user } from "@nexus/db/schema/auth";
import { DEMO_USERS } from "@nexus/db/seed/demo-users";
import { eq } from "drizzle-orm";

type UserInsert = typeof user.$inferInsert;

async function seedDemoUsers() {
	console.log("Seeding demo users with correct roles...");

	for (const u of DEMO_USERS) {
		const existing = await db.query.user.findFirst({
			where: eq(user.email, u.email),
		});

		if (!existing) {
			const insert: UserInsert = {
				id: crypto.randomUUID(),
				name: u.name,
				email: u.email,
				emailVerified: true,
				role: u.role,
				cantonPartyId: u.partyId,
			};
			await db.insert(user).values(insert);
			console.log(`✓ Created: ${u.email} [role: ${u.role}]`);
		} else {
			await db
				.update(user)
				.set({ role: u.role, cantonPartyId: u.partyId })
				.where(eq(user.email, u.email));
			console.log(`✓ Updated role: ${u.email} → ${u.role}`);
		}
	}

	console.log("✓ Done!");
}

seedDemoUsers().catch(console.error);
