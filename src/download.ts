/* eslint-disable @typescript-eslint/naming-convention */

// import {open} from 'node:fs/promises';
import {findSpaceByUrl, getLiveStreamMetadata} from 'twspaces';
import {$} from 'execa';
import type {DownloadOptions} from './types';

export const download = async (url: string, options?: DownloadOptions) => {
	const {metadata} = await findSpaceByUrl(url);

	if (metadata === undefined) {
		throw new Error('Space details not available');
	}

	if (!metadata.is_space_available_for_replay) {
		throw new Error('Space is not available for replay');
	}

	const {source} = await getLiveStreamMetadata(metadata.media_key);
	const outFile = `${metadata.rest_id}.m4a`;

	// if (!options?.overwrite) {
	// 	// Throw an error if the file exists
	// 	const file = await open(outFile, 'wx');
	// 	await file.close();
	// }

	// const cmd = ffmpeg({
	// 	level: LogLevel.Quiet,
	// 	overwrite: true,
	// });

	// const input = cmd.input(source.location);
	// const {duration} = await input.probe({
	// 	args: ['-loglevel', 'quiet'],
	// });

	const coverImage =
		metadata.creator_results.result.legacy.profile_image_url_https.replace(
			/_[A-Za-z\d]+(\.[A-Za-z\d]+)$/,
			'$1',
		);

	// cmd.input(coverImage);

	// cmd.output(outFile)
	// 	.codec('copy')
	// 	.args('-disposition:v:0', 'attached_pic')
	// 	.metadata({
	// 		title: metadata.title,
	// 		artist: metadata.creator_results.result.legacy.name,
	// 		album: 'Twitter Spaces',
	// 		date: new Date(metadata.created_at).toISOString(),
	// 		creation_time: new Date().toISOString(),
	// 		episode_id: metadata.rest_id,
	// 	});

	// const proc = await cmd.spawn();
	// const bar = new cliProgress.SingleBar({
	// 	stopOnComplete: true,
	// });

	// bar.start(duration, 0);

	// for await (const {time} of proc.progress()) {
	// 	bar.update(time);
	// }

	// await proc.complete();

	await $({stderr: 'inherit'})`ffmpeg ${
		options?.overwrite ? '-y' : '-n'
	} -i ${
		source.location
	} -i ${coverImage} -c copy -disposition:v:0 attached_pic ${outFile}`;
};
