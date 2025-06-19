import React from 'react';
import { CodeHighlight } from '@mantine/code-highlight';

const codeForPreviousDemo = `
import React, { useMemo } from 'react';
import { BoxProps } from '@mui/material';
import { useWalletBalances } from './hooks/useWalletBalances';
import { usePrices } from './hooks/usePrices';
// import { WalletRow } from './WalletRow';   // ensure WalletRow is React.memo-ised

/***** Types *****/
interface WalletBalance {
  blockchain: Blockchain;         
  currency: string;
  amount: number;
}

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface Props extends BoxProps {}

/***** Constants *****/
const PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (chain: Blockchain | string): number =>
  PRIORITY[chain as Blockchain] ?? -99;

/***** Component *****/
export const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  /* 1 — remove zero / negative balances */
  const positiveBalances = useMemo(
    () => balances.filter(b => b.amount > 0),
    [balances]
  );

  /* 2 — sort once by priority */
  const sortedBalances = useMemo(() => {
    return [...positiveBalances].sort(
      (a, b) => getPriority(b.blockchain) - getPriority(a.blockchain)
    );
  }, [positiveBalances]);

  /* 3 — render rows */
  const rows = useMemo(
    () =>
      sortedBalances.map(balance => {
        const usdValue = (prices?.[balance.currency] ?? 0) * balance.amount;
        return (
          <WalletRow
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.amount.toFixed(2)}
          />
        );
      }),
    [sortedBalances, prices]
  );

  return <div {...rest}>{rows}</div>;
};

`;

export default function Page() {
  return (
    <div className="container-2">
      <CodeHighlight code={codeForPreviousDemo} language="tsx" />
    </div>
  );
}
