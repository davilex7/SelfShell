// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}', // Añade tus widgets
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Para el App Router
	'../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class', // Habilitar modo oscuro basado en clase
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Definir la fuente Inter
      },
      // Puedes añadir más personalizaciones de tema aquí
      gridTemplateRows: {
        // Ejemplo para definir filas de grid si necesitas alturas específicas
        // 'layout': 'auto 1fr auto',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;