import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: './',
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
