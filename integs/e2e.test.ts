const { exec } = require("child_process");
import * as fs from "fs";

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

test("should show warning for output filename", () => {
  return new Promise((resolve) => {
    exec(
      "gorilla --input ./integs/test-files/test_main.ts --output ./integs/tmp/out.js",
      (_: string, __: string, stderr: string) => {
        expect(stderr).toContain(
          "reaseMonkey scripts must end in '.user.js'. Consider renaming your output file."
        );
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
