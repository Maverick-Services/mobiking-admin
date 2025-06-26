import React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'

export default function MiniLoaderButton({
  loading = false,
  children,
  className = '',
  variant,
  size = 'icon',
  ...props
}) {
  return (
    <Button
      className={`flex items-center justify-center p-1 ${className}`}
      variant={variant}
      size={size}
      disabled={loading}
      aria-disabled={loading}
      {...props}
    >
      {loading
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : children
      }
    </Button>
  )
}
