'use client';

import * as React from 'react';

// Higher Order Component to handle mounting state
export function withMounted<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function WithMountedComponent(props: T) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
