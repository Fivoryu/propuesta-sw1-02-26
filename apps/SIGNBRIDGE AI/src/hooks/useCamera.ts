import { useRef, useState, useCallback } from 'react'
import type { CameraState } from '../types'

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  state: CameraState
  error: string | null
  startCamera: () => Promise<void>
  stopCamera: () => void
  pauseCamera: () => void
  resumeCamera: () => Promise<void>
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [state, setState] = useState<CameraState>('idle')
  const [error, setError] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setState('idle')
  }, [])

  const startCamera = useCallback(async () => {
    setError(null)
    setState('requesting')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setState('active')
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Permiso denegado. Por favor permite el acceso a la cámara en la configuración de tu navegador.'
          : err instanceof DOMException && err.name === 'NotFoundError'
            ? 'No se encontró una cámara disponible en este dispositivo.'
            : 'No fue posible acceder a la cámara.'

      setError(message)
      setState('error')
    }
  }, [])

  const pauseCamera = useCallback(() => {
    if (videoRef.current && state === 'active') {
      videoRef.current.pause()
      setState('paused')
    }
  }, [state])

  const resumeCamera = useCallback(async () => {
    if (videoRef.current && state === 'paused') {
      await videoRef.current.play()
      setState('active')
    }
  }, [state])

  return { videoRef, state, error, startCamera, stopCamera, pauseCamera, resumeCamera }
}
