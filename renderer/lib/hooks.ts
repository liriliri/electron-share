import { useEffect } from 'react'

export function useWindowResize(resizeCallback: () => void) {
  useEffect(() => {
    window.addEventListener('resize', resizeCallback)

    return () => {
      window.removeEventListener('resize', resizeCallback)
    }
  }, [])
}
