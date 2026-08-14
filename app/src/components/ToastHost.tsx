import { useApp } from '../context/AppContext'
import { Toast, ToastContainer } from 'react-bootstrap'

export function ToastHost() {
  const { toasts } = useApp()
  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      containerPosition="fixed"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          bg={t.kind === 'danger' ? 'danger' : t.kind === 'info' ? 'info' : 'success'}
          className="text-white"
          delay={4000}
        >
          <Toast.Body className="text-white">{t.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  )
}