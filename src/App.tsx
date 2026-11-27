import { useState } from 'react'
import './App.css'
import { predict } from './model/predict'

type EpilepsyType = 'U' | 'F' | 'G' | 'FG';

interface FormData {
  Gender: boolean;
  'Age of seizure onset': number;
  'IED presence at diagnosis': boolean;
  'Abnormal MRI findings': boolean;
  'Classified as self-limited epilepsy'?: boolean;
  'Significant Epilepsy Etiology': boolean;
  'Developmental delay': boolean;
  'Family history of epilepsy': boolean;
  'History of febrile seizure': boolean;
  'Epilepsy type': EpilepsyType;
  'History of status epilepticus at diagnosis': boolean;
  '# of sz. before withdrawal': number;
  'Epilepsy duration before withdrawal': number;
  'Sz. free interval before withdrawal': number;
  '# of ASM before withdrawal': number;
  'IED presence before withdrawal': boolean;
}

interface PredictionResult {
  probability: number;
  prediction: number;
  success_relapse: string;
}

const DEFAULT_FORM_DATA: FormData = {
  Gender: true,
  'Age of seizure onset': 0,
  'IED presence at diagnosis': false,
  'Abnormal MRI findings': false,
  'Classified as self-limited epilepsy': false,
  'Significant Epilepsy Etiology': false,
  'Developmental delay': false,
  'Family history of epilepsy': false,
  'History of febrile seizure': false,
  'Epilepsy type': 'U',
  'History of status epilepticus at diagnosis': false,
  '# of sz. before withdrawal': 0,
  'Epilepsy duration before withdrawal': 0,
  'Sz. free interval before withdrawal': 0,
  '# of ASM before withdrawal': 1,
  'IED presence before withdrawal': false,
};

function App() {
  const [modelMode, setModelMode] = useState<'combined' | 'self_removed'>('combined');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === '# of sz. before withdrawal') {
        setFormData(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Computed in the browser; no data leaves this page.
      setResult(predict(modelMode, { ...formData }));
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const PRESETS_COMBINED: Record<string, FormData> = {
    'Combined Case 1': {
      Gender: true,
      'Age of seizure onset': 45,
      'IED presence at diagnosis': true,
      'Abnormal MRI findings': false,
      'Classified as self-limited epilepsy': false,
      'Significant Epilepsy Etiology': false,
      'Developmental delay': false,
      'Family history of epilepsy': false,
      'History of febrile seizure': true,
      'Epilepsy type': 'U',
      'History of status epilepticus at diagnosis': true,
      '# of sz. before withdrawal': 0,
      'Epilepsy duration before withdrawal': 34,
      'Sz. free interval before withdrawal': 40,
      '# of ASM before withdrawal': 1,
      'IED presence before withdrawal': false,
    },
    'Combined Case 2': {
      Gender: false,
      'Age of seizure onset': 120,
      'IED presence at diagnosis': true,
      'Abnormal MRI findings': true,
      'Classified as self-limited epilepsy': false,
      'Significant Epilepsy Etiology': true,
      'Developmental delay': true,
      'Family history of epilepsy': false,
      'History of febrile seizure': false,
      'Epilepsy type': 'F',
      'History of status epilepticus at diagnosis': false,
      '# of sz. before withdrawal': 1,
      'Epilepsy duration before withdrawal': 10,
      'Sz. free interval before withdrawal': 33,
      '# of ASM before withdrawal': 2,
      'IED presence before withdrawal': false,
    },
    'Combined Case 3': {
      Gender: true,
      'Age of seizure onset': 126,
      'IED presence at diagnosis': true,
      'Abnormal MRI findings': false,
      'Classified as self-limited epilepsy': true,
      'Significant Epilepsy Etiology': false,
      'Developmental delay': false,
      'Family history of epilepsy': false,
      'History of febrile seizure': false,
      'Epilepsy type': 'F',
      'History of status epilepticus at diagnosis': false,
      '# of sz. before withdrawal': 0,
      'Epilepsy duration before withdrawal': 4,
      'Sz. free interval before withdrawal': 59,
      '# of ASM before withdrawal': 1,
      'IED presence before withdrawal': false,
    }
  };

  const PRESETS_SELF_REMOVED: Record<string, FormData> = {
    'SR Case 1': {
      Gender: false,
      'Age of seizure onset': 120,
      'IED presence at diagnosis': true,
      'Abnormal MRI findings': true,
      'Significant Epilepsy Etiology': true,
      'Developmental delay': true,
      'Family history of epilepsy': false,
      'History of febrile seizure': false,
      'Epilepsy type': 'F',
      'History of status epilepticus at diagnosis': false,
      '# of sz. before withdrawal': 1,
      'Epilepsy duration before withdrawal': 10,
      'Sz. free interval before withdrawal': 33,
      '# of ASM before withdrawal': 2,
      'IED presence before withdrawal': false,
    },
    'SR Case 2': {
      Gender: true,
      'Age of seizure onset': 45,
      'IED presence at diagnosis': true,
      'Abnormal MRI findings': false,
      'Significant Epilepsy Etiology': false,
      'Developmental delay': false,
      'Family history of epilepsy': false,
      'History of febrile seizure': true,
      'Epilepsy type': 'U',
      'History of status epilepticus at diagnosis': true,
      '# of sz. before withdrawal': 0,
      'Epilepsy duration before withdrawal': 34,
      'Sz. free interval before withdrawal': 40,
      '# of ASM before withdrawal': 1,
      'IED presence before withdrawal': false,
    },
    'SR Case 3': {
      Gender: true,
      'Age of seizure onset': 150,
      'IED presence at diagnosis': true,
      'Abnormal MRI findings': true,
      'Significant Epilepsy Etiology': true,
      'Developmental delay': false,
      'Family history of epilepsy': false,
      'History of febrile seizure': false,
      'Epilepsy type': 'F',
      'History of status epilepticus at diagnosis': false,
      '# of sz. before withdrawal': 0,
      'Epilepsy duration before withdrawal': 0,
      'Sz. free interval before withdrawal': 85,
      '# of ASM before withdrawal': 1,
      'IED presence before withdrawal': false,
    }
  };

  const currentPresets = modelMode === 'combined' ? PRESETS_COMBINED : PRESETS_SELF_REMOVED;

  const loadPreset = (presetName: string) => {
    const preset = currentPresets[presetName];
    setFormData({
      ...preset,
      // Handle the optional feature correctly when switching presets
      'Classified as self-limited epilepsy': modelMode === 'combined' ? (preset['Classified as self-limited epilepsy'] ?? false) : undefined
    });
    setResult(null);
  };

  const handleReset = () => {
    setFormData({
      ...DEFAULT_FORM_DATA,
      'Classified as self-limited epilepsy': modelMode === 'combined' ? false : undefined
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="container">
      <button className="info-btn" onClick={() => setShowInfo(true)}>About</button>

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowInfo(false)}>&times;</button>
            <h2>About the Study</h2>
            <section>
              <h3>Study Population</h3>
              <p>Retrospective study of pediatric-onset epilepsy patients at Seoul National University Bundang Hospital (Jun 2003–Aug 2025).</p>
            </section>
            <section>
              <h3>Inclusion Criteria</h3>
              <ul>
                <li>Attempted antiseizure medication (ASM) withdrawal</li>
              </ul>
            </section>
            <section>
              <h3>Outcome Definition</h3>
              <p><strong>Withdrawal Success:</strong> Remained seizure-free for ≥12 months after complete ASM discontinuation.</p>
            </section>
            <section>
              <h3>Methodology</h3>
              <p>Seven model families were compared (logistic regression, elastic net, SVM, random forest, gradient boosting, XGBoost, LightGBM) using nested cross-validation (5 outer folds × 3 repeats). Folds were grouped by patient so that no patient appears in both training and scoring. Feature selection and hyperparameter tuning were performed inside each fold, and no class rebalancing was applied, to preserve calibrated probabilities. The model family with the lowest Brier score was selected and refit on the full cohort: elastic net (penalized logistic regression) for both cohorts. Feature contributions were examined with SHAP.</p>
            </section>
            <section>
              <h3>Clinical Grouping</h3>
              <p>Two cohorts were analyzed. All Epilepsies: 314 patients (70.1% successful withdrawal). Self-Limited Epilepsy Excluded: a subset of 188 patients (52.7% successful withdrawal), providing specialized predictions for non-self-limited epilepsies.</p>
            </section>
          </div>
        </div>
      )}

      <header>
        <h1>ASM Medication Withdrawal Outcome Predictor</h1>
        <p className="subtitle">Clinical Decision Support Tool</p>
      </header>

      <div className="mode-toggle">
        <button 
          className={modelMode === 'combined' ? 'active' : ''} 
          onClick={() => { setModelMode('combined'); setResult(null); }}
        >
          All Epilepsies
        </button>
        <button 
          className={modelMode === 'self_removed' ? 'active' : ''} 
          onClick={() => { setModelMode('self_removed'); setResult(null); }}
        >
          Self-Limited Epilepsy Excluded
        </button>
      </div>

      <main className="content-3-col">
        <aside className="presets-column">
          <div className="presets-container">
            <h3>{modelMode === 'combined' ? 'All Epilepsies' : 'Self-Limited Epilepsy Excluded'} Presets</h3>
            <div className="presets-list">
              {Object.keys(currentPresets).map(name => (
                <button key={name} type="button" onClick={() => loadPreset(name)} className="preset-btn">
                  {name}
                </button>
              ))}
            </div>
            <button type="button" onClick={handleReset} className="reset-btn">
              Reset to Default
            </button>
          </div>
        </aside>

        <section className="form-column">
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-grid">
              {/* Categorical/Boolean features */}
              <div className="form-group">
                <label>Gender</label>
                <select name="Gender" value={formData.Gender ? 'true' : 'false'} onChange={(e) => setFormData(p => ({...p, Gender: e.target.value === 'true'}))}>
                  <option value="true">Male</option>
                  <option value="false">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Epilepsy Type</label>
                <select name="Epilepsy type" value={formData['Epilepsy type']} onChange={handleInputChange}>
                  <option value="U">Unclassified</option>
                  <option value="F">Focal</option>
                  <option value="G">Generalized</option>
                  <option value="FG">Focal & Generalized</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="IED presence at diagnosis" checked={formData['IED presence at diagnosis']} onChange={handleInputChange} />
                  IED at diagnosis
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="Abnormal MRI findings" checked={formData['Abnormal MRI findings']} onChange={handleInputChange} />
                  Abnormality related to MRI on Epileptic Seizure
                </label>
              </div>

              {modelMode === 'combined' && (
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="Classified as self-limited epilepsy" checked={formData['Classified as self-limited epilepsy']} onChange={handleInputChange} />
                    Self-limited epilepsy
                  </label>
                </div>
              )}

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="Significant Epilepsy Etiology" checked={formData['Significant Epilepsy Etiology']} onChange={handleInputChange} />
                  Significant Epilepsy Etiology
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="Developmental delay" checked={formData['Developmental delay']} onChange={handleInputChange} />
                  Presence of developmental delay
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="Family history of epilepsy" checked={formData['Family history of epilepsy']} onChange={handleInputChange} />
                  Presence of family history of epilepsy (1st degree)
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="History of febrile seizure" checked={formData['History of febrile seizure']} onChange={handleInputChange} />
                  Presence of febrile seizure history
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="History of status epilepticus at diagnosis" checked={formData['History of status epilepticus at diagnosis']} onChange={handleInputChange} />
                  Presence of status epilepticus history
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="IED presence before withdrawal" checked={formData['IED presence before withdrawal']} onChange={handleInputChange} />
                  IED before ASM withdrawal
                </label>
              </div>

              <div className="form-group">
                <label>Seizure burden before withdrawal</label>
                <select name="# of sz. before withdrawal" value={formData['# of sz. before withdrawal']} onChange={handleInputChange}>
                  <option value="0">Number of seizures less than 10 times before withdrawal</option>
                  <option value="1">Number of seizures greater than or equal to 10 times before withdrawal</option>
                </select>
              </div>

              {/* Numerical features */}
              <div className="form-group">
                <label>Age onset (months)</label>
                <input type="number" name="Age of seizure onset" value={formData['Age of seizure onset']} onChange={handleInputChange} min="0" />
              </div>

              <div className="form-group">
                <label>Duration from seizure onset to last seizure (months)</label>
                <input type="number" name="Epilepsy duration before withdrawal" value={formData['Epilepsy duration before withdrawal']} onChange={handleInputChange} min="0" />
              </div>

              <div className="form-group">
                <label>Seizure free interval (months)</label>
                <input type="number" name="Sz. free interval before withdrawal" value={formData['Sz. free interval before withdrawal']} onChange={handleInputChange} min="0" />
              </div>

              <div className="form-group">
                <label>Number of ASM at withdrawal</label>
                <input type="number" name="# of ASM before withdrawal" value={formData['# of ASM before withdrawal']} onChange={handleInputChange} min="1" />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Predict Outcome'}
            </button>
          </form>

          <div className="definition-box">
            <h2>Information & Definitions</h2>
            
            <div className="def-section">
              <h3>Result Interpretation</h3>
              <p><strong>Success Probability:</strong> The likelihood of achieving "Withdrawal Success," which means remaining seizure-free for at least 12 months after completely stopping antiseizure medication (ASM).</p>
            </div>

            <div className="def-section">
              <h3>Clinical Grouping</h3>
              <div className="def-grid">
                <div className="def-item">
                  <dt>All Epilepsies</dt>
                  <dd>Includes the entire cohort of pediatric patients who attempted ASM withdrawal after becoming seizure-free.</dd>
                </div>
                <div className="def-item">
                  <dt>Self-Limited Excluded</dt>
                  <dd>Excludes syndromes that often resolve naturally (e.g., Benign Epilepsy with Centrotemporal Spikes). This model provides a more conservative estimate for patients with non-self-limiting epilepsy.</dd>
                </div>
              </div>
            </div>

            <div className="def-section">
              <h3>Glossary of Terms</h3>
              <div className="def-grid">
                <div className="def-item">
                  <dt>IED</dt>
                  <dd>Interictal Epileptiform Discharge – Abnormal brain waves (spikes/sharp waves) detected on EEG between clinical seizures.</dd>
                </div>
                <div className="def-item">
                  <dt>Status Epilepticus</dt>
                  <dd>A prolonged seizure (lasting more than 5 minutes) or a series of seizures without recovery of consciousness in between.</dd>
                </div>
                <div className="def-item">
                  <dt>Etiology</dt>
                  <dd>The underlying cause of epilepsy, such as structural brain abnormalities, genetic factors, or previous infections.</dd>
                </div>
                <div className="def-item">
                  <dt>Seizure Burden</dt>
                  <dd>The cumulative total of seizures experienced by the patient before the start of the medication withdrawal process.</dd>
                </div>
                <div className="def-item">
                  <dt>Febrile Seizure</dt>
                  <dd>A convulsion in a child caused by a spike in body temperature, often from an infection.</dd>
                </div>
                <div className="def-item">
                  <dt>Developmental Delay</dt>
                  <dd>When a child does not reach developmental milestones (such as walking or talking) at the expected age.</dd>
                </div>
                <div className="def-item">
                  <dt>Seizure-Free Interval</dt>
                  <dd>The continuous period during which the patient has not experienced any seizures prior to attempting ASM withdrawal.</dd>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="results-column">
          {error && <div className="error-msg">{error}</div>}
          
          {result ? (
            <div className="result-card">
              <div className="probability-bar">
                <div
                  className="probability-fill"
                  style={{ width: `${result.probability * 100}%` }}
                ></div>
              </div>
              <p className="probability-text">Success Probability: {(result.probability * 100).toFixed(1)}%</p>
              <p className="disclaimer">For research only.</p>
            </div>
          ) : (
            <div className="result-placeholder">
              <p>Enter data and click Predict to see outcome</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
