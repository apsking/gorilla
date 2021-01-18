import * as M from "./meow"; // = require('meow');
import validate from "./validate";
import sinon from "sinon";
import { ERROR_MSG, WARN_MSG } from "./constants";

const sandbox = sinon.createSandbox();
let stubMeow: sinon.SinonStub;
let spyConsole: sinon.SinonStub;

beforeEach(() => {
  stubMeow = sandbox.stub(M, "meow");
  spyConsole = sandbox.stub(console, "warn");
});

afterEach(() => {
  sandbox.restore();
});

test("validates input is a ts file", () => {
  stubMeow.returns({
    flags: {
      input: "test.js",
      output: "test.user.js",
    },
    input: [],
    unnormalizedFlags: {},
    pkg: {},
    help: "",
    showHelp: () => {},
    showVersion: () => {},
  });

  validate();

  expect(spyConsole.args[0][0]).toEqual(WARN_MSG.EXPECT_TYPESCRIPT);
});

test("validates output is is a GreaseMonkey extension", () => {
  stubMeow.returns({
    flags: {
      input: "test.ts",
      output: "test.other.extension",
    },
    input: [],
    unnormalizedFlags: {},
    pkg: {},
    help: "",
    showHelp: () => {},
    showVersion: () => {},
  });

  validate();

  expect(spyConsole.args[0][0]).toEqual(WARN_MSG.EXPECT_GM_EXTENSION);
});

test("throws exception with invalid config", () => {
  stubMeow.returns({
    flags: {
      input: "test.ts",
      output: "test.user.js",
      config: "test.other.extension",
    },
    input: [],
    unnormalizedFlags: {},
    pkg: {},
    help: "",
    showHelp: () => {},
    showVersion: () => {},
  });

  try {
    validate();
  } catch (e) {
    expect(e).toEqual(ERROR_MSG.EXPECT_JSON_FILE);
  }
});

test("validates output w/o any warnings", () => {
  stubMeow.returns({
    flags: {
      input: "test.ts",
      output: "test.user.js",
    },
    input: [],
    unnormalizedFlags: {},
    pkg: {},
    help: "",
    showHelp: () => {},
    showVersion: () => {},
  });

  validate();

  expect(spyConsole.called).toEqual(false);
});
