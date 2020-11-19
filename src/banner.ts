// Attributes for all MetaBlock items
// https://wiki.greasespot.net/Metadata_Block
type GorillaConfig = {
    author?: string,
    description?: string,
    exclude?: string[],
    grant?: string[],
    icon?: string,
    include?: string[],
    match?: string[],
    name?: string,
    namespace?: string,
    noframes?: string,
    require?: string[],
    resource?: string[],
    version?: string,
    [key:string]: undefined|string|string[], //needed for lookup
}
const getBanner = (config:GorillaConfig):string => {
    const items = Object.keys(config)
        .map(key => ({key, value: config[key]}))
        .map((item) => {
            if (Array.isArray(item.value)) {
                return item.value
                    .map(inner => ({ key: item.key, value: inner }))
            } else {
                return item
            }
        })
        .flatMap(i => i);

    const scriptLines = items
        .map(({key, value}) => `// @${key}    ${value}`)
        .join('\n');
    return `
// ==UserScript==
${scriptLines}
// Created with love using Gorilla
// ==/UserScript==
`
};

export default getBanner;
