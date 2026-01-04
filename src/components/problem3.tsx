import { CodeTabs } from '@/components/ui/shadcn-io/code-tabs';
const CODES = {
  Problem3: `// ❌ ISSUE #1: Missing 'blockchain' property - will cause TypeScript error
interface WalletBalance {
  currency: string;
  amount: number;
  // Missing: blockchain property that's used in the code
}

// ❌ ISSUE #2: Interface doesn't extend WalletBalance, causing duplication
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  // Missing: usdValue property that's calculated later
}

interface Props extends BoxProps {

}

const WalletPage: React.FC<Props> = (props: Props) => {
  // ❌ ISSUE #3: 'children' is destructured but never used (dead code)
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // ❌ ISSUE #4: Using 'any' defeats TypeScript's type safety
  // ❌ ISSUE #5: Switch statement is verbose; lookup object is better
	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  // ❌ ISSUE #6: 'prices' in dependency array but never used in computation
  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
      // ❌ ISSUE #7: 'lhsPriority' is undefined! Should be 'balancePriority'
      // ❌ ISSUE #8: Logic is INVERTED - returns true for amount <= 0 (keeps bad data)
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true; // ❌ This keeps zero/negative balances instead of filtering them out
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      // ❌ ISSUE #9: getPriority() called multiple times for same blockchain
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
      // ❌ ISSUE #10: Missing return 0 for equal priorities (unstable sort)
    });
  }, [balances, prices]);

  // ❌ ISSUE #11: This variable is computed but NEVER USED anywhere (wasted computation)
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  // ❌ ISSUE #12: Using sortedBalances (WalletBalance) but expecting FormattedWalletBalance
  // ❌ ISSUE #13: usdValue calculated in render loop instead of memoized data
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        // ❌ ISSUE #14: Using index as key (anti-pattern) - causes React rendering issues
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        // ❌ ISSUE #15: balance.formatted doesn't exist on WalletBalance (runtime error)
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}`,
  Fixed: `// ✅ FIX #1: Use union type for type safety instead of 'any'
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo'

// ✅ FIX #2: Added missing 'blockchain' property
interface WalletBalance {
	currency: string
	amount: number
	blockchain: Blockchain
}

// ✅ FIX #3: Extend WalletBalance to avoid duplication, add usdValue
interface FormattedWalletBalance extends WalletBalance {
	formatted: string
	usdValue: number
}

interface Props extends BoxProps {}

// ✅ FIX #4: Replace switch with lookup object (more maintainable)
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
	Osmosis: 100,
	Ethereum: 50,
	Arbitrum: 30,
	Zilliqa: 20,
	Neo: 20,
}

// ✅ FIX #5: Type-safe function with proper return type
const getPriority = (blockchain: Blockchain): number => {
	return BLOCKCHAIN_PRIORITY[blockchain] ?? -99
}

const WalletPage: React.FC<Props> = (props: Props) => {
	// ✅ FIX #6: Removed unused 'children' variable
	const { ...rest } = props
	const balances = useWalletBalances()
	const prices = usePrices()

	// ✅ FIX #7: Both 'balances' and 'prices' are now used in this memo
	const formattedBalances = useMemo(() => {
		return balances
			// ✅ FIX #8: Correct filter logic - keep balances with valid priority AND positive amount
			.filter((balance: WalletBalance) => {
				const priority = getPriority(balance.blockchain)
				return priority > -99 && balance.amount > 0
			})
			// ✅ FIX #9: Simplified sort with arithmetic subtraction (descending order)
			.sort((lhs: WalletBalance, rhs: WalletBalance) => {
				const leftPriority = getPriority(lhs.blockchain)
				const rightPriority = getPriority(rhs.blockchain)
				// Arithmetic subtraction automatically returns -1, 0, or 1
				return rightPriority - leftPriority
			})
			// ✅ FIX #10: Single transformation - format AND calculate usdValue here
			.map((balance: WalletBalance) => ({
				...balance,
				formatted: balance.amount.toFixed(),
				// Calculate usdValue once during transformation, not in render
				usdValue: prices[balance.currency] * balance.amount,
			}))
	}, [balances, prices])

	// ✅ FIX #11: Use the correctly formatted data directly in render
	return (
		<div {...rest}>
			{formattedBalances.map((balance: FormattedWalletBalance) => (
				<WalletRow
					className={classes.row}
					// ✅ FIX #12: Use meaningful key (currency) instead of index
					// Note: Consider composite key if currency isn't unique
					key={balance.currency}
					amount={balance.amount}
					// ✅ FIX #13: Use pre-calculated usdValue from formatted data
					usdValue={balance.usdValue}
					// ✅ FIX #14: Use formatted property that now exists
					formattedAmount={balance.formatted}
				/>
			))}
		</div>
	)
}
`,
  Lodash: `// 🔧 Using Lodash helpers for cleaner, more functional code
import _ from 'lodash'

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo'

interface WalletBalance {
	currency: string
	amount: number
	blockchain: Blockchain
}

interface FormattedWalletBalance extends WalletBalance {
	formatted: string
	usdValue: number
}

interface Props extends BoxProps {}

// Priority lookup map
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
	Osmosis: 100,
	Ethereum: 50,
	Arbitrum: 30,
	Zilliqa: 20,
	Neo: 20,
}

const getPriority = (blockchain: Blockchain): number => {
	// ✅ Lodash: _.get with default value (alternative to ?? operator)
	return _.get(BLOCKCHAIN_PRIORITY, blockchain, -99)
}

const WalletPage: React.FC<Props> = (props: Props) => {
	const { ...rest } = props
	const balances = useWalletBalances()
	const prices = usePrices()

	const formattedBalances = useMemo(() => {
		return _.chain(balances)
			// ✅ Lodash: _.filter for cleaner filtering
			.filter((balance: WalletBalance) => {
				const priority = getPriority(balance.blockchain)
				return priority > -99 && balance.amount > 0
			})
			// ✅ Lodash: _.orderBy for simpler sorting (no manual comparator needed)
			.orderBy(
				[(balance) => getPriority(balance.blockchain)],
				['desc'] // Sort in descending order
			)
			// ✅ Lodash: _.map for transformation
			.map((balance: WalletBalance): FormattedWalletBalance => ({
				...balance,
				// ✅ Lodash: _.round for number formatting (alternative to toFixed)
				formatted: _.round(balance.amount, 2).toString(),
				// ✅ Lodash: _.get safely retrieves price with fallback
				usdValue: _.get(prices, balance.currency, 0) * balance.amount,
			}))
			// ✅ Lodash: _.value() to execute the chain
			.value()
	}, [balances, prices])

	return (
		<div {...rest}>
			{/* ✅ Lodash: _.map can also be used for JSX rendering */}
			{_.map(formattedBalances, (balance: FormattedWalletBalance) => (
				<WalletRow
					className={classes.row}
					// ✅ Lodash: _.uniqueId for generating unique keys
					key={\`\${balance.blockchain}-\${balance.currency}\`}
					amount={balance.amount}
					usdValue={balance.usdValue}
					formattedAmount={balance.formatted}
				/>
			))}
		</div>
	)
}

// Option 1: Using _.flow for function composition
const transformBalances = _.flow([
	(balances) => _.filter(balances, (b) => 
		getPriority(b.blockchain) > -99 && b.amount > 0
	),
	(balances) => _.orderBy(balances, 
		[(b) => getPriority(b.blockchain)], 
		['desc']
	),
	(balances) => _.map(balances, (b) => ({
		...b,
		formatted: _.round(b.amount, 2).toString(),
		usdValue: _.get(prices, b.currency, 0) * b.amount,
	})),
])

// Option 2: Using _.sortBy with _.reverse for descending order
const sortedBalances = _.reverse(
	_.sortBy(filteredBalances, (b) => getPriority(b.blockchain))
)

// Option 3: Using _.groupBy if you need to group by blockchain
const groupedByBlockchain = _.groupBy(balances, 'blockchain')

// Option 4: Using _.sumBy to calculate total portfolio value
const totalValue = _.sumBy(formattedBalances, 'usdValue')

// Option 5: Using _.maxBy to find highest value balance
const highestBalance = _.maxBy(formattedBalances, 'usdValue')`,
};
export default function Problem3() {
  return (
    <section id="problem3" className="max-w-screen-lg mx-auto">
      <CodeTabs lang="tsx" codes={CODES} />
    </section>
  );
}
