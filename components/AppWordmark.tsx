import React from 'react';

interface AppWordmarkProps {
  accessibleLabel?: string;
  className?: string;
}

/** Outlined branding for YetiTerm. */
export const AppWordmark: React.FC<AppWordmarkProps> = ({ accessibleLabel, className }) => (
  <svg
    aria-hidden={accessibleLabel ? undefined : true}
    aria-label={accessibleLabel}
    className={className}
    fill="currentColor"
    focusable="false"
    role={accessibleLabel ? "img" : undefined}
    viewBox="0 0 125 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="22"
      fill="currentColor"
      fontFamily="'Mona Sans', system-ui, -apple-system, sans-serif"
      fontWeight="800"
      fontStyle="normal"
      fontSize="23"
      letterSpacing="-0.5px"
    >
      YetiTerm
    </text>
  </svg>
);

export default AppWordmark;
