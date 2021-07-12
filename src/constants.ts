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

export const ERROR_MSG = {
  EXPECT_JSON_FILE: "Gorilla configs must be a JSON file",
  EXPECT_VALID_KEY: "Invalid gorilla config key(s):",
};

export const WARN_MSG = {
  EXPECT_TYPESCRIPT:
    "Gorilla recommends that your input files be written in TypeScript",
  EXPECT_GM_EXTENSION:
    "GreaseMonkey scripts must end in '.user.js'. Consider renaming your output file.",
  EXPECT_GM_KEYS:
    "GreaseMonkey script includes keys that GreaseMonkey does not support: ",
};
