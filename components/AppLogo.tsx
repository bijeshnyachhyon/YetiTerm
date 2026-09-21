import React from 'react';

interface AppLogoProps {
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className }) => (
  <img
    src="/logo.png"
    alt="YetiTerm Logo"
    className={className}
    draggable={false}
  />
);

export default AppLogo;
