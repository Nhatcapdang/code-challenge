import Image from 'next/image';

export default function RootLoading() {
  return (
    <Image
      className="w-40 h-40 transform-center animate-pulse"
      src="/svgs/nhat-cap-dang-text.svg"
      alt="Nhat Cap Dang"
      width="0"
      height="0"
      sizes="(max-width: 768px) 36px, 124px"
      loading="lazy"
      unoptimized
    />
  );
}
