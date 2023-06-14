import { Context, Store } from '../../context/store';
import { MobileLayoutProps } from './MobileLayout.props';
import { useContext } from 'react';

const MobileLayout = (props: MobileLayoutProps) => {
  const { children, style } = props;
  const [store]: [Store] = useContext(Context);
  const { isMobile } = store;

  return isMobile ? (
    <div className={'Kalend__MobileLayout'} style={style}>
      {children}
    </div>
  ) : null;
};

export default MobileLayout;
