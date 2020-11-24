const { exec } = require("child_process");
import * as fs from "fs";
import { ERROR_MSG, WARN_MSG } from "../src/constants";

// Remove all temp files before each run
beforeEach(() => {
  return new Promise((resolve) => {
    exec("rm ./integs/tmp/*", () => {
      resolve();
    });
  });
});

test("should show help menu", () => {
  return new Promise((resolve) => {
    exec("gorilla --help", (_: string, stdout: string) => {
      expect(stdout).toContain(
        "Gorilla: Stop monkeying around and build better scripts."
      );

      resolve();
    });
  });
});

test("should throw error on unknown file", () => {
  return new Promise((resolve) => {
    exec(
      "gorilla --input ./integs/test-files/not_a_file.ts --output ./integs/tmp/out.js",
      (_: string, __: string, stderr: string) => {
        expect(stderr).toContain("Could not resolve entry module");
        resolve();
      }
    );
  });
});

test("should throw error on bad config JSON filetype", () => {
  return new Promise((resolve) => {
    exec(
      "gorilla --input ./integs/test-files/not_a_file.ts --output ./integs/tmp/out.js --config ./integs/test-files/not_a_config",
      (_: string, __: string, stderr: string) => {
        expect(stderr).toContain(ERROR_MSG.EXPECT_JSON_FILE);
        resolve();
      }
    );
  });
});

test("should show warning for output filename", () => {
  return new Promise((resolve) => {
    exec(
      "gorilla --input ./integs/test-files/test_main.ts --output ./integs/tmp/out.js",
      (_: string, __: string, stderr: string) => {
        expect(stderr).toContain(WARN_MSG.EXPECT_GM_EXTENSION);
        resolve();
      }
    );
  });
});

test("should show warning for non-TypeScript input", () => {
  return new Promise((resolve) => {
    exec(
      "gorilla --input ./integs/test-files/test_main.ts --output ./integs/tmp/out.js",
      (_: string, __: string, stderr: string) => {
        expect(stderr).toContain(WARN_MSG.EXPECT_TYPESCRIPT);
        resolve();
      }
    );
  });
});

test("should create script with default config", () => {
  return new Promise((resolve) => {
    exec(
      "gorilla --input ./integs/test-files/test_main.ts --output ./integs/tmp/out.js",
      () => {
        resolve();
      }
    );
  }).then(async () => {
    const file = fs.readFileSync("./integs/tmp/out.js", "utf8");
    expect(file).toContain("New Userscript"); //Just assert name of config
  });
});

test("should create script with custom config", () => {
  return new Promise((resolve) => {
    exec(
      "gorilla --config ./integs/test-files/other_config.json --input ./integs/test-files/test_main.ts --output ./integs/tmp/out.js",
      () => {
        resolve();
      }
    );
  }).then(async () => {
    const file = fs.readFileSync("./integs/tmp/out.js", "utf8");
    expect(file).toContain("Other test script"); //Just assert name of config
  });
});
