import { useEffect, useState } from 'react';

const RootLayoutLayer = (props: { children: any }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const rootEl: any = document.querySelector('.Kalend__Calendar__root');

    if (rootEl) {
      setIsMounted(true);
    }
  }, [document.querySelector('.Kalend__Calendar__root')]);

  return isMounted ? props.children : null;
};

export default RootLayoutLayer;
