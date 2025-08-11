import * as htmlToImage from 'html-to-image';

export const exportElementToPNG = async (element: HTMLElement, fileName = 'dashboard.png') => {
  const dataUrl = await htmlToImage.toPng(element, { cacheBust: true, pixelRatio: 2 });
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
};
