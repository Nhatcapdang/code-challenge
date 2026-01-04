import dynamic from 'next/dynamic';
import Loading from './loading';

const SwitchDark = dynamic(() => import('./switch-dark'), {
  loading: () => <Loading />,
});

const Footer = dynamic(() => import('./footer'), {
  loading: () => <Loading />,
});

const Navbar = dynamic(() => import('./navbar'), {
  loading: () => <Loading />,
});

const NotFound = dynamic(() => import('./not-found'), {
  loading: () => <Loading />,
});

export { Footer, Navbar, NotFound, SwitchDark };
