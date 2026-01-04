'use client';

import * as React from 'react';

/*
  This hook is used to ensure that the component is mounted before rendering.
  It is used to prevent the component from rendering before the DOM is ready.
*/
export function withMounted<T extends object>(
  WrappedComponent: React.ComponentType<T>,
) {
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
