import {clsx} from 'clsx';
import {CopyIcon} from 'lucide-react';

export default function Code({text, copy = false, className = ""}: { text: string, copy?: boolean, className?: string }) {

  const copyToClipboard = () => {
    if(copy) {
      navigator.clipboard.writeText(text);
    }
  }

  return (
    <code className={clsx("w-full flex justify-between items-center px-4 py-1 rounded-md border-gray-200 border-1 bg-gray-100", className)}>
      {text}
      {copy && (
        <CopyIcon onClick={copyToClipboard} size={20} />
      )}
    </code>
  )
}