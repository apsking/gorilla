export const HELP_MENU = `
  Usage
    $ gorilla

  Options
 --config, -c  Custom GreaseMonkey config
 --input, -i  (required) Input filename
    --output, -o  (required) Output filename

  Examples
    $ gorilla --input ./my-script.ts --output ./my-script.user.js
`;

export const DEFAULT_CONFIG = {
  name: "New Userscript",
  namespace: "http://tampermonkey.net/",
  version: "0.1",
  description: "Gorilla-built, rock-solid, Monkey script",
  updateURL: "",
  downloadURL: "",
  author: "You",
  include: ["https://**"],
};

export const ERROR_MSG = {
  EXPECT_JSON_FILE: "Gorilla configs must be a JSON file",
  EXPECT_VALID_KEY: "Invalid gorilla config key(s):",
};

export const WARN_MSG = {
  EXPECT_TYPESCRIPT:
    "Gorilla recommends that your input files be written in TypeScript",
  EXPECT_GM_EXTENSION:
    "GreaseMonkey scripts must end in '.user.js'. Consider renaming your output file.",
};
