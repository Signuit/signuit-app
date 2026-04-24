import { db } from "@nexus/db";
import { user } from "@nexus/db/schema/auth";
import { eq } from "drizzle-orm";

export const DEMO_USERS = [
  {
    email: "demo-vantage@signuit.app",
    name: "Vantage Capital",
    role: "institution" as const,
    partyId: "VantageCapital",
  },
  {
    email: "demo-primebank@signuit.app",
    name: "Prime Bank",
    role: "counterparty" as const,
    partyId: "PrimeBank",
  },
  {
    email: "demo-operator@signuit.app",
    name: "SignUIT Operator",
    role: "operator" as const,
    partyId: "SignUITOperator",
  },
];

export type DemoRole = "institution" | "counterparty" | "operator";

export interface DemoUserInfo {
  email: string;
  name: string;
  role: DemoRole;
  partyId: string;
}

export function getDemoUserInfo(email: string): DemoUserInfo | undefined {
  return DEMO_USERS.find((u) => u.email === email);
}

export function isDemoUser(email: string): boolean {
  return DEMO_USERS.some((u) => u.email === email);
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