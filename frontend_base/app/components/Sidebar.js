'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
  { href: '/dashboard', icon: '📊', labelKey: 'dashboard' },
  { href: '/evaluacion', icon: '🩺', labelKey: 'patientEvaluation' },
  { href: '/rendimiento', icon: '📈', labelKey: 'modelPerformance' },
  { href: '/historial', icon: '📋', labelKey: 'patientHistory' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">PF</div>
          <div className="sidebar-brand">
            <h2>{t('febrilePrediction')}</h2>
            <span>UniSinú · Cartagena</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              {t(item.labelKey)}
            </Link>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <button className="nav-item" onClick={toggleLanguage} style={{ cursor: 'pointer', marginBottom: '0.25rem' }}>
              <span className="nav-icon">{language === 'en' ? '🇺🇸' : '🇪🇸'}</span>
              {language === 'en' ? 'English' : 'Español'}
            </button>
            <button className="nav-item" onClick={toggleTheme} style={{ cursor: 'pointer' }}>
              <span className="nav-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
              {theme === 'dark' ? t('lightMode') : t('darkMode')}
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="sidebar-user-info">
              <div className="name">{user?.name || t('user')}</div>
              <div className="role">{user?.role || t('researcher')}</div>
            </div>
          </div>
          <button
            className="btn btn-danger btn-sm"
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={logout}
          >
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
}
