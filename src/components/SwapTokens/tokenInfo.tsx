import React, { memo } from 'react';
import { Check, Copy } from 'lucide-react';
import { ComboboxItem } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { cn } from '@/src/utils/cn';
import { formatNumber } from '@/src/utils/common';

const TokenInfo = memo(({ baseAsset }: TPoolToptrending24h) => {
  const clipboard = useClipboard({ timeout: 500 });
  return (
    <div className="flex items-center gap-2 justify-between w-full">
      <div className="flex items-center gap-2">
        <img
          src={baseAsset.icon || 'https://picsum.photos/30'}
          alt="token"
          width={30}
          height={30}
          loading="lazy"
          className="rounded-full"
        />
        <div>
          <p>
            <span className="font-bold text-blue-500">{baseAsset.symbol}</span>{' '}
            <span className="text-xs text-blue-500">{baseAsset.name}</span>
          </p>
          <p
            className={cn(
              'flex items-center gap-1 bg-gray-500 p-0.5 rounded text-sm cursor-pointer w-fit'
            )}
            onClick={(e) => {
              e.stopPropagation();
              clipboard.copy(baseAsset.id);
            }}
          >
            {baseAsset.id.slice(0, 8)}...{baseAsset.id.slice(-8)}{' '}
            <span>
              {clipboard.copied ? <Check size={16} /> : <Copy size={16} />}
            </span>
          </p>
        </div>
      </div>
      <p className="text-lg font-bold text-white">
        $
        {formatNumber({
          value: baseAsset.usdPrice,
          digit: 2,
        })}
      </p>
    </div>
  );
});
export default TokenInfo;
