// Rollup config for CLI package
import typescript from "@rollup/plugin-typescript";
export default {
  input: "src/main.ts",
  output: {
    file: "dist/cli.js",
    format: "cjs",
    banner: "#!/usr/bin/env node", //Required for node commands
    sourcemap: false,
  },
  plugins: [typescript()],
};
