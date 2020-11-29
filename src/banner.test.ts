import getBanner from "./banner";
import { DEFAULT_CONFIG, ERROR_MSG } from "./constants";

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

test("handles default config", () => {
  const output = getBanner(DEFAULT_CONFIG);
  expect(output).toEqual(`
// ==UserScript==
// @name			New Userscript
// @namespace		http://tampermonkey.net/
// @version			0.1
// @description		Gorilla-built, rock-solid, Monkey script
// @updateURL
// @downloadURL
// @author			You
// @include			https://**
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
