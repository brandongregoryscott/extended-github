import { defineConfig } from "wxt";

const DESCRIPTION = "Browser extension with additional GitHub functionality";

// See https://wxt.dev/api/config.html
const config = defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  outDir: "dist",
  manifest: {
    name: "Extended GitHub",
    action: {
      default_title: DESCRIPTION,
    },
    description: DESCRIPTION,
    permissions: ["storage"],
  },
});

export default config;
