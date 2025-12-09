import { createPortal } from 'react-dom'
import { useEffect } from 'react'

const modalRoot = document.getElementById('modal-root')!

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <>
      {/* Backdrop  */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal container  */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
        <div
          className={`bg-[linear-gradient(180deg,rgb(0_0_0/4%)_0%,rgb(0_0_0/20%)_100%)] backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-6xl border-2 border-wizard-orange/30 pointer-events-auto transform transition-all duration-500 ease-out ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxHeight: '90vh',
            animation: isOpen ? 'slideUp 0.5s ease-out' : 'none',
          }}
        >
          {/* Close button - top right */}
          <button
            onClick={onClose}
            className="absolute top-1 right-1 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 group z-10"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-[90vh] px-4 sm:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8">
            {children}
          </div>
        </div>
      </div>

      {/* Add keyframe animation to index.css if not already there */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>,
    modalRoot
  )
}

Modal.Header = function ModalHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
      <h2 className="text-xl sm:text-2xl font-bold text-white">{children}</h2>
    </div>
  )
}

Modal.Body = function ModalBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 sm:mb-6 text-white/90 leading-relaxed text-sm sm:text-base">
      {children}
    </div>
  )
}

Modal.Footer = function ModalFooter({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-white/10">
      {children}
    </div>
  )
}

export default Modal
