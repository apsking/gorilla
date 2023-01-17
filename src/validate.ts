import { meow } from "./meow";
import { HELP_MENU, ERROR_MSG, WARN_MSG } from "./constants";

const validate = () => {
  //Use Meow for arg parsing and validation
  const cli = meow(HELP_MENU, {
    flags: {
      config: {
        type: "string",
        alias: "c",
      },
      quiet: {
        type: "boolean",
        alias: "q",
        default: false,
      },
      minify: {
        type: "boolean",
        alias: "m",
        default: false,
      },
      input: {
        type: "string",
        alias: "i",
        isRequired: true,
      },
      output: {
        type: "string",
        alias: "o",
        isRequired: true,
      },
    },
  });

  const { input, output, config, quiet } = cli.flags;

  // Validate expected filetypes
  if (config && !config.endsWith(".json")) {
    throw ERROR_MSG.EXPECT_JSON_FILE;
  }

  if (!quiet && !input.endsWith(".ts")) {
    console.warn(WARN_MSG.EXPECT_TYPESCRIPT);
  }

  //Provide warning on output
  if (!quiet && !output.endsWith("user.js")) {
    console.warn(WARN_MSG.EXPECT_GM_EXTENSION);
  }

  return cli.flags;
};

export default validate;
