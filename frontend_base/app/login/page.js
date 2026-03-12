'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function LoginForm() {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error);
        setIsSubmitting(false);
      }
    }, 600);
  };

  if (loading) return null;

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-bg-pattern" />

      {/* Left — Hero Section */}
      <div className="login-left">
        <div className="login-hero-content">
          <div className="login-hero-icon">🏥</div>
          <h1>{t('loginHeroTitle').replace('Modelo de Predicción de ', '') && t('loginHeroTitle').split(' ').slice(0, 3).join(' ')} <span className="text-gradient">{t('loginHeroTitle').split(' ').slice(3).join(' ')}</span></h1>
          <p>
            {t('loginHeroDesc')}
          </p>
          <div className="login-hero-stats">
            <div className="login-stat">
              <div className="value">94.3%</div>
              <div className="label">{t('modelAccuracy')}</div>
            </div>
            <div className="login-stat">
              <div className="value">95.5%</div>
              <div className="label">{t('f1MacroScore')}</div>
            </div>
            <div className="login-stat">
              <div className="value">0</div>
              <div className="label">{t('criticalErrors')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="login-right">
        <div className="login-card animate-slide">
          <h2>{t('loginAction')}</h2>
          <p className="subtitle">{t('loginSubtitle')}</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="input-group">
              <label htmlFor="username">{t('username')}</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="username"
                  className="input"
                  type="text"
                  placeholder={t('enterUsername')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">{t('password')}</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder={t('enterPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {isSubmitting ? t('verifying') : t('loginAction')}
            </button>
          </form>

          <div className="login-footer">
            {t('unisinuFooter')}<br />
            {t('researchFooter')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
