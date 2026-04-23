import { authPlugin, createNexusClient, tanstackQueryPlugin } from "@nexus-framework/react";
import { nexusTypes } from "./nexus-types";

export const nexus = await createNexusClient({
	baseUrl: "/api/ledger",
	plugins: [authPlugin({ basePath: "/api/nexus-auth" }), tanstackQueryPlugin()],
	types: nexusTypes,
});
