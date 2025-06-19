'use client';

import { memo, useEffect, useState } from 'react';
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  CircleX,
  Copy,
  EqualApproximately,
  MoveRight,
  RefreshCcw,
  Settings,
  Wallet,
} from 'lucide-react';
import {
  Collapse,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
  Modal,
  NumberInput,
  Popover,
  Select,
} from '@mantine/core';
import {
  useClipboard,
  useDebouncedState,
  useDebouncedValue,
  useDisclosure,
  useSessionStorage,
} from '@mantine/hooks';
import {
  useSwapQuoteMutation,
  useTokens,
  useTokensWithPriceMutation,
} from '@/src/hooks/tokens';
import { cn } from '@/src/utils/cn';
import { formatNumber } from '@/src/utils/common';
import CurrencyTransfer from './currency-transfer';
import { DefaultTokens, SelectDropdownItem } from './data';

const Swap = () => {
  const [slippage, setSlippage] = useState<number>(0.3);
  const [tokens, setTokens] = useSessionStorage({
    key: 'swapTokens',
    defaultValue: {
      pay: DefaultTokens[0],
      receive: DefaultTokens[1],
    },
  });
  const [amount, setAmount] = useDebouncedState<{
    pay: string;
    receive: string;
  }>(
    {
      pay: '0',
      receive: '0',
    },
    400
  );

  const { data: swapQuote, mutate: mutateSwapQuote } = useSwapQuoteMutation();
  const { data: tokensWithPrice = [], mutate: mutateTokensWithPrice } =
    useTokensWithPriceMutation();

  useEffect(() => {
    mutateTokensWithPrice([tokens.pay.address, tokens.receive.address]);
    mutateSwapQuote({
      from: tokens.pay.address,
      to: tokens.receive.address,
      amount: amount.pay,
    });
  }, [
    tokens.pay.address,
    tokens.receive.address,
    mutateTokensWithPrice,
    mutateSwapQuote,
    amount.pay,
  ]);

  useEffect(() => {
    if (swapQuote?.swap) {
      setAmount({
        pay: swapQuote.swap.inputAmount,
        receive: swapQuote.swap.outputAmount,
      });
    }
  }, [swapQuote?.swap, setAmount]);

  const [isTransfer, { toggle: toggleTransfer }] = useDisclosure(false);
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-950">
      <div className="max-w-2xl w-full relative">
        {isTransfer && (
          <CurrencyTransfer
            toggleTransfer={toggleTransfer}
            from={{
              inputAmount: swapQuote?.swap?.inputAmount || '0',
              symbol: tokens.pay.metadata.symbol,
              price: tokensWithPrice[0]?.priceUsdc || '0',
              image: tokens.pay.metadata.image,
            }}
            to={{
              outputAmount: swapQuote?.swap?.outputAmount || '0',
              symbol: tokens.receive.metadata.symbol,
              price: tokensWithPrice[1]?.priceUsdc || '0',
              image: tokens.receive.metadata.image,
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
        <div className="bg-blue-500/15 p-5 rounded flex flex-col gap-2.5">
          <div className=" rounded flex flex-col gap-2.5 relative">
            <Input
              type="pay"
              value={tokens.pay}
              onChange={(value) => {
                setTokens({ ...tokens, pay: value });
              }}
              amount={amount.pay}
              setAmount={(value) => {
                setAmount({ ...amount, pay: value });
              }}
            />
            <ArrowDownUp
              className="active:translate-y-0.5 transition-all duration-300 absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-blue-500 rounded p-1"
              size={40}
              onClick={() => {
                setTokens({
                  ...tokens,
                  pay: tokens.receive,
                  receive: tokens.pay,
                });
                setAmount({
                  ...amount,
                  pay: amount.receive,
                  receive: amount.pay,
                });
              }}
            />
            <Input
              type="receive"
              value={tokens.receive}
              onChange={(value) => {
                setTokens({ ...tokens, receive: value });
              }}
              amount={amount.receive}
              setAmount={(value) => {
                setAmount({ ...amount, receive: value });
              }}
            />
          </div>
          <div className="items-start gap-x-2 flex relative w-full rounded-md py-2.5 px-3 border border-red-500 text-sm border-error-border-50% text-error [&>svg]:text-error">
            <CircleX className="text-red-500" />
            <p className="text-red-500 font-medium">
              You need at least{' '}
              {formatNumber({
                value: Number(amount.pay),
                digit: 2,
              })}{' '}
              {tokens.pay.metadata.symbol} to make this purchase
            </p>
          </div>
          <div
            onClick={toggle}
            className="cursor-pointer  flex items-center gap-2"
          >
            <p className="w-full text-xl font-bold text-white flex items-center gap-2">
              1 {tokens.pay.metadata.symbol} <EqualApproximately />{' '}
              {formatNumber({
                value:
                  Number(tokensWithPrice[0]?.priceUsdc) /
                  Number(tokensWithPrice[1]?.priceUsdc),
                digit: 4,
              })}{' '}
              {tokens.receive.metadata.symbol}
            </p>
            <ChevronDown
              className={cn('text-white transition-all duration-500', {
                'rotate-180': opened,
              })}
            />
          </div>
          <Collapse in={opened}>
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
                  value: Number(amount.receive),
                  digit: 2,
                })}{' '}
                {tokens.receive.metadata.symbol}
              </p>
              <div className="border-b border-gray-500/50" />
              <div className="border-b border-gray-500/50" />
              <p className="text-sm text-white">Route</p>
              <p className="text-sm text-white text-right">1 Route</p>
              <p className="text-sm text-white flex items-center gap-2">
                {tokens.pay.metadata.symbol} <MoveRight />{' '}
                {tokens.receive.metadata.symbol}
              </p>
              <p className="text-sm text-white text-right">100%</p>
            </div>
          </Collapse>
          <button
            className={cn(
              'active:translate-y-0.5   w-full bg-blue-500 text-white rounded p-2.5 font-bold cursor-pointer hover:bg-blue-500/80 transition-all duration-300',
              {
                'opacity-50 cursor-not-allowed': false,
              }
            )}
            onClick={toggleTransfer}
          >
            Swap
          </button>
        </div>
        <TokenInfo
          metadata={tokensWithPrice?.[0]?.metadata}
          address={tokensWithPrice?.[0]?.address}
          priceUsdc={tokensWithPrice?.[0]?.priceUsdc || '0'}
        />
        <TokenInfo
          metadata={tokensWithPrice?.[1]?.metadata}
          address={tokensWithPrice?.[1]?.address}
          priceUsdc={tokensWithPrice?.[1]?.priceUsdc || '0'}
        />
      </div>
    </div>
  );
};
export default Swap;

const Input = ({
  value,
  type,
  amount,
  onChange,
  setAmount,
}: {
  value: SelectDropdownItem;
  type: 'pay' | 'receive';
  amount: string;
  setAmount: (value: string) => void;
  onChange: (value: SelectDropdownItem) => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: tokens } = useTokens();
  const [searchValue, setSearchValue] = useState('');
  const [debounced] = useDebouncedValue(searchValue, 400);
  const renderOption = (item: ComboboxLikeRenderOptionInput<ComboboxItem>) => {
    const { metadata, address } = item.option as unknown as TTokenData;
    return <TokenInfo metadata={metadata} address={address} priceUsdc={'0'} />;
  };
  return (
    <div className="p-2.5 rounded bg-blue-500">
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
          onSearchChange={setSearchValue}
          onChange={(_value, option) => {
            const selectedOption = option as SelectDropdownItem;
            close();
            onChange(selectedOption);
          }}
          data={tokens}
          defaultDropdownOpened
          maxDropdownHeight={400}
          renderOption={renderOption}
        />
      </Modal>
      <div className="p-2.5 rounded bg-white flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3.5 font-bold">
          <p className="w-full capitalize">{type}</p>
          <p hidden={type === 'receive'} className="w-fit">
            Half
          </p>
          <p hidden={type === 'receive'} className="w-fit">
            Max
          </p>
        </div>
        <div className="flex items-center gap-2 font-bold">
          <NumberInput
            unstyled
            classNames={{
              wrapper: 'w-full',
              input:
                'border-0 w-full focus-visible:ring-0 focus-visible:outline-none',
            }}
            className="flex h-9 w-full bg-transparent transition disabled:cursor-not-allowed px-0 py-0 border-0 focus-visible:outline-none focus-visible:ring-0 text-ellipsis text-primary disabled:text-tertiary placeholder:text-tertiary drop-shadow-drop-shadow-3 text-3xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            thousandSeparator=","
            defaultValue={0}
            hideControls
            maxLength={20}
            decimalScale={5}
            value={amount}
            onChange={(value) => {
              setAmount(value.toString());
            }}
          />
          <div
            onClick={open}
            className=" cursor-pointer flex items-center justify-between gap-2 rounded bg-blue-500 p-2.5 min-w-fit max-w-[200px] "
          >
            <img
              src={value?.metadata.image}
              alt="solana"
              width={20}
              height={20}
              loading="lazy"
            />
            <h1 className="text-white">{value?.metadata.symbol}</h1>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3.5 font-bold">
          <p className="w-full">$102.15</p>
          <p className="w-fit">
            <Wallet />
          </p>
          <p className="w-fit">0</p>
        </div>
      </div>
    </div>
  );
};

const TokenInfo = memo(
  ({
    metadata = {
      image: 'https://picsum.photos/30',
      symbol: 'SOL',
      name: 'Solana',
      coingeckoId: 'solana',
      risk: 0,
    },
    address = '0x0000000000000000000000000000000000000000',
    priceUsdc = '0',
  }: {
    metadata: TTokenData['metadata'];
    address: string;
    priceUsdc: string;
  }) => {
    const clipboard = useClipboard({ timeout: 500 });
    return (
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex items-center gap-2">
          <img
            src={metadata.image}
            alt="token"
            width={30}
            height={30}
            loading="lazy"
            className="rounded-full"
          />
          <div>
            <p>
              <span className="font-bold">{metadata.symbol}</span>{' '}
              <span className="text-xs text-gray-500">{metadata.name}</span>
            </p>
            <p
              className={cn(
                'flex items-center gap-1 bg-gray-500 p-0.5 rounded text-sm cursor-pointer w-fit'
              )}
              onClick={(e) => {
                e.stopPropagation();
                clipboard.copy(address);
              }}
            >
              {address.slice(0, 8)}...{address.slice(-8)}{' '}
              <span>
                {clipboard.copied ? <Check size={16} /> : <Copy size={16} />}
              </span>
            </p>
          </div>
        </div>
        <p className="text-lg font-bold text-white">
          $
          {formatNumber({
            value: Number(priceUsdc),
            digit: 2,
          })}
        </p>
      </div>
    );
  }
);
