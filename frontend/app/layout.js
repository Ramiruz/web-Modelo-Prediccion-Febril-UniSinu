import './globals.css';
import { LanguageProvider } from './context/LanguageContext';

export const metadata = {
  title: 'Predicción Febril Pediátrica | UniSinú',
  description: 'Sistema de predicción de severidad febril en pacientes pediátricos - Universidad del Sinú, Cartagena',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
