import {JSX} from 'react';
import {clsx} from 'clsx';

export default function FadeIn({children, shown}: {children: JSX.Element, shown: boolean}) {
  return (
    <div className={clsx(
      "transition-opacity duration-300",
      shown ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
    )}>
      {shown && <>{children}</>}
    </div>
  );
}