import { createPortal } from 'react-dom'
import { useEffect } from 'react'

const modalRoot = document.getElementById('modal-root')!

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  containerClassName?: string
  panelClassName?: string
  contentClassName?: string
  disableContentScroll?: boolean
  fullScreenOnMobile?: boolean
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEsc?: boolean
}

function Modal({
  isOpen,
  onClose,
  children,
  containerClassName,
  panelClassName,
  contentClassName,
  disableContentScroll,
  fullScreenOnMobile,
  showCloseButton = true,
  closeOnBackdropClick = false,
  closeOnEsc = false,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (!isOpen) return

    if (closeOnEsc) {
      document.addEventListener('keydown', handleEsc)
    }

    const scrollY = window.scrollY

    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyPosition = document.body.style.position
    const prevBodyTop = document.body.style.top
    const prevBodyLeft = document.body.style.left
    const prevBodyRight = document.body.style.right
    const prevBodyWidth = document.body.style.width
    const prevBodyOverflow = document.body.style.overflow
    const prevBodyOverflowX = document.body.style.overflowX

    // Robust scroll lock (prevents background scroll and x-axis overflow).
    document.documentElement.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    document.body.style.overflowX = 'hidden'

    return () => {
      if (closeOnEsc) {
        document.removeEventListener('keydown', handleEsc)
      }

      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.position = prevBodyPosition
      document.body.style.top = prevBodyTop
      document.body.style.left = prevBodyLeft
      document.body.style.right = prevBodyRight
      document.body.style.width = prevBodyWidth
      document.body.style.overflow = prevBodyOverflow
      document.body.style.overflowX = prevBodyOverflowX

      window.scrollTo(0, scrollY)
    }
  }, [isOpen, onClose, closeOnEsc])

  if (!isOpen) return null

  return createPortal(
    <>
      {/* Backdrop  */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      {/* Modal container  */}
      <div
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none overflow-hidden overscroll-none p-0 sm:p-4 ${
          containerClassName ?? ''
        }`}
      >
        <div
          className={`bg-[linear-gradient(180deg,rgb(0_0_0/4%)_0%,rgb(0_0_0/20%)_100%)] backdrop-blur-xl shadow-2xl w-full max-w-6xl border border-white/10 ring-1 ring-white/5 pointer-events-auto transform transition-all duration-500 ease-out box-border flex flex-col min-w-0 ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          } ${
            fullScreenOnMobile
              ? 'h-svh sm:h-auto rounded-none sm:rounded-3xl'
              : 'rounded-t-3xl sm:rounded-3xl'
          } ${panelClassName ?? ''}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxHeight: fullScreenOnMobile ? undefined : '90vh',
            animation: isOpen ? 'slideUp 0.5s ease-out' : 'none',
          }}
        >
          {/* Close button - top right */}
          {showCloseButton && (
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
          )}

          {/* Content */}
          <div
            className={`${
              disableContentScroll ? 'overflow-hidden' : 'overflow-y-auto'
            } ${
              fullScreenOnMobile ? 'flex-1 min-h-0' : 'max-h-[90vh]'
            } px-4 sm:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8 min-w-0 ${
              contentClassName ?? ''
            }`}
          >
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
    modalRoot,
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
