import { ERROR_MSG } from "./constants";
/*
 * Attributes for all Metadata Block items:
 * https://wiki.greasespot.net/Metadata_Block
 */
type GorillaConfig = {
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

const VALID_KEYS = [
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

/*
 * Fetch a GreaseMonkey-formatted banner text, which will
 * prepend the script itself.
 */
const getBanner = (config: GorillaConfig): string => {
  const invalidItems = Object.keys(config).filter(
    (key) => !VALID_KEYS.includes(key)
  );

  if (invalidItems.length > 0) {
    const msg = `${ERROR_MSG.EXPECT_VALID_KEY} ${invalidItems.join(", ")}`;
    throw msg;
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

export default getBanner;
