'use client';

import { Footer } from '../components';
import Header from '../components/Header';
import { withMounted } from '../hooks/withMounted';

function NhatCapDang({ children }: { children?: React.ReactNode }) {
  return (
    <nav>
      <Header />
      {children}
      <Footer />
    </nav>
  );
}
export default withMounted(NhatCapDang);
