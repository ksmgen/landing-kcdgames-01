type FacebookFooterLinkProps = {
  className?: string;
};

export default function FacebookFooterLink({ className = "" }: FacebookFooterLinkProps) {
  return (
    <a
      href="https://www.facebook.com/share/1Bcgm9dGLx/?mibextid=wwXIfr"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="KC Games on Facebook"
      className={className}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.6c0-.8.3-1.6 1.7-1.6h1.3V5.7c-.2 0-1.1-.2-2.2-.2-2.3 0-3.8 1.4-3.8 4v1.8H8v2.7h2.5v7h3Z" />
      </svg>
    </a>
  );
}
