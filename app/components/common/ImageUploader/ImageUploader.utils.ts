import type { Image } from './ImageUploader.types';

export function initializeImages(keys?: string[]): Image[] {
	return (keys ?? []).map(image => ({
		key: image,
		file: null,
		blob: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`,
		state: 'initial' as const
	}));
}
