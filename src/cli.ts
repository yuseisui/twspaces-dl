#!/usr/bin/env node

import {program} from 'commander';
import {download} from './download.js';
import type {CliOptions} from './types';

program
	.name('twspaces-dl')
	.argument('<url>', 'Space URL or Tweet URL')
	.option('-f, --force', 'overwrite existing file')
	.action(async (url: string, options: CliOptions) => {
		try {
			await download(url, {
				overwrite: options.force ?? false,
			});
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	});

await program.parseAsync();
