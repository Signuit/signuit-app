import { db } from "@nexus/db";
import { user } from "@nexus/db/schema/auth";
import { eq } from "drizzle-orm";

export const DEMO_USERS = [
  { email: "demo-vantage@signuit.app", role: "institution" as const, partyId: "VantageCapital", name: "Vantage Capital" },
  { email: "demo-primebank@signuit.app", role: "counterparty" as const, partyId: "PrimeBank", name: "Prime Bank" },
  { email: "demo-operator@signuit.app", role: "operator" as const, partyId: "SignUITOperator", name: "SignUIT Operator" },
];

export type DemoRole = "institution" | "counterparty" | "operator";

export function isDemoUser(email: string): boolean {
  return DEMO_USERS.some((u) => u.email === email);
}

export function getDemoUserInfo(email: string) {
  return DEMO_USERS.find((u) => u.email === email);
}

export async function seedDemoUsers() {
  for (const demoUser of DEMO_USERS) {
    const existing = await db.query.user.findFirst({
      where: eq(user.email, demoUser.email),
    });

    if (!existing) {
      await db.insert(user).values({
        id: crypto.randomUUID(),
        name: demoUser.name,
        email: demoUser.email,
        emailVerified: true,
      });
      console.log(`✓ Created demo user: ${demoUser.email} (${demoUser.role})`);
    }
  }
  console.log("✓ Demo users seeded successfully");
}