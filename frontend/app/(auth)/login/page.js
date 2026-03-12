'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { IconMail, IconLock, IconShield } from '../../components/Icons';
import { useLanguage } from '../../context/LanguageContext';

function LoginForm() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await signIn(email, password);
        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error);
            setIsSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <div className="login-page">
            <div className="login-bg" />
            <div className="login-bg-pattern" />

            {/* Left — Hero Section */}
            <div className="login-left">
                <div className="login-hero-content">
                    <div className="login-hero-icon">
                        <IconShield style={{ width: 48, height: 48 }} />
                    </div>
                    <h1>
                        {t('modelTitleP1')}{' '}
                        <span className="text-gradient">{t('modelTitleP2')}</span> {t('modelTitleP3')}
                    </h1>
                    <p>
                        {t('modelDescription')}
                    </p>
                    <div className="login-hero-stats">
                        <div className="login-stat">
                            <div className="value">74.6%</div>
                            <div className="label">{t('accuracyCV')}</div>
                        </div>
                        <div className="login-stat">
                            <div className="value">70%</div>
                            <div className="label">{t('recallSevere')}</div>
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
                    <h2>{t('signIn')}</h2>
                    <p className="subtitle">{t('loginSubtitle')}</p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div className="login-error">{error}</div>}

                        <div className="input-group">
                            <label htmlFor="email">{t('emailLabel')}</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon"><IconMail /></span>
                                <input
                                    id="email"
                                    className="input"
                                    type="email"
                                    placeholder={t('emailPlaceholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">{t('passwordLabel')}</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon"><IconLock /></span>
                                <input
                                    id="password"
                                    className="input"
                                    type="password"
                                    placeholder={t('passwordPlaceholder')}
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
                            {isSubmitting ? t('verifying') : t('enter')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('noAccount')}</span>
                        <Link href="/register" style={{ fontWeight: 600 }}>
                            {t('register')}
                        </Link>
                    </div>

                    <div className="login-footer">
                        {t('university')}
                        <br />
                        {t('researchLabel')}
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
