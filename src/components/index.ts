import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('./Footer'));
const Swap = dynamic(() => import('./swap'));
const SwapTokens = dynamic(() => import('./SwapTokens'));

export { Footer, Swap, SwapTokens };
