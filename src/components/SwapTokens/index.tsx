'use client';

import { useCallback, useState } from 'react';
import { delay } from 'lodash';
import {
  ArrowDownUp,
  ChevronDown,
  EqualApproximately,
  MoveRight,
  RefreshCcw,
  Settings,
} from 'lucide-react';
import {
  Button,
  Collapse,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
  LoadingOverlay,
  Modal,
  NumberInput,
  Popover,
  Select,
} from '@mantine/core';
import {
  useDebouncedState,
  useDisclosure,
  useSessionStorage,
} from '@mantine/hooks';
import {
  useOrderBook,
  usePoolToptrending24h,
  useSearchToken,
  useSwap,
} from '@/src/hooks/jup';
import { cn } from '@/src/utils/cn';
import { formatNumber } from '@/src/utils/common';
import CurrencyTransfer from '../swap/currency-transfer';
import { DefaultToken } from './defaultData';
import TokenInfo from './tokenInfo';

export default function SwapTokens() {
  const [slippage, setSlippage] = useState<number>(0.3);
  const [collapseOpened, { toggle: toggleCollapse }] = useDisclosure(false);
  const [isTransfer, { toggle: toggleTransfer }] = useDisclosure(false);

  const [selling, setSelling] = useSessionStorage<TPoolToptrending24h>({
    key: 'selling',
    defaultValue: DefaultToken,
  });
  const [buying, setBuying] = useSessionStorage<TPoolToptrending24h>({
    key: 'buying',
    defaultValue: DefaultToken,
  });
  const [amount, setAmount] = useDebouncedState<string | number | undefined>(
    undefined,
    400
  );

  const { mutate: mutateOrder, data: order, isPending } = useOrderBook();
  const { mutate: mutateSwap, isPending: isSwapPending } = useSwap();
  const onSelectToken = (
    type: 'selling' | 'buying',
    value: TPoolToptrending24h
  ) => {
    if (type === 'selling') {
      setSelling(value);
      mutateOrder({
        inputMint: value.baseAsset.id,
        outputMint: buying.baseAsset.id,
        amount: amount,
      });
    } else {
      setBuying(value);
      mutateOrder({
        inputMint: selling.baseAsset.id,
        outputMint: value.baseAsset.id,
        amount: amount,
      });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-400">
      <div className="relative max-w-[500px] w-full flex flex-col gap-2.5 bg-neutral-900 shadow-xl rounded-xl p-5">
        <LoadingOverlay
          visible={isSwapPending}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {isTransfer && (
          <CurrencyTransfer
            toggleTransfer={toggleTransfer}
            from={{
              inputAmount: order?.inAmount || '0',
              symbol: selling.baseAsset.symbol,
              price: order?.inUsdValue || '0',
              image: selling.baseAsset.icon,
            }}
            to={{
              outputAmount: order?.outAmount || '0',
              symbol: buying.baseAsset.symbol,
              price: order?.outUsdValue || '0',
              image: buying.baseAsset.icon,
            }}
          />
        )}
        <div className="flex items-center justify-between mb-2.5">
          <RefreshCcw
            className="bg-blue-500 rounded p-1 text-white"
            size={40}
          />
          <div className="flex items-center gap-2">
            <p className="text-right text-sm text-white">
              Slippage <br /> <span>{slippage}%</span>
            </p>
            <Popover width={300} position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Settings
                  className="bg-blue-500 rounded p-1  text-white cursor-pointer active:translate-y-0.5 transition-all duration-300"
                  size={40}
                />
              </Popover.Target>
              <Popover.Dropdown>
                <p className="text-sm font-bold">Trade slippage</p>
                <p className="text-xs text-gray-500 text-justify">
                  Set the allowed percentage difference between the quoted price
                  and actual execution price of your trade.
                </p>
                <div className="flex items-center  bg-amber-300 rounded ">
                  {[0.3, 0.5, 1.0, 1.2].map((item, idx) => (
                    <div
                      onClick={() => {
                        setSlippage(item);
                      }}
                      className={cn(
                        'p-2.5 cursor-pointer rounded flex-1 text-black text-center duration-200',
                        {
                          'bg-blue-600 text-white': slippage === item,
                        }
                      )}
                    >
                      {item}%
                    </div>
                  ))}
                </div>
              </Popover.Dropdown>
            </Popover>
          </div>
        </div>
        <div className="relative flex flex-col items-center gap-y-2">
          <InputToken
            type="selling"
            token={selling}
            selectToken={(value) => onSelectToken('selling', value)}
            amount={amount}
            setAmount={(value) => {
              setAmount(value);
              if (value === 0) return;
              mutateOrder({
                inputMint: selling.baseAsset.id,
                outputMint: buying.baseAsset.id,
                amount: value,
                decimals: selling.baseAsset.decimals,
              });
            }}
            usdValue={order?.inUsdValue}
            isLoading={false}
          />
          <ArrowDownUp
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500 bg-neutral-900 rounded-full p-2 border-3 border-neutral-700 cursor-pointer hover:text-white hover:bg-neutral-800 transition-all duration-300 active:rotate-180 "
            size={44}
            onClick={() => {
              const _selling = selling;
              const _buying = buying;
              setSelling(_buying);
              setBuying(_selling);
              mutateOrder({
                inputMint: _buying.baseAsset.id,
                outputMint: _selling.baseAsset.id,
                amount: order?.outAmount,
              });
            }}
          />
          <InputToken
            type="buying"
            token={buying}
            selectToken={(value) => onSelectToken('buying', value)}
            amount={order?.outAmount}
            usdValue={order?.outUsdValue}
            isLoading={isPending}
          />
        </div>
        <div
          onClick={toggleCollapse}
          className="cursor-pointer  flex items-center gap-2"
        >
          <p className="w-full text-xl font-bold text-white flex items-center gap-2">
            1 {selling.baseAsset.symbol} <EqualApproximately />{' '}
            {formatNumber({
              value: Number(order?.inUsdValue) / Number(order?.outUsdValue),
              digit: 4,
            })}{' '}
            {buying.baseAsset.symbol}
          </p>
          <ChevronDown
            className={cn('text-white transition-all duration-500', {
              'rotate-180': collapseOpened,
            })}
          />
        </div>
        <Collapse in={collapseOpened}>
          <div className="grid grid-cols-2 items-center justify-between gap-y-2">
            <p className="text-sm text-white">Estimated Fees</p>
            <p className="text-sm text-white text-right">$0.18 </p>
            <p className="text-sm text-white">Liquidity Provider</p>
            <p className="text-sm text-white text-right">$$0.17</p>
            <p className="text-sm text-white">Network</p>
            <p className="text-sm text-white text-right">&lt;$0.01</p>
            <div className="border-b border-gray-500/50" />
            <div className="border-b border-gray-500/50" />
            <p className="text-sm text-white">Price Impact</p>
            <p className="text-sm text-white text-right">&lt;0.1%</p>
            <p className="text-sm text-white">Slippage Tolerance</p>
            <p className="text-sm text-white text-right">{slippage}%</p>
            <p className="text-sm text-white">Receive at Least</p>
            <p className="text-sm text-white text-right">
              {' '}
              {formatNumber({
                value: Number(order?.outAmount),
                digit: 2,
              })}{' '}
              {buying.baseAsset.symbol}
            </p>
            <div className="border-b border-gray-500/50" />
            <div className="border-b border-gray-500/50" />
            <p className="text-sm text-white">Route</p>
            <p className="text-sm text-white text-right">1 Route</p>
            <p className="text-sm text-white flex items-center gap-2">
              {selling.baseAsset.symbol} <MoveRight /> {buying.baseAsset.symbol}
            </p>
            <p className="text-sm text-white text-right">100%</p>
          </div>
        </Collapse>
        <Button
          disabled={!amount}
          loading={isSwapPending}
          className={cn(
            'active:translate-y-0.5   w-full bg-blue-500 text-white rounded p-2.5 font-bold cursor-pointer hover:bg-blue-500/80 transition-all duration-300',
            {
              'opacity-50 cursor-not-allowed': false,
            }
          )}
          onClick={() => {
            mutateSwap(
              {
                inputMint: selling.baseAsset.id,
                outputMint: buying.baseAsset.id,
                amount: amount,
              },
              {
                onSuccess: () => {
                  toggleTransfer();
                },
              }
            );
          }}
        >
          Swap
        </Button>
        <TokenInfo {...selling} />
        <TokenInfo {...buying} />
      </div>
    </div>
  );
}
function InputToken({
  type,
  token,
  amount,
  usdValue,
  isLoading,
  selectToken,
  setAmount,
}: {
  type: 'selling' | 'buying';
  token: TPoolToptrending24h;
  amount?: string | number;
  usdValue?: number;
  isLoading: boolean;
  selectToken: (value: TPoolToptrending24h) => void;
  setAmount?: (value: string | number) => void;
}) {
  const { data: pools } = usePoolToptrending24h();
  const [opened, { open, close }] = useDisclosure(false);
  const renderOption = useCallback(
    (item: ComboboxLikeRenderOptionInput<ComboboxItem>) => {
      const option = item.option as TPoolToptrending24h & ComboboxItem;
      return <TokenInfo {...option} />;
    },
    []
  );
  return (
    <div className="w-full">
      <Modal
        opened={opened}
        onClose={close}
        title="Select Token"
        centered
        styles={{
          content: {
            height: '600px',
          },
        }}
      >
        <Select
          searchable
          onChange={(_value, option) => {
            const _option = option as TPoolToptrending24h & ComboboxItem;
            selectToken(_option);
            close();
          }}
          data={pools}
          defaultDropdownOpened
          maxDropdownHeight={400}
          renderOption={renderOption}
        />
      </Modal>
      <div
        className={cn(
          'flex min-h-[119px] flex-col space-y-2 rounded-xl border px-4 py-3 focus-within:border-primary/50 focus-within:shadow-swap-input-dark  bg-neutral-900/90 text-white',
          {
            'disabled cursor-not-allowed': type === 'buying',
          }
        )}
      >
        <p className="capitalize">{type}</p>
        <div className="flex items-center gap-2 justify-between">
          <Button
            onClick={() => {
              open();
            }}
            variant="light"
            justify="space-between"
            classNames={{
              label: 'uppercase',
            }}
            className="max-w-[200px]"
            fullWidth
            leftSection={
              <img
                src={token.baseAsset.icon || 'https://picsum.photos/30'}
                alt="token"
                width={24}
                height={24}
                className="shrink-0 rounded-full object-contain"
                loading="lazy"
              />
            }
            rightSection={<ChevronDown />}
          >
            {token.baseAsset.symbol}
          </Button>
          <div className="w-full">
            <NumberInput
              disabled={type === 'buying'}
              value={amount}
              onChange={setAmount}
              unstyled
              classNames={{
                wrapper: 'w-full',
                input: cn(
                  'border-0 w-full focus-visible:ring-0 focus-visible:outline-none text-right',
                  {
                    'disabled:cursor-not-allowed ': type === 'buying',
                    'animate-pulse': isLoading,
                  }
                ),
              }}
              className="w-full bg-transparent text-right placeholder:text-neutral-600 disabled:cursor-not-allowed disabled:text-neutral-500 disabled:opacity-100 h-[38px] font-semibold outline-none text-xl md:text-2xl"
              thousandSeparator=","
              hideControls
              maxLength={20}
              decimalScale={2}
              placeholder="0"
            />
            <p className="text-right text-neutral-500">
              $
              {formatNumber({
                value: usdValue,
                digit: 3,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
