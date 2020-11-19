import meow from 'meow';
import * as fs from 'fs';
import { rollup } from 'rollup';
import getBanner from './banner';
const typescript:Function = require('rollup-plugin-typescript');

//Use Meow for arg parsing and validation
const cli = meow(`
	Usage
	  $ gorilla

	Options
      --config, -c  Include a config
      --input, -i  Main input handler filename
	  --output, -c  Output filename

	Examples
	  $ gorilla --config
`, {
	flags: {
		config: {
			type: 'string',
			alias: 'c',
		},
        input: {
			type: 'string',
			alias: 'i',
            isRequired: true,
		},
        output: {
			type: 'string',
			alias: 'o',
            isRequired: true,
		}
	}
});

const { config, output, input } = cli.flags;

// Default to config, if not provided
const configFile = config && config !== "" ? config : 'config/default_config.json';

const configJSON = JSON.parse(fs.readFileSync(configFile, 'utf8'));

// Create banner text from config
const banner = getBanner(configJSON);

const rollupConfig = {
	input,
	output: {
		file: output,
		banner: banner,
		//format: "iife",
	},
	plugins: [typescript()]
}

// Call rollup
rollup(rollupConfig)
	.then(async bundle => {
		await bundle.generate(rollupConfig.output);
		return await bundle.write(rollupConfig.output);
	})
	.then(() => console.log('Gorilla smash complete!'));
