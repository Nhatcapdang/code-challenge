'use client';

import { memo, useCallback, useId, useMemo, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useCommandState } from 'cmdk';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useDebounce } from 'react-use';
import { AvatarKit } from '../kit/avatar';
import { Spinner } from './spinner';

export type ComboboxItem<T extends object> = T & {
  image: string;
  name: string;
  symbol: string;
  description: string;
  [key: string]: unknown;
};

type SelectComboboxProps<T extends object> = {
  label?: string;
  placeholder?: string;
  className?: string;
  data: ComboboxItem<Partial<T>>[];
  value?: ComboboxItem<T> | null;
  isLoading?: boolean;
  onSelect?: (token: ComboboxItem<T>) => void;
  /**
   * This is triggered when the user searches for a item that doesn't exist in the data list.
   */
  onNotFound?: (search: string) => void;
  onScrollEnd?: () => void;
};

const CommandSearchHandler = ({
  onNotFound,
}: {
  onNotFound?: (search: string) => void;
}) => {
  const search = useCommandState(state => state.search);
  const filteredCount = useCommandState(state => state.filtered.count);

  useDebounce(
    () => {
      if (search && filteredCount === 0 && onNotFound) {
        onNotFound(search);
      }
    },
    1000,
    [search, filteredCount, onNotFound]
  );

  return null;
};

const SelectCombobox = <T extends object>({
  label,
  placeholder = 'Select item',
  className,
  data,
  value,
  isLoading,
  onSelect,
  onNotFound,
}: SelectComboboxProps<T>) => {
  const id = useId();
  const [open, setOpen] = useState(false);

  // const [selectedItem, setSelectedItem] = useState<ComboboxItem<T> | null>(
  //   null
  // );

  const handleSelectToken = useCallback(
    (token: ComboboxItem<T>) => {
      onSelect?.(token);
    },
    [onSelect]
  );

  const memoizedData = useMemo(() => {
    return data.map((item, idx) => (
      <CommandItem
        keywords={[item.name || '', item.symbol || '', item.description || '']}
        key={`${idx}-${item.name}-${item.symbol}-${item.description}`.replace(
          /\s+/g,
          '-'
        )}
        value={item.name}
        onSelect={() => handleSelectToken(item as ComboboxItem<T>)}
      >
        <RenderItem
          description={item.description}
          name={item.name}
          symbol={item.symbol}
          image={item.image}
          checked={value?.name === item.name}
        />
      </CommandItem>
    ));
  }, [data, handleSelectToken, value]);

  return (
    <div className={cn('w-full max-w-xl space-y-2', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            size="lg"
          >
            {value ? (
              <RenderTrigger
                image={value.image}
                name={value.name}
                symbol={value.symbol}
                description={value.description}
              />
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] overflow-auto p-0 ">
          <Command>
            <CommandSearchHandler onNotFound={onNotFound} />
            <CommandInput placeholder="Search token by name, symbol or mint address" />
            <CommandList>
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center gap-2 justify-center ">
                    <Spinner className="size-6" />
                    Loading tokens…
                  </div>
                ) : (
                  'No tokens found.'
                )}
              </CommandEmpty>
              {memoizedData}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectCombobox;

const RenderItem = memo(
  ({
    description,
    name,
    symbol,
    image,
    checked = false,
  }: {
    description: string;
    name: string;
    symbol: string;
    image: string;
    checked?: boolean;
  }) => {
    return (
      <div className="flex gap-2 w-full items-center">
        <AvatarKit image={image} name={name} symbol={symbol} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 px-1">
            <span className="font-medium">{name || 'Unknown'}</span>
            <span className="text-muted-foreground text-xs">{symbol}</span>
          </div>

          <div className="mt-1 text-xs text-muted-foreground truncate">
            {description}
          </div>
        </div>
        {checked && <CheckIcon size={16} className="ml-auto" />}
      </div>
    );
  }
);

RenderItem.displayName = 'RenderItem';

const RenderTrigger = memo(
  ({
    image,
    name,
    symbol,
    description,
  }: {
    image: string;
    name: string;
    symbol: string;
    description: string;
  }) => {
    return (
      <span className="flex gap-2 items-center truncate">
        <Avatar className="size-6">
          <AvatarImage src={image} alt={name} loading="lazy" />
          <AvatarFallback>
            {(symbol || name || 'T').toString().slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="flex flex-col text-left">
          <span className="font-medium leading-tight">
            {name || symbol}
            {symbol && ` (${symbol})`}
          </span>
          <span className="text-muted-foreground text-xs font-mono truncate">
            {description}
          </span>
        </span>
      </span>
    );
  }
);

RenderTrigger.displayName = 'RenderTrigger';
