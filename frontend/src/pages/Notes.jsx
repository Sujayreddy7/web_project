import React, { useState, useEffect } from 'react';
import { getNotes, createNote, summarizeNoteAI, askQuestionAI } from '../services/api';
import { Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [summarizingId, setSummarizingId] = useState(null);
  const [savedSummaries, setSavedSummaries] = useState({});
  const [savedErrors, setSavedErrors] = useState({});

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    getNotes().then(res => setNotes(res.data)).catch(console.error);
  };

  const handleSaveNote = async () => {
    if(!title || !content) return;
    try {
      await createNote({ title, content });
      setTitle(''); setContent('');
      fetchNotes();
    } catch(err) { console.error(err); }
  };

  const handleSummarize = async () => {
    if (!content) return;
    setLoading(true);
    setAiSummary('');
    setSummaryError('');
    try {
      const res = await summarizeNoteAI({ content });
      if (res.data.summary) {
        setAiSummary(res.data.summary);
      } else if (res.data.error) {
        setSummaryError(res.data.error);
      } else {
        setSummaryError('No summary generated.');
      }
    } catch(err) {
      const msg = err.response?.data?.error || 'Failed to connect to AI backend.';
      setSummaryError(msg);
    }
    setLoading(false);
  };

  const handleSummarizeSavedNote = async (id) => {
    setSummarizingId(id);
    setSavedErrors(prev => ({ ...prev, [id]: '' }));
    try {
      const res = await summarizeNoteAI({ note_id: id });
      if (res.data.summary) {
        setSavedSummaries(prev => ({ ...prev, [id]: res.data.summary }));
        fetchNotes();
      } else {
        setSavedErrors(prev => ({ ...prev, [id]: res.data.error || 'No summary returned.' }));
      }
    } catch(err) {
      const msg = err.response?.data?.error || 'Failed to summarize note.';
      setSavedErrors(prev => ({ ...prev, [id]: msg }));
    }
    setSummarizingId(null);
  };

  const handleAskQuestion = async () => {
    if (!content || !question) return;
    setLoading(true);
    setAnswer('');
    setAnswerError('');
    try {
      const res = await askQuestionAI({ content, question });
      if (res.data.answer) {
        setAnswer(res.data.answer);
      } else if (res.data.error) {
        setAnswerError(res.data.error);
      } else {
        setAnswerError('No answer returned from AI.');
      }
    } catch(err) {
      const msg = err.response?.data?.error || 'Failed to get AI answer.';
      setAnswerError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="text-2xl font-bold">Notes &amp; AI Assistant</h2>
        <p className="text-muted">Jot down notes and use AI to summarize or query them.</p>
      </div>

      <div className="grid md:grid-cols-2">
        {/* Editor Area */}
        <div className="card flex-col gap-4">
          <input
            className="input-field"
            placeholder="Note Title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="input-field"
            placeholder="Start typing your notes here. You can ask AI about this context."
            rows="8"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" onClick={handleSaveNote}>Save Note</button>
            <button className="btn-outline flex items-center gap-2" onClick={handleSummarize} disabled={loading}>
              <Sparkles size={18} />
              {loading ? "Thinking..." : "AI Summarize"}
            </button>
          </div>

          {/* Summary Success */}
          {aiSummary && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99,102,241,0.05)', borderRadius: 'var(--radius)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <h4 className="font-bold flex items-center gap-2" style={{ color: 'var(--primary-color)' }}>
                <Sparkles size={16}/> Summary
              </h4>
              <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{aiSummary}</p>
            </div>
          )}

          {/* Summary Error */}
          {summaryError && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: 'var(--radius)', border: '1px solid #fecaca', color: '#991b1b', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Error:</strong> {summaryError}</span>
            </div>
          )}
        </div>

        {/* AI QA & Saved Notes */}
        <div className="flex-col gap-4">
          <div className="card">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <MessageCircle size={20} /> Ask AI about Draft
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Type notes in the editor on the left, then ask a question below.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="input-field"
                placeholder="E.g., What is the main point?"
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
              <button className="btn-primary" onClick={handleAskQuestion} disabled={loading || !content}>Ask</button>
            </div>

            {/* Answer Success */}
            {answer && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99,102,241,0.05)', borderRadius: 'var(--radius)', border: '1px solid rgba(99,102,241,0.2)', whiteSpace: 'pre-wrap' }}>
                <strong style={{ color: 'var(--primary-color)' }}>AI says:</strong> {answer}
              </div>
            )}

            {/* Answer Error */}
            {answerError && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef2f2', borderRadius: 'var(--radius)', border: '1px solid #fecaca', color: '#991b1b', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span><strong>Error:</strong> {answerError}</span>
              </div>
            )}
          </div>

          {notes.length > 0 && (
            <div className="card mt-4">
              <h3 className="font-bold mb-4">Recent Notes</h3>
              <div className="flex-col gap-2">
                {notes.map(n => (
                  <div key={n.id} style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="font-bold">{n.title}</div>
                      <button
                        className="btn-outline flex items-center gap-1"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => handleSummarizeSavedNote(n.id)}
                        disabled={summarizingId === n.id}
                      >
                        <Sparkles size={14} /> {summarizingId === n.id ? "Thinking..." : "Summarize"}
                      </button>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      {n.content && n.content.substring(0, 80)}...
                    </div>
                    {(savedSummaries[n.id] || n.summary) && (
                      <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(99,102,241,0.05)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
                        <strong>Summary:</strong> {savedSummaries[n.id] || n.summary}
                      </div>
                    )}
                    {savedErrors[n.id] && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fef2f2', borderRadius: 'var(--radius)', fontSize: '0.85rem', color: '#991b1b' }}>
                        <strong>Error:</strong> {savedErrors[n.id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
