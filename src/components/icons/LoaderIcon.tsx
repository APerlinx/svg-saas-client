type Props = { size?: string; className?: string }
export default function LoaderIcon({
  size = '24',
  className = 'text-current',
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <g>
        <path
          fill="currentColor"
          d="M12 5.75c.345 0 .625-.28.625-.625V2.5a.625.625 0 1 0-1.25 0v2.625c0 .345.28.625.625.625Z"
        />
        <path
          fill="currentColor"
          d="M6.625 8.75a.625.625 0 0 0 .883-.883L5.659 6.017a.625.625 0 0 0-.883.883l1.849 1.85Z"
        />
        <path
          fill="currentColor"
          d="M5.75 12a.625.625 0 0 0-.625-.625H2.5a.625.625 0 1 0 0 1.25h2.625c.345 0 .625-.28.625-.625Z"
        />
        <path
          fill="currentColor"
          d="M6.625 15.25 4.776 17.1a.625.625 0 0 0 .883.883l1.85-1.85a.625.625 0 0 0-.883-.883Z"
        />
        <path
          fill="currentColor"
          d="M12 18.25a.625.625 0 0 0-.625.625V21.5a.625.625 0 1 0 1.25 0v-2.625a.625.625 0 0 0-.625-.625Z"
        />
        <path
          fill="currentColor"
          d="M17.375 15.25a.625.625 0 0 0-.883.883l1.85 1.85a.625.625 0 1 0 .883-.883l-1.85-1.85Z"
        />
        <path
          fill="currentColor"
          d="M21.5 12a.625.625 0 0 0-.625-.625H18.25a.625.625 0 1 0 0 1.25h2.625c.345 0 .625-.28.625-.625Z"
        />
        <path
          fill="currentColor"
          d="M17.375 8.75 19.225 6.9a.626.626 0 0 0-.884-.882l-1.849 1.85a.626.626 0 1 0 .883.883Z"
        />
      </g>
    </svg>
  )
}
