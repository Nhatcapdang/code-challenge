import { Avatar, AvatarFallback, AvatarImage } from '../ui';

export const AvatarKit = ({
  image,
  name,
  symbol,
}: {
  image: string;
  name: string;
  symbol: string;
}) => {
  return (
    <Avatar className="size-6">
      <AvatarImage
        src={image || 'https://placehold.co/300'}
        alt={name}
        loading="lazy"
      />
      <AvatarFallback>
        {(symbol || name || 'T').toString().slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
