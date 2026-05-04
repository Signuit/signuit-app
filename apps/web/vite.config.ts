import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const damlPackages = [
	"@daml.js/nexus-example-0.0.1",
	"@daml.js/daml-prim-DA-Types-1.0.0",
	"@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0",
];

export default defineConfig({
	plugins: [
		tsconfigPaths({ ignoreConfigErrors: true }),
		tailwindcss(),
		tanstackStart(),
		nitro(),
		viteReact(),
	],
	server: {
		port: 3001,
		host: true,
		strictPort: true,
	},
	optimizeDeps: {
		include: damlPackages,
		exclude: [
			"@tanstack/react-start",
			"@tanstack/react-router",
			"@tanstack/start-server-core",
			"@tanstack/react-start-server",
		],
	},
	build: {
		commonjsOptions: {
			include: [/node_modules/],
			requireReturnsDefault: "auto",
			transformMixedEsModules: true,
		},
	},
	ssr: {
		external: damlPackages,
		noExternal: true,
	},
});
