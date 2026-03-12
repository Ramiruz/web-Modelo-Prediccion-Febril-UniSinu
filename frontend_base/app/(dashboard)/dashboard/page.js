'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

const mockRecentPatients = [
  { id: 'P-0421', name: 'María García', age: '3 años', date: '2026-02-16', severity: 'Leve', confidence: '96%' },
  { id: 'P-0420', name: 'Carlos López', age: '1 año', date: '2026-02-16', severity: 'Moderada', confidence: '89%' },
  { id: 'P-0419', name: 'Ana Martínez', age: '5 años', date: '2026-02-15', severity: 'Severa', confidence: '93%' },
  { id: 'P-0418', name: 'Luis Rodríguez', age: '2 años', date: '2026-02-15', severity: 'Leve', confidence: '97%' },
  { id: 'P-0417', name: 'Sofía Herrera', age: '4 años', date: '2026-02-14', severity: 'Moderada', confidence: '91%' },
];

const severityData = [
  { label: 'Leve', count: 245, pct: 56.6, color: 'var(--severity-low)' },
  { label: 'Moderada', count: 128, pct: 29.6, color: 'var(--severity-mid)' },
  { label: 'Severa', count: 60, pct: 13.8, color: 'var(--severity-high)' },
];

function getBadgeClass(severity) {
  if (severity === 'Leve') return 'badge badge-low';
  if (severity === 'Moderada') return 'badge badge-mid';
  return 'badge badge-high';
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>{t('dashboardGeneral')}</h1>
        <p>{t('dashboardSubtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(230,0,35,0.12)', color: 'var(--accent)' }}>🏥</div>
          <div className="kpi-value">433</div>
          <div className="kpi-label">{t('patientsEvaluated')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(212,168,67,0.12)', color: 'var(--unisinu-gold)' }}>🎯</div>
          <div className="kpi-value">94.3%</div>
          <div className="kpi-label">{t('modelAccuracy')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(100,0,0,0.15)', color: '#e6768a' }}>📊</div>
          <div className="kpi-value">95.5%</div>
          <div className="kpi-label">{t('f1MacroScore')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(52,211,153,0.12)', color: 'var(--severity-low)' }}>🛡️</div>
          <div className="kpi-value">0</div>
          <div className="kpi-label">{t('criticalErrors')}</div>
        </div>
      </div>

      {/* Two columns: Severity Distribution + Model Summary */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Severity Distribution */}
        <div className="card">
          <div className="card-header">
            <h3>{t('severityDistribution')}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {/* Donut chart using conic-gradient */}
            <div
              className="donut-chart"
              style={{
                background: mounted
                  ? `conic-gradient(
                      var(--severity-low) 0% 56.6%,
                      var(--severity-mid) 56.6% 86.2%,
                      var(--severity-high) 86.2% 100%
                    )`
                  : 'var(--bg-secondary)',
                transition: 'background 1s ease',
              }}
            >
              <div className="donut-center">
                <div className="value">433</div>
                <div className="label">{t('total')}</div>
              </div>
            </div>
            <div className="donut-legend">
              {severityData.map((d) => (
                <div className="legend-item" key={d.label}>
                  <span className="legend-dot" style={{ background: d.color }} />
                  <span>{d.label === 'Leve' ? t('mild') : d.label === 'Moderada' ? t('moderate') : t('severe')}: <strong>{d.count}</strong> ({d.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model Summary Card */}
        <div className="card">
          <div className="card-header">
            <h3>{t('modelSummary')}</h3>
            <span className="badge badge-info">SVM-RBF</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('algorithm')}</span>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t('svmRbf')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('features')}</span>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t('clinicalVariables258')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('classes')}</span>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t('classesList')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('security')}</span>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--severity-low)' }}>{t('noSevereToMildErrors')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="quick-actions">
          <Link href="/evaluacion" className="btn btn-primary">
            🩺 {t('newEvaluation')}
          </Link>
          <Link href="/rendimiento" className="btn btn-secondary">
            📈 {t('viewPerformance')}
          </Link>
          <Link href="/historial" className="btn btn-secondary">
            📋 {t('viewHistory')}
          </Link>
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <div className="card">
        <div className="card-header">
          <h3>{t('recentEvaluations')}</h3>
          <Link href="/historial" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            {t('viewAll')}
          </Link>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('patient')}</th>
                <th>{t('age')}</th>
                <th>{t('date')}</th>
                <th>{t('severityField')}</th>
                <th>{t('confidenceField')}</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentPatients.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{parseInt(p.age) + (p.age.includes('años') || p.age.includes('año') ? (parseInt(p.age) === 1 ? (t('language') === 'en' ? ' year' : ' año') : (t('language') === 'en' ? ' years' : ' años')) : '') /* Simplify age string based on locale */}</td>
                  <td>{p.date}</td>
                  <td><span className={getBadgeClass(p.severity)}>{p.severity === 'Leve' ? t('mild') : p.severity === 'Moderada' ? t('moderate') : t('severe')}</span></td>
                  <td style={{ fontWeight: 600 }}>{p.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
