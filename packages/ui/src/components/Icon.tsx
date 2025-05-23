// src/components/ui/Icon.tsx
// Componente simple para renderizar iconos SVG, especialmente de lucide-react.

import React from 'react';
import { cn } from '../lib/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  as: React.ElementType;
  size?: number | string;
}

const Icon: React.FC<IconProps> = ({
  as,
  size = 18,
  className,
  ...props
}) => {
  const LucideIconComponent = as;
  return (
    <LucideIconComponent
      size={size}
      className={cn("inline-block shrink-0", className)}
      strokeWidth={2}
      {...props}
    />
  );
};
Icon.displayName = 'Icon';

export { Icon };
