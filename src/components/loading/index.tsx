import React from 'react';

import './styles.css';

export default function Loading() {
  return (
    <div className="w-full min-h-[100vh] absolute top-0 left-0 text-fill-2 z-50">
      <div className="flex justify-center items-center min-h-[100vh] flex-col">
        <div className="scale-150 classic-2">logo</div>
      </div>
    </div>
  );
}
