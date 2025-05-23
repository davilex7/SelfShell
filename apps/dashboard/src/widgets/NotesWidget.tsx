// src/widgets/NotesWidget.tsx
// Un widget simple para tomar notas rápidas.

import React, { useState, useEffect } from 'react';
import { WidgetProps } from '@/types'; // Asumiendo que @ es un alias para src/

const NotesWidget: React.FC<WidgetProps> = ({ instanceConfig, updateInstanceConfig }) => {
  // Estado local para la nota, inicializado desde la configuración de la instancia si existe.
  const [note, setNote] = useState<string>(instanceConfig.settings?.currentNote || "");

  // Efecto para cargar la nota inicial desde la configuración (solo una vez)
  useEffect(() => {
    if (instanceConfig.settings?.initialNote && !instanceConfig.settings?.currentNote) {
      setNote(instanceConfig.settings.initialNote);
    }
  }, [instanceConfig.settings?.initialNote, instanceConfig.settings?.currentNote]);


  // Manejador para cambios en el textarea.
  // En una aplicación real, aquí podrías implementar un debounce para guardar
  // automáticamente en localStorage o en el backend.
  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = event.target.value;
    setNote(newNote);
    // Actualiza la configuración de la instancia para persistir la nota (ejemplo básico)
    // Esto requeriría que el dashboard guarde estos settings.
    updateInstanceConfig(instanceConfig.id, {
      settings: { ...instanceConfig.settings, currentNote: newNote },
    });
  };

  return (
    <textarea
      value={note}
      onChange={handleNoteChange}
      className="w-full h-full p-3 text-sm border-none rounded-md resize-none bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
      placeholder="Escribe tus notas aquí..."
      aria-label="Bloc de notas rápidas"
    />
  );
};

export default NotesWidget;
