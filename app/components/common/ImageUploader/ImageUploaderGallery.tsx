'use client';

import { getPathFiles } from '@/app/services/s3';
import { useQuery } from '@tanstack/react-query';
import styles from './ImageUploader.module.scss';
import Image from 'next/image';
import { useEffect } from 'react';
import { useImageUploaderStore } from './ImageUploader.store';

interface ImageUploaderGalleryProps {
	path: string;
}

export default function ImageUploaderGallery({ path }: ImageUploaderGalleryProps) {
	const { data, isError, isPending } = useQuery({
		queryFn: () => getPathFiles(path),
		queryKey: [path]
	});

	useEffect(() => {
		if (data && data.success) {
			useImageUploaderStore.getState().setGallery(data.data);
		}
	}, [data]);

	if (isPending || isError || !data || !data.success || !data.data) return <></>;
	const srcs = data.data;

	return (
		<div className={styles.gallery}>
			<h5>기존 이미지</h5>
			<div className={styles.imageWrap}>
				{srcs.map((src: string, i: number) => (
					<div className={styles.item} key={i}>
						<Image
							src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${src}`}
							alt={`이미지 미리보기`}
							fill
							sizes="30%"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
