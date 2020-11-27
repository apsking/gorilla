const { exec } = require("child_process");
import * as fs from "fs";
import { ERROR_MSG, WARN_MSG } from "../src/constants";

const execPromise = (
  execStr: string
): Promise<{
  err: string;
  stdout: string;
  stderr: string;
  resolve: any;
  reject: any;
}> => {
  return new Promise((resolve, reject) => {
    exec(execStr, (err: string, stdout: string, stderr: string) => {
      resolve({ err, stdout, stderr, resolve, reject });
    });
  });
};

// Remove all temp files before each run
beforeEach(async () => {
  await execPromise("rm ./integs/tmp/*");
});

test("should show help menu", async () => {
  const { stdout } = await execPromise("gorilla --help");

  expect(stdout).toContain(
    "Gorilla: Stop monkeying around and build better scripts."
  );
});

test("should throw error on unknown file", async () => {
  const { stderr } = await execPromise(
    "gorilla --input ./integs/test-files/not_a_file.ts --output ./integs/tmp/out.js"
  );
  expect(stderr).toContain("Could not resolve entry module");
});

test("should throw error on bad config JSON filetype", async () => {
  const { stderr } = await execPromise(
    "gorilla --input ./integs/test-files/not_a_file.ts --output ./integs/tmp/out.js --config ./integs/test-files/not_a_config"
  );
  expect(stderr).toContain(ERROR_MSG.EXPECT_JSON_FILE);
});

test("should throw error on bad gorilla config key", async () => {
  const { stderr } = await execPromise(
    "gorilla --input ./integs/test-files/test_main.ts --output ./integs/tmp/out.js --config ./integs/test-files/invalid_config.json"
  );
  expect(stderr).toContain(ERROR_MSG.EXPECT_VALID_KEY);
});

test("should show warning for output filename", async () => {
  const { stderr } = await execPromise(
    "gorilla --input ./integs/test-files/test_main.ts --output ./integs/tmp/out.js"
  );
  expect(stderr).toContain(WARN_MSG.EXPECT_GM_EXTENSION);
});

test("should show warning for non-TypeScript input", async () => {
  const { stderr } = await execPromise(
    "gorilla --input ./integs/test-files/test_main.js --output ./integs/tmp/out.js"
  );
  expect(stderr).toContain(WARN_MSG.EXPECT_TYPESCRIPT);
});

test("should create script with default config", async () => {
  await execPromise(
    "gorilla --input ./integs/test-files/test_main.ts --output ./integs/tmp/out.js"
  );
  const file = fs.readFileSync("./integs/tmp/out.js", "utf8");
  expect(file).toContain("New Userscript"); //Just assert name of config
});

test("should create script with custom config", async () => {
  await execPromise(
    "gorilla --config ./integs/test-files/other_config.json --input ./integs/test-files/test_main.ts --output ./integs/tmp/out.js"
  );
  const file = fs.readFileSync("./integs/tmp/out.js", "utf8");
  expect(file).toContain("Other test script"); //Just assert name of config
});
