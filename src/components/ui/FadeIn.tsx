import {JSX} from 'react';
import {clsx} from 'clsx';

export default function FadeIn({children, shown, className = ""}: {children: JSX.Element, shown: boolean, className?: string}) {
  return (
    <div className={clsx(
      "transition-opacity duration-300",
      shown ? "opacity-100" : "opacity-0 h-0 overflow-hidden",
      className
    )}>
      {shown && <>{children}</>}
    </div>
  );
}