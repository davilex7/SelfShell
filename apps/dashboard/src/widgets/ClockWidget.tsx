// src/widgets/ClockWidget.tsx
// Un widget simple que muestra la hora y fecha actual.

import React, { useState, useEffect } from 'react';
import { WidgetProps } from '@/types'; // Asumiendo que @ es un alias para src/

const ClockWidget: React.FC<WidgetProps> = ({ instanceConfig }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Actualiza la hora cada segundo
    const timerId = setInterval(() => setTime(new Date()), 1000);
    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(timerId);
  }, []);

  // Opciones de formato para la hora y fecha
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit', // Opcional: añadir segundos
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Aquí podrías usar instanceConfig.settings.timezone si lo implementas
  // const timezone = instanceConfig.settings?.timezone;
  // const locale = instanceConfig.settings?.locale || 'es-ES'; // Ejemplo de localización

  return (
    <div className="flex flex-col items-center justify-center h-full text-center select-none">
      <div className="text-5xl font-bold text-slate-700 dark:text-slate-200 tabular-nums">
        {time.toLocaleTimeString('es-ES', timeOptions)}
      </div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400 capitalize">
        {time.toLocaleDateString('es-ES', dateOptions)}
      </div>
    </div>
  );
};

export default ClockWidget;
