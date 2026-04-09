import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  className?: string
}

function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div
      className={`flex items-center gap-2 font-ui text-sm text-error ${className}`}
      role="alert"
    >
      <AlertCircle size={16} strokeWidth={1.5} className="shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export { ErrorMessage }
export type { ErrorMessageProps }
