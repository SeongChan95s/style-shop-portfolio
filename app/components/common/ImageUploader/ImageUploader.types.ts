export interface ImageBase {
	key: string;
	file: File | null;
	blob: string;
	state: 'initial' | 'uploaded' | 'deleted' | 'existing';
}

export type Image =
	| (ImageBase & { state: 'initial' | 'deleted' | 'existing'; file: null })
	| (ImageBase & { state: 'uploaded'; file: File });

export type ImageUploaderBaseProps = {
	name?: string;
	value: Image[];
	onChange: (images: Image[]) => void;
	onFormData?: (formData: FormData) => void;
	maxCount?: number;
	startPath: string;
	maxSizeMB?: number;
	acceptExts?: string[];
	gallery?: {
		enabled: boolean;
		path: string;
	};
};

export type ImageUploaderProps =
	| (ImageUploaderBaseProps & { swiper: true; dragdrop?: false })
	| (ImageUploaderBaseProps & { swiper?: false; dragdrop: true })
	| (ImageUploaderBaseProps & { swiper?: false; dragdrop?: false });
