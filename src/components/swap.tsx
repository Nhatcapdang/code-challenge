'use client';
import { UseTokensResponse, useTokens } from '@/hooks/use-tokens';
import { useCallback, useEffect, useMemo } from 'react';
import z from 'zod';
import SelectCombobox, { ComboboxItem } from './ui/select-token-combobox';

import { useSwapMutation } from '@/hooks/use-swap-mutation';
import { cn } from '@/lib/utils';
import { useSwapStore } from '@/providers/swap-store-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@mantine/hooks';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import NumberFormatter from './form/NumberFormatter';
import { AvatarKit } from './kit/avatar';
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardFooter,
  Separator,
} from './ui';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Form } from './ui/form';
import { Spinner } from './ui/spinner';

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(price);
};

const SwapFormSchema = z.object({
  payToken: z.custom<ComboboxItem<UseTokensResponse[number]> | null>(
    val => val !== null && val !== undefined,
    {
      message: 'Please select a pay token',
    }
  ),
  receiveToken: z.custom<ComboboxItem<UseTokensResponse[number]> | null>(
    val => val !== null && val !== undefined,
    {
      message: 'Please select a receive token',
    }
  ),
  payAmount: z.number().min(0, {
    message: 'Pay amount must be greater than 0',
  }),
  receiveAmount: z.number().min(0, {
    message: 'Receive amount must be greater than 0',
  }),
  slippage: z
    .number()
    .min(0.1, {
      message: 'Slippage must be greater than 0',
    })
    .max(5, {
      message: 'Slippage must be less than 5',
    }),
});

export type SwapFormData = z.infer<typeof SwapFormSchema>;

const confettiSideEffect = () => {
  const end = Date.now() + 3 * 1000; // 3 seconds
  const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];
  const frame = () => {
    if (Date.now() > end) return;
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });
    requestAnimationFrame(frame);
  };
  frame();
};

const SelectPayToken = () => {
  const swapForm = useFormContext<SwapFormData>();
  const {
    data: tokens = [],
    isLoading: loadingTokens,
    isSuccess,
  } = useTokens();
  const payToken = useWatch({
    control: swapForm.control,
    name: 'payToken',
  });
  const memoizedBaseTokenData = useMemo(
    () =>
      tokens.map(token => ({
        ...token,
        description: formatDate(token.date),
        image: token.image,
        name: token.currency,
        symbol: formatPrice(token.price),
      })),
    [tokens]
  );

  const handleBaseTokenSelect = useCallback(
    (token: ComboboxItem<UseTokensResponse[number]>) => {
      swapForm.setValue('payToken', token);
      const payAmount = swapForm.getValues('payAmount');
      const receiveTokenPrice = swapForm.getValues('receiveToken')?.price || 0;
      const calculatedReceiveAmount =
        (payAmount * (token.price || 0)) / receiveTokenPrice;
      swapForm.setValue('receiveAmount', calculatedReceiveAmount);
    },
    [swapForm]
  );

  useEffect(() => {
    if (isSuccess && memoizedBaseTokenData.length > 0 && !payToken) {
      swapForm.setValue('payToken', memoizedBaseTokenData[0]);
    }
  }, [swapForm, memoizedBaseTokenData, isSuccess, payToken]);

  return (
    <SelectCombobox<UseTokensResponse[number]>
      label="Select Pay Token"
      placeholder="Choose your token"
      data={memoizedBaseTokenData}
      isLoading={loadingTokens}
      value={payToken}
      onSelect={handleBaseTokenSelect}
      className="w-full"
    />
  );
};

const SelectReceiveToken = () => {
  const swapForm = useFormContext<SwapFormData>();
  const {
    data: tokens = [],
    isLoading: loadingTokens,
    isSuccess,
  } = useTokens();
  const receiveToken = useWatch({
    control: swapForm.control,
    name: 'receiveToken',
  });
  const memoizedBaseTokenData = useMemo(
    () =>
      tokens.map(token => ({
        ...token,
        description: formatDate(token.date),
        image: token.image,
        name: token.currency,
        symbol: formatPrice(token.price),
      })),
    [tokens]
  );

  const handleReceiveTokenSelect = useCallback(
    (token: ComboboxItem<UseTokensResponse[number]>) => {
      swapForm.setValue('receiveToken', token);
      const payAmount = swapForm.getValues('payAmount');
      const payToken = swapForm.getValues('payToken');
      const calculatedReceiveAmount =
        (payAmount * (payToken?.price || 0)) / (token.price || 0);
      swapForm.setValue('receiveAmount', calculatedReceiveAmount);
    },
    [swapForm]
  );

  useEffect(() => {
    if (isSuccess && memoizedBaseTokenData.length > 1 && !receiveToken) {
      swapForm.setValue('receiveToken', memoizedBaseTokenData[1]);
    }
  }, [swapForm, memoizedBaseTokenData, isSuccess, receiveToken]);

  return (
    <SelectCombobox<UseTokensResponse[number]>
      label="Select Receive Token"
      placeholder="Choose your token"
      data={memoizedBaseTokenData}
      isLoading={loadingTokens}
      value={receiveToken}
      onSelect={handleReceiveTokenSelect}
      className="w-full"
    />
  );
};

const SwapSuccessDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { payToken, receiveToken, payAmount, receiveAmount } = useSwapStore(
    state => state.initialSwapForm
  );
  const exchangeRate = receiveAmount / payAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="rounded-full bg-green-100 dark:bg-green-900/20 p-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-green-600 dark:text-green-500"
              >
                <motion.circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1,
                    ease: 'easeInOut',
                  }}
                />
                <motion.path
                  d="M8 12.5l2.5 2.5L16 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                    ease: 'easeInOut',
                  }}
                />
              </svg>
            </motion.div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Swap Successful!
          </DialogTitle>
          <DialogDescription className="text-center">
            Your tokens have been swapped successfully
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">You Paid</span>
              <div className="flex items-center gap-2">
                {payToken && (
                  <AvatarKit
                    image={payToken.image}
                    name={payToken.name}
                    symbol={payToken.symbol}
                  />
                )}
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(payAmount)}</div>
                  <div className="text-xs text-muted-foreground">
                    {payToken?.name}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                You Received
              </span>
              <div className="flex items-center gap-2">
                {receiveToken && (
                  <AvatarKit
                    image={receiveToken.image}
                    name={receiveToken.name}
                    symbol={receiveToken.symbol}
                  />
                )}
                <div className="text-right">
                  <div className="font-semibold">
                    {formatPrice(receiveAmount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {receiveToken?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="font-medium">
                1 {payToken?.name} ≈ {formatPrice(exchangeRate)}{' '}
                {receiveToken?.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Transaction Time</span>
              <span className="font-medium">
                {formatDate(new Date().toISOString())}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function SwapComponent() {
  const [
    isSuccessDialogOpen,
    { open: openSuccessDialog, close: closeSuccessDialog },
  ] = useDisclosure(false);

  const { setSwapForm, initialSwapForm } = useSwapStore(state => state);
  const swapForm = useForm<SwapFormData>({
    resolver: zodResolver(SwapFormSchema),
    defaultValues: initialSwapForm,
    mode: 'onSubmit',
  });
  const { mutate: swapMutation, isPending: isSwapping } = useSwapMutation();

  const [payToken, receiveToken, payAmount, receiveAmount] = useWatch({
    control: swapForm.control,
    name: ['payToken', 'receiveToken', 'payAmount', 'receiveAmount'],
  });

  const handleSwap = useCallback(
    (data: SwapFormData) => {
      swapMutation(data, {
        onSuccess: () => {
          confettiSideEffect();
          setSwapForm(data);
          openSuccessDialog();
          swapForm.reset();
        },
      });
    },
    [swapMutation, setSwapForm, openSuccessDialog, swapForm]
  );

  const handleInverseSwap = useCallback(() => {
    swapForm.setValue('payToken', receiveToken);
    swapForm.setValue('receiveToken', payToken);
    swapForm.setValue('payAmount', receiveAmount);
    swapForm.setValue('receiveAmount', payAmount);
  }, [payToken, receiveToken, payAmount, receiveAmount, swapForm]);

  return (
    <section
      id="problem2"
      className=" p-5 min-h-screen grid place-items-center "
    >
      <Card className="w-full max-w-sm mx-auto mt-4 relative overflow-hidden ">
        <h1 className="text-2xl font-bold text-center">Swap</h1>
        <Form form={swapForm} onSubmit={swapForm.handleSubmit(handleSwap)}>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              <SelectPayToken />
              <NumberFormatter
                control={swapForm.control}
                name="payAmount"
                label="Pay Token"
                description="Available Balance: 100,000,000,000"
                leftIcon={
                  <AvatarKit
                    image={payToken?.image || ''}
                    name={payToken?.name || ''}
                    symbol={payToken?.symbol || ''}
                  />
                }
                decimalScale={3}
                placeholder="0.00"
                thousandSeparator=","
                max={100_000_000_000}
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue ? floatValue <= 100_000_000_000 : false;
                }}
                onValueChange={values => {
                  swapForm.setValue('payAmount', values.floatValue || 0);
                  const calculatedReceiveAmount =
                    ((values.floatValue || 0) * (payToken?.price || 0)) /
                    (receiveToken?.price || 0);
                  swapForm.setValue('receiveAmount', calculatedReceiveAmount);
                }}
                rightIcon={
                  <span className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      onClick={() => {
                        swapForm.setValue('payAmount', 50_000_000_000);
                      }}
                    >
                      Half
                    </Badge>
                    <Badge
                      variant="outline"
                      onClick={() => {
                        swapForm.setValue('payAmount', 100_000_000_000);
                      }}
                    >
                      Max
                    </Badge>
                  </span>
                }
              />
              <div className="m-auto mt-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleInverseSwap}
                  type="button"
                  effect="shineHover"
                >
                  <RefreshCw className="size-8" />
                </Button>
              </div>
              <SelectReceiveToken />

              <NumberFormatter
                control={swapForm.control}
                name="receiveAmount"
                label="Receive Token"
                leftIcon={
                  <AvatarKit
                    image={receiveToken?.image || ''}
                    name={receiveToken?.name || ''}
                    symbol={receiveToken?.symbol || ''}
                  />
                }
                decimalScale={3}
                placeholder="0.00"
                thousandSeparator=","
                readOnly
              />
            </div>
            <div className="space-y-4">
              <Alert>
                <AlertTitle className="line-clamp-2">
                  <span className="font-bold">Trade Slippage:</span> Set the
                  allowed percentage difference between the quoted price and
                  actual execution price of your trade.
                </AlertTitle>

                <AlertDescription>
                  <Separator className="my-2 " />
                  <ButtonGroup aria-label="Button group" className="w-full">
                    {[0.1, 0.5, 1, 5].map((slippage, index) => (
                      <Button
                        variant="outline"
                        className={cn(
                          'flex-1 duration-300 transition-all ease-in-out',
                          swapForm.getValues('slippage') === slippage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-transparent text-foreground hover:bg-primary/10 hover:text-primary'
                        )}
                        type="button"
                        key={index}
                        onClick={() => {
                          swapForm.setValue('slippage', slippage);
                          swapForm.trigger('slippage');
                        }}
                      >
                        {slippage}%
                      </Button>
                    ))}
                  </ButtonGroup>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-4">
            <Button
              effect="shineHover"
              className="w-full"
              disabled={
                !swapForm.formState.isValid ||
                isSwapping ||
                payToken?.name === receiveToken?.name ||
                payAmount <= 0 ||
                receiveAmount <= 0
              }
            >
              {isSwapping ? (
                <Spinner className="h-4 w-4 mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Swap
            </Button>
          </CardFooter>
        </Form>
      </Card>

      <SwapSuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={closeSuccessDialog}
      />
    </section>
  );
}

SwapComponent.displayName = 'SwapComponent';
