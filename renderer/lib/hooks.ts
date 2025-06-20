import { useEffect } from 'react'
import ResizeSensor from 'licia/ResizeSensor'

export function useWindowResize(resizeCallback: () => void) {
  useEffect(() => {
    window.addEventListener('resize', resizeCallback)

    return () => {
      window.removeEventListener('resize', resizeCallback)
    }
  }, [])
}

export function useResizeSensor(containerRef: React.RefObject<HTMLElement>, resizeCallback: () => void) {
  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const resizeSensor = new ResizeSensor(containerRef.current)
    resizeSensor.addListener(resizeCallback)

    return () => {
      resizeSensor.destroy()
    }
  }, [])
}