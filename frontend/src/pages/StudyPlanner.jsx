import React, { useState, useEffect } from 'react';
import { generatePlanAI, getStudyPlans, createStudyPlan } from '../services/api';
import { Calendar, Wand2, AlertCircle } from 'lucide-react';

const StudyPlanner = () => {
  const [plans, setPlans] = useState([]);
  const [subjects, setSubjects] = useState('');
  const [deadline, setDeadline] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [planError, setPlanError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    getStudyPlans().then(res => setPlans(res.data)).catch(console.error);
  };

  const handleGenerate = async () => {
    if (!subjects || !deadline) return;
    setLoading(true);
    setGeneratedPlan('');
    setPlanError('');
    try {
      const subjectList = subjects.split(',').map(s => s.trim());
      const res = await generatePlanAI({ subjects: subjectList, deadline });
      if (res.data.plan) {
        setGeneratedPlan(res.data.plan);
        // Auto save plan
        await createStudyPlan({ title: `Plan for ${subjects} until ${deadline}`, plan_content: res.data.plan });
        fetchPlans();
      } else if (res.data.error) {
        setPlanError(res.data.error);
      } else {
        setPlanError('No plan returned from AI.');
      }
    } catch(err) {
      const msg = err.response?.data?.error || 'Failed to connect to AI backend.';
      setPlanError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar /> Study Planner
        </h2>
        <p className="text-muted">Generate dynamic study schedules using AI.</p>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="card flex-col gap-4">
          <h3 className="font-bold">Plan Configuration</h3>
          <div>
            <label className="text-muted" style={{ fontSize: '0.875rem' }}>Subjects (comma separated)</label>
            <input
              className="input-field mt-4"
              style={{ marginTop: '0.25rem' }}
              placeholder="Math, Physics, History..."
              value={subjects}
              onChange={e => setSubjects(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label className="text-muted" style={{ fontSize: '0.875rem' }}>Target Deadline</label>
            <input
              type="date"
              className="input-field mt-4"
              style={{ marginTop: '0.25rem' }}
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
            />
          </div>
          <button
            className="btn-primary flex items-center gap-2 mt-4"
            onClick={handleGenerate}
            disabled={loading || !subjects || !deadline}
            style={{ alignSelf: 'flex-start' }}
          >
            <Wand2 size={18} />
            {loading ? 'Generating...' : 'Generate AI Plan'}
          </button>
        </div>

        <div className="card">
          <h3 className="font-bold mb-4">Generated Plan</h3>

          {/* Plan Success */}
          {generatedPlan && (
            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-main)', background: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
              {generatedPlan}
            </div>
          )}

          {/* Plan Error */}
          {planError && (
            <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: 'var(--radius)', border: '1px solid #fecaca', color: '#991b1b', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Error:</strong> {planError}</span>
            </div>
          )}

          {/* Empty State */}
          {!generatedPlan && !planError && (
            <div className="text-muted text-center" style={{ padding: '2rem 0' }}>
              Your generated AI plan will appear here.
            </div>
          )}
        </div>
      </div>

      {/* Saved Plans */}
      {plans.length > 0 && (
        <div className="card mt-4">
          <h3 className="font-bold mb-4">Saved Plans</h3>
          <div className="flex-col gap-3">
            {plans.map(p => (
              <div key={p.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}>
                <div className="font-bold mb-2">{p.title}</div>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {p.plan_content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
