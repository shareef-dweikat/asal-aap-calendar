import { Context, Store } from '../../context/store';
import { DesktopLayoutProps } from './DesktopLayout.props';
import { useContext } from 'react';

const DesktopLayout = (props: DesktopLayoutProps) => {
  const { children } = props;
  const [store]: [Store] = useContext(Context);
  const { isMobile } = store;

  return !isMobile ? (
    <div className={'Kalend__DesktopLayout'}>{children}</div>
  ) : null;
};

export default DesktopLayout;
