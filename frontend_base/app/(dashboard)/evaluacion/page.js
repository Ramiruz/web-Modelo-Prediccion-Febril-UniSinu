'use client';
import { useState } from 'react';
import TriageTepModal from '../../components/TriageTepModal';
import { useLanguage } from '../../context/LanguageContext';

function simulatePrediction(data) {
  let score = 0;
  // Triage level is the strongest predictor
  let triage = 3;
  if (data.triage === 'Nivel I' || String(data.triage) === '1') triage = 1;
  else if (data.triage === 'Nivel II' || String(data.triage) === '2') triage = 2;
  else if (data.triage === 'Nivel III' || String(data.triage) === '3') triage = 3;
  else if (data.triage === 'Nivel IV' || String(data.triage) === '4') triage = 4;
  else if (data.triage === 'Nivel V' || String(data.triage) === '5') triage = 5;
  else triage = parseInt(data.triage) || 3;

  if (triage <= 2) score += 50;  // Garantiza Severidad inmediata (>= 50)
  else if (triage === 3) score += 25; // Garantiza Moderada (>= 25)
  else score += 0;

  // Glasgow
  const glasgow = parseInt(data.glasgow) || 15;
  if (glasgow < 9) score += 30;
  else if (glasgow < 13) score += 15;
  else score += 0;

  // SO2
  const so2 = parseFloat(data.so2) || 97;
  if (so2 < 90) score += 25;
  else if (so2 < 94) score += 12;
  else score += 0;

  // Procalcitonina
  const pct = parseFloat(data.procalcitonina) || 0;
  if (pct > 2) score += 20;
  else if (pct > 0.5) score += 10;
  else score += 0;

  // Temperature
  const temp = parseFloat(data.temperatura) || 37;
  if (temp >= 40) score += 10;
  else if (temp >= 39) score += 5;

  // Leucocitos
  const leu = parseFloat(data.leucocitos) || 8000;
  if (leu > 15000 || leu < 4000) score += 8;

  // FC (tachycardia)
  const fc = parseInt(data.fc) || 100;
  const age = parseFloat(data.edad) || 3;
  const fcThreshold = age < 1 ? 160 : age < 5 ? 140 : 120;
  if (fc > fcThreshold) score += 7;

  // Determine severity
  let severity, confidence;
  if (score >= 50) {
    severity = 'Severa';
    confidence = { leve: Math.max(2, 10 - score * 0.05), moderada: Math.max(5, 30 - score * 0.2), severa: Math.min(98, 60 + score * 0.3) };
  } else if (score >= 25) {
    severity = 'Moderada';
    confidence = { leve: Math.max(5, 25 - score * 0.3), moderada: Math.min(90, 50 + score * 0.5), severa: Math.max(5, score * 0.3) };
  } else {
    severity = 'Leve';
    confidence = { leve: Math.min(96, 80 + (25 - score)), moderada: Math.max(3, score * 0.6), severa: Math.max(1, score * 0.2) };
  }

  // Normalize
  const total = confidence.leve + confidence.moderada + confidence.severa;
  confidence.leve = Math.round((confidence.leve / total) * 100);
  confidence.moderada = Math.round((confidence.moderada / total) * 100);
  confidence.severa = 100 - confidence.leve - confidence.moderada;

  // Key factors
  const factors = [];
  if (triage <= 2) factors.push({ key: 'factorTriage' });
  if (glasgow < 13) factors.push({ key: 'factorGlasgow', val: `(${glasgow})` });
  if (so2 < 94) factors.push({ key: 'factorHipoxia', val: `${so2}%)` });
  if (pct > 0.5) factors.push({ key: 'factorPct', val: `(${pct} ng/mL)` });
  if (temp >= 39) factors.push({ key: 'factorFiebre', val: `(${temp}°C)` });
  if (leu > 15000) factors.push({ key: 'factorLeucoAlta', val: `(${leu} cel/mm³)` });
  if (leu < 4000) factors.push({ key: 'factorLeucoBaja', val: `(${leu} cel/mm³)` });
  if (fc > fcThreshold) factors.push({ key: 'factorTaqui', val: `${fc})` });
  if (factors.length === 0) factors.push({ key: 'factorsLowRes' });

  return { severity, confidence, factors };
}

const initialFormData = {
  edad: '', sexo: 'Femenino', peso: '', talla: '', area: 'Urban',
  temperatura: '', fc: '', fr: '', so2: '', glasgow: '15',
  leucocitos: '', hemoglobina: '', plaquetas: '', pcr: '',
  procalcitonina: '', nlr: '',
  triage: '',
};

export default function EvaluacionPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const prediction = simulatePrediction(formData);
    setResult(prediction);
    setShowModal(true);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResult(null);
  };

  const severityIcon = { Leve: '✅', Moderada: '⚠️', Severa: '🚨' };
  const severityClass = { Leve: 'leve', Moderada: 'moderada', Severa: 'severa' };
  const barColor = { leve: 'var(--severity-low)', moderada: 'var(--severity-mid)', severa: 'var(--severity-high)' };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('evaluationTitle')}</h1>
        <p>{t('evaluationSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Datos Demográficos */}
        <div className="form-section">
          <div className="form-section-title">{t('demographics')}</div>
          <div className="form-grid">
            <div className="input-group">
              <label>{t('ageYears')}</label>
              <input className="input" type="number" name="edad" value={formData.edad} onChange={handleChange} placeholder="Ej: 3" min="0" max="17" step="0.1" required />
            </div>
            <div className="input-group">
              <label>{t('sex')}</label>
              <select className="select" name="sexo" value={formData.sexo} onChange={handleChange}>
                <option value="Femenino">{t('female')}</option>
                <option value="Masculino">{t('male')}</option>
              </select>
            </div>
            <div className="input-group">
              <label>{t('weightKg')}</label>
              <input className="input" type="number" name="peso" value={formData.peso} onChange={handleChange} placeholder="Ej: 14.5" step="0.1" />
            </div>
            <div className="input-group">
              <label>{t('heightCm')}</label>
              <input className="input" type="number" name="talla" value={formData.talla} onChange={handleChange} placeholder="Ej: 95" step="0.1" />
            </div>
            <div className="input-group">
              <label>{t('area')}</label>
              <select className="select" name="area" value={formData.area} onChange={handleChange}>
                <option value="Urban">{t('urban')}</option>
                <option value="Rural">{t('rural')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Signos Vitales */}
        <div className="form-section">
          <div className="form-section-title">{t('vitalSigns')}</div>
          <div className="form-grid">
            <div className="input-group">
              <label>{t('temperature')}</label>
              <input className="input" type="number" name="temperatura" value={formData.temperatura} onChange={handleChange} placeholder="Ej: 38.5" step="0.1" required />
            </div>
            <div className="input-group">
              <label>{t('heartRate')}</label>
              <input className="input" type="number" name="fc" value={formData.fc} onChange={handleChange} placeholder="Ej: 120" required />
            </div>
            <div className="input-group">
              <label>{t('respRate')}</label>
              <input className="input" type="number" name="fr" value={formData.fr} onChange={handleChange} placeholder="Ej: 28" required />
            </div>
            <div className="input-group">
              <label>{t('spO2')}</label>
              <input className="input" type="number" name="so2" value={formData.so2} onChange={handleChange} placeholder="Ej: 96" min="0" max="100" required />
            </div>
            <div className="input-group">
              <label>{t('glasgow')}</label>
              <select className="select" name="glasgow" value={formData.glasgow} onChange={handleChange}>
                {Array.from({ length: 13 }, (_, i) => 15 - i).map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Laboratorios */}
        <div className="form-section">
          <div className="form-section-title">{t('laboratories')}</div>
          <div className="form-grid">
            <div className="input-group">
              <label>{t('leukocytes')}</label>
              <input className="input" type="number" name="leucocitos" value={formData.leucocitos} onChange={handleChange} placeholder="Ej: 12000" />
            </div>
            <div className="input-group">
              <label>{t('hemoglobin')}</label>
              <input className="input" type="number" name="hemoglobina" value={formData.hemoglobina} onChange={handleChange} placeholder="Ej: 11.5" step="0.1" />
            </div>
            <div className="input-group">
              <label>{t('platelets')}</label>
              <input className="input" type="number" name="plaquetas" value={formData.plaquetas} onChange={handleChange} placeholder="Ej: 250000" />
            </div>
            <div className="input-group">
              <label>{t('crp')}</label>
              <input className="input" type="number" name="pcr" value={formData.pcr} onChange={handleChange} placeholder="Ej: 1.2" step="0.1" />
            </div>
            <div className="input-group">
              <label>{t('procalcitonin')}</label>
              <input className="input" type="number" name="procalcitonina" value={formData.procalcitonina} onChange={handleChange} placeholder="Ej: 0.3" step="0.01" />
            </div>
            <div className="input-group">
              <label>{t('nlr')}</label>
              <input className="input" type="number" name="nlr" value={formData.nlr} onChange={handleChange} placeholder="Ej: 3.5" step="0.1" />
            </div>
          </div>
        </div>

        {/* Triage */}
        <div className="form-section">
          <div className="form-section-title">{t('triageClassification')}</div>
          <div className="form-grid">
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <TriageTepModal
                value={formData.triage}
                onChange={(val) => setFormData({ ...formData, triage: val })}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            {t('getPrediction')}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={handleReset}>
            {t('clearForm')}
          </button>
        </div>
      </form>

      {/* Prediction Modal */}
      {showModal && result && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('predictionResult')}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="prediction-result">
              <div className={`prediction-severity ${severityClass[result.severity]}`}>
                {severityIcon[result.severity]}
              </div>
              <div className="prediction-label" style={{ color: result.severity === 'Leve' ? 'var(--severity-low)' : result.severity === 'Moderada' ? 'var(--severity-mid)' : 'var(--severity-high)' }}>
                {result.severity === 'Leve' ? t('mild') : result.severity === 'Moderada' ? t('moderate') : t('severe')}
              </div>
              <div className="prediction-confidence">
                {t('modelConfidence')}
              </div>
            </div>

            {/* Confidence Bars */}
            <div className="confidence-bars">
              {['leve', 'moderada', 'severa'].map((key) => (
                <div className="confidence-item" key={key}>
                  <div className="confidence-label">
                    <span>{key === 'leve' ? t('mild') : key === 'moderada' ? t('moderate') : t('severe')}</span>
                    <span>{result.confidence[key]}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: result.confidence[key] + '%', background: barColor[key] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Key Factors */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('contributingFactors')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {result.factors.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent)' }}>•</span> {t(f.key)} {f.val || ''}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
              onClick={() => setShowModal(false)}
            >
              {t('understood')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
