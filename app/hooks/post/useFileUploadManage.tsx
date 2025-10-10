import { getFileFormat } from '@/app/utils/utils';
import { useState } from 'react';

export default function useFileUploadManage(exisitingImage: string[]) {
	const images = exisitingImage ?? [];
	const [changedImages, setChangedImages] = useState<string[]>(images ?? []);
	const [thumbs, setThumbs] = useState<string[]>(
		exisitingImage.map(thumb => `${process.env.NEXT_PUBLIC_IMAGE_URL}/${thumb}`) ?? []
	);

	const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files == null) return;

		const addedFiles = Array.from(e.target.files);

		// 추가된 이미지에 대해 미리보기 blob 파일 변환
		const blobs = addedFiles.map(file => window.URL.createObjectURL(file));
		setThumbs(thumb => [...thumb, ...blobs]);

		let addedFileNames = addedFiles.map(file => file.name);
		addedFileNames = addedFileNames.map(fileName => {
			const format = getFileFormat(fileName);
			fileName = `reviews/${fileName}`;
			return fileName.replace(`.${format}`, `_${Date.now()}.${format}`);
		});

		setChangedImages(image => [...image, ...addedFileNames]);
	};

	const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const target = e.target as HTMLButtonElement;
		const index = Number(target.getAttribute('data-index')) as number;
		const copyThumbs = [...thumbs.slice(0, index), ...thumbs.slice(index + 1)];
		setThumbs(copyThumbs);
		const copyImages = [
			...changedImages.slice(0, index),
			...changedImages.slice(index + 1)
		];
		setChangedImages(copyImages);
	};

	const addedImages = changedImages.filter(image => !images.includes(image)); // 추가된 이미지

	const removedImages = images.filter(image => !changedImages.includes(image)); // 삭제된 이미지

	return { changedImages, addedImages, removedImages, thumbs, changeImage, removeImage };
}
