import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
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
		viteReact(),
	],
	server: {
		port: 3001,
		host: true,
		strictPort: true,
	},
	optimizeDeps: {
		include: damlPackages,
	},
	build: {
		commonjsOptions: {
			include: [/@daml\.js\//],
		},
	},
	ssr: {
		external: damlPackages,
		noExternal: [],
	},
});
