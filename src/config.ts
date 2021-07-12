import * as fs from "fs";
import { WARN_MSG } from "./constants";

const PACKAGE_JSON_LOCATION = "./package.json";
const PACKAGE_JSON_GORILLA_KEY = "gorilla";
const PACKAGE_JSON_KEYS = [
  "name",
  "version",
  "description",
  "author",
  "homepage",
  "copyright",
  "license",
];

/*
 * Attributes for all Metadata Block items:
 * https://wiki.greasespot.net/Metadata_Block
 */
export type GorillaConfig = {
  author?: string;
  description?: string;
  exclude?: string[];
  grant?: string[];
  icon?: string;
  include?: string[];
  match?: string[];
  name?: string;
  namespace?: string;
  noframes?: string;
  require?: string[];
  resource?: string[];
  updateURL?: string;
  downloadURL?: string;
  version?: string;
  [key: string]: undefined | string | string[]; //needed for lookup
};

export const VALID_GORILLA_CONFIG_KEYS = [
  "author",
  "description",
  "exclude",
  "grant",
  "icon",
  "include",
  "match",
  "name",
  "namespace",
  "noframes",
  "require",
  "resource",
  "version",
  "updateURL",
  "downloadURL",
];

/**
 * Priority:
 * 1. Input config
 * 2. package.json
 * @returns current GorillaConfig
 */
export const getConfig = (inputConfigLocation?: string): GorillaConfig => {
  const tmpConfig: GorillaConfig = {};

  // Config passed in by input
  if (inputConfigLocation && inputConfigLocation !== "") {
    try {
      const inputConfig = JSON.parse(
        fs.readFileSync(inputConfigLocation, "utf8")
      );
      Object.keys(inputConfig).forEach((key) => {
        tmpConfig[key] = inputConfig[key];
      });
    } catch (err) {
      console.error("Failed to parse input config", err);
    }
  }

  // Read `package.json`
  if (fs.existsSync(PACKAGE_JSON_LOCATION)) {
    const packageJSON = JSON.parse(
      fs.readFileSync(PACKAGE_JSON_LOCATION, "utf8")
    );

    // Read common keys
    PACKAGE_JSON_KEYS.forEach((key) => {
      if (packageJSON[key]) {
        if (!tmpConfig[key]) {
          tmpConfig[key] = packageJSON[key];
        }
      }
    });

    // Read valid Gorilla keys
    if (packageJSON[PACKAGE_JSON_GORILLA_KEY]) {
      VALID_GORILLA_CONFIG_KEYS.forEach((key) => {
        if (packageJSON[PACKAGE_JSON_GORILLA_KEY][key]) {
          tmpConfig[key] = packageJSON[PACKAGE_JSON_GORILLA_KEY][key];
        }
      });
    }
  }

  return tmpConfig;
};

/*
 * Fetch a GreaseMonkey-formatted banner text, which will
 * prepend the script itself.
 */
export const getBanner = (
  config: GorillaConfig,
  quiet: boolean = false
): string => {
  const invalidItems = Object.keys(config).filter(
    (key) => !VALID_GORILLA_CONFIG_KEYS.includes(key)
  );

  if (invalidItems.length > 0 && !quiet) {
    const msg = `${WARN_MSG.EXPECT_GM_KEYS} ${invalidItems.join(", ")}`;
    console.warn(msg);
  }

  const items = Object.keys(config)
    .map((key) => ({ key, value: config[key] }))
    .map((item) =>
      Array.isArray(item.value)
        ? item.value.map((inner) => ({ key: item.key, value: inner }))
        : item
    )
    .flatMap((i) => i);

  const scriptLines = items
    .map(({ key, value }) => {
      const tabs = key.length < 8 ? "\t\t\t" : "\t\t";
      return `// @${key}${value ? `${tabs}${value}` : ""}`;
    })
    .join("\n");
  return `
  // ==UserScript==
  ${scriptLines}
  //
  // Created with love using Gorilla
  // ==/UserScript==
  `;
};
