import { getBanner } from "./config";
import { ERROR_MSG } from "./constants";

test("handles empty config", () => {
  const config = {};

  const output = getBanner(config);
  expect(output).toEqual(`
// ==UserScript==

//
// Created with love using Gorilla
// ==/UserScript==
`);
});

test("handles invalid config key", () => {
  const config = {
    invalid: "key",
  };

  try {
    getBanner(config);
  } catch (err) {
    expect(err).toContain(ERROR_MSG.EXPECT_VALID_KEY);
  }
});
