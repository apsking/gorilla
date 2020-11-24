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
  version?: string;
  [key: string]: undefined | string | string[]; //needed for lookup
};

/*
 * Fetch a GreaseMonkey-formatted banner text, which will
 * prepend the script itself.
 */
const getBanner = (config: GorillaConfig): string => {
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
