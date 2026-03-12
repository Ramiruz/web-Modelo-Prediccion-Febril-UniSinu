'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const modelsData = [
  { name: 'SVM (RBF)', f1: 95.5, accuracy: 94.3, best: true },
  { name: 'Extra Trees', f1: 94.8, accuracy: 93.7, best: false },
  { name: 'Gradient Boosting', f1: 94.2, accuracy: 93.1, best: false },
  { name: 'Random Forest', f1: 93.5, accuracy: 92.4, best: false },
  { name: 'XGBoost', f1: 92.8, accuracy: 91.9, best: false },
  { name: 'LightGBM', f1: 92.1, accuracy: 91.2, best: false },
  { name: 'Logistic Regression', f1: 88.3, accuracy: 87.5, best: false },
  { name: 'KNN', f1: 86.7, accuracy: 85.9, best: false },
  { name: 'Naive Bayes', f1: 82.4, accuracy: 81.1, best: false },
  { name: 'Decision Tree', f1: 81.9, accuracy: 80.7, best: false },
  { name: 'MLP', f1: 90.6, accuracy: 89.8, best: false },
];

const topFeatures = [
  { name: 'Nivel de Triage', importance: 100 },
  { name: 'Glasgow', importance: 87 },
  { name: 'Saturación O₂', importance: 78 },
  { name: 'Procalcitonina', importance: 72 },
  { name: 'Score Fisiológico', importance: 65 },
  { name: 'Leucocitos', importance: 58 },
  { name: 'Proteína C Reactiva', importance: 52 },
  { name: 'NLR', importance: 47 },
  { name: 'FC Percentil', importance: 41 },
  { name: 'Temperatura', importance: 36 },
];

const confusionMatrix = [
  [48, 2, 0],
  [3, 24, 1],
  [0, 0, 9],
];

const classLabels = ['Leve', 'Moderada', 'Severa'];

function getBarColor(index) {
  const colors = ['var(--accent)', 'var(--chart-blue)', 'var(--chart-purple)', 'var(--chart-orange)', 'var(--chart-pink)'];
  return colors[index % colors.length];
}

export default function RendimientoPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const translatedClassLabels = [t('mild'), t('moderate'), t('severe')];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('performanceTitle')}</h1>
        <p>{t('performanceSubtitle')}</p>
      </div>

      {/* Key Metrics */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(230,0,35,0.12)', color: 'var(--accent)' }}>🎯</div>
          <div className="kpi-value">94.3%</div>
          <div className="kpi-label">{t('modelAccuracy')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(212,168,67,0.12)', color: 'var(--unisinu-gold)' }}>📊</div>
          <div className="kpi-value">95.5%</div>
          <div className="kpi-label">{t('f1MacroScore')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(100,0,0,0.15)', color: '#e6768a' }}>📈</div>
          <div className="kpi-value">0.98</div>
          <div className="kpi-label">{t('aucRocAvg')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(52,211,153,0.12)', color: 'var(--severity-low)' }}>🛡️</div>
          <div className="kpi-value">0</div>
          <div className="kpi-label">{t('severeToMildErrors')}</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Confusion Matrix */}
        <div className="card">
          <div className="card-header">
            <h3>{t('confusionMatrixLabel')}</h3>
            <span className="badge badge-info">Test Set</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 700 }}>
              {t('predicted')}
            </div>
            <div className="confusion-matrix size-3">
              {/* Top-left corner (empty) */}
              <div className="cm-header" />
              {/* Column headers */}
              {translatedClassLabels.map(l => <div key={'h-' + l} className="cm-header">{l}</div>)}
              {/* Rows */}
              {confusionMatrix.map((row, i) => (
                <>
                  <div key={'r-' + i} className="cm-header cm-label-vertical">{translatedClassLabels[i]}</div>
                  {row.map((val, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`cm-cell ${i === j ? 'cm-diagonal' : val === 0 ? 'cm-zero' : 'cm-off'}`}
                    >
                      {val}
                    </div>
                  ))}
                </>
              ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {t('actual')}
            </div>
          </div>
        </div>

        {/* Top Feature Importance */}
        <div className="card">
          <div className="card-header">
            <h3>{t('variableImportanceShap')}</h3>
          </div>
          <div className="feature-bar-chart">
            {topFeatures.map((f, i) => (
              <div className="feature-item" key={f.name}>
                <span className="feature-name">{f.name}</span>
                <div className="feature-bar-wrapper">
                  <div
                    className="feature-bar-fill"
                    style={{
                      width: mounted ? f.importance + '%' : '0%',
                      background: `linear-gradient(90deg, ${getBarColor(i)}, ${getBarColor(i)}88)`,
                    }}
                  />
                </div>
                <span className="feature-value">{f.importance}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Models Comparison */}
      <div className="card">
        <div className="card-header">
          <h3>{t('modelsComparison')}</h3>
        </div>
        {modelsData
          .sort((a, b) => b.f1 - a.f1)
          .map((model) => (
            <div className="model-comparison-row" key={model.name}>
              <span className="model-name">
                {model.best && <span style={{ color: 'var(--accent)', marginRight: '0.35rem' }}>★</span>}
                {model.name}
              </span>
              <div className="model-score-bar">
                <div
                  className="model-score-fill"
                  style={{
                    width: mounted ? (model.f1 / 100 * 100) + '%' : '0%',
                    background: model.best
                      ? 'linear-gradient(90deg, var(--accent), var(--chart-blue))'
                      : 'linear-gradient(90deg, var(--border-hover), var(--text-muted))',
                  }}
                />
              </div>
              <span className="model-score-value" style={{ color: model.best ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {model.f1}%
              </span>
            </div>
          ))}
      </div>

      {/* Methodology note */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h3>{t('methodologyNote')}</h3>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>
          <p>
            {t('methodologyP1')}
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            {t('methodologyP2')}
          </p>
        </div>
      </div>
    </div>
  );
}
