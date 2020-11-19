import meow from 'meow';
import * as fs from 'fs';
import { rollup } from 'rollup';
import getBanner, { DEFAULT_CONFIG } from './banner';
const typescript = require('rollup-plugin-typescript');

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
const configJSON = config && config !== "" ?
	JSON.parse(fs.readFileSync(config, 'utf8')) :
	DEFAULT_CONFIG;


// Create banner text from config
const banner = getBanner(configJSON);

const rollupConfig = {
	input,
	output: {
		file: output,
		banner: banner,
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
