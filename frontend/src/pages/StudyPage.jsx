import { useState } from 'react';
import { generateQuiz, generateSummary, saveScore, uploadPdf } from '../services/api';

export default function StudyPage() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState('');

  const handleSummary = async () => {
    if (!content.trim()) return alert('Please paste your content first!');
    setLoading('summary');
    try {
      const res = await generateSummary(content);
      setSummary(res.data.summary);
      setActiveTab('summary');
    } catch (err) {
      alert('Failed to generate summary. Please try again.');
    } finally {
      setLoading('');
    }
  };

  const handleQuiz = async () => {
    if (!content.trim()) return alert('Please paste your content first!');
    setLoading('quiz');
    try {
      const res = await generateQuiz(content);
      const rawText = res.data.quiz;
      console.log("Raw quiz:", rawText);

      let parsed = null;

      try {
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      } catch(e) {}

      if (!parsed) {
        try {
          const codeMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (codeMatch) parsed = JSON.parse(codeMatch[1]);
        } catch(e) {}
      }

      if (!parsed) {
        try {
          parsed = JSON.parse(rawText);
        } catch(e) {}
      }

      if (parsed && parsed.length > 0) {
        setQuizData(parsed);
        setActiveTab('quiz');
        setAnswers({});
        setScore(null);
      } else {
        console.log("Raw text:", rawText);
        alert('Failed to parse quiz. Please try again.');
      }
    } catch (err) {
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading('');
    }
  };

  const handleAnswer = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const handleSubmitQuiz = async () => {
    let correct = 0;
    quizData.forEach((q, i) => {
      const userAnswer = answers[i] ? answers[i].trim().toLowerCase() : '';
      const correctAns = q.correctAnswer ? q.correctAnswer.trim().toLowerCase() : '';

      if (userAnswer === correctAns) {
        correct++;
      } else if (userAnswer.startsWith(correctAns + ' ') ||
                 userAnswer.startsWith(correctAns + '.')) {
        correct++;
      } else if (correctAns.length === 1 && userAnswer.charAt(0) === correctAns) {
        correct++;
      }
    });
    setScore(correct);
    const userId = localStorage.getItem('userId') || '1';
    await saveScore({
      userId,
      score: correct,
      totalQuestions: quizData.length
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileLoading(true);
    setUploadedFile(file.name);
    try {
      const res = await uploadPdf(file);
      if (res.data.text && res.data.text.trim()) {
        setContent(res.data.text);
        const pages = res.data.pages || '5';
        setUploadedFile(`${file.name} • ${pages} pages extracted`);
        alert(`✅ File extracted! Note: Only first 5 pages are processed for best results.`);
      } else {
        alert('No text found. Please try another file.');
        setUploadedFile('');
      }
    } catch (err) {
      if (err.response?.status === 413) {
        alert('❌ File too large! Please use a file under 10MB.');
      } else {
        alert('Failed to upload file. Please try again.');
      }
      setUploadedFile('');
    } finally {
      setFileLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const scorePercent = score !== null ? Math.round((score / quizData.length) * 100) : 0;

  return (
    <>
      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 600px) {
          .header { padding: 12px 16px !important; }
          .headerBrand { font-size: 15px !important; }
          .userName { display: none !important; }
          .main { padding: 16px 12px !important; }
          .contentArea { padding: 16px !important; }
          .actionRow { flex-direction: column !important; }
          .tabLabel { display: none !important; }
          .tab { padding: 10px 8px !important; font-size: 20px !important; }
          .scoreCircle { width: 90px !important; height: 90px !important; }
          .scoreNumber { font-size: 22px !important; }
          .uploadLabel { padding: 20px !important; }
        }
      `}</style>

      <div style={styles.page}>
        {/* Background */}
        <div style={{...styles.bgBlob, top: '-200px', left: '-200px'}} />
        <div style={{...styles.bgBlob, bottom: '-200px', right: '-200px', background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)'}} />

        {/* Header */}
        <header style={styles.header} className="header">
          <div style={styles.headerLeft}>
            <div style={styles.headerLogo}>📚</div>
            <span style={styles.headerBrand} className="headerBrand">
              SmartStudy <span style={{color: '#a5b4fc'}}>AI</span>
            </span>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.userChip}>
              <div style={styles.userAvatar}>
                {(localStorage.getItem('userName') || 'U')[0].toUpperCase()}
              </div>
              <span style={styles.userName} className="userName">
                {localStorage.getItem('userName')}
              </span>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
          </div>
        </header>

        {/* Main Content */}
        <main style={styles.main} className="main">
          {/* Tab Navigation */}
          <div style={styles.tabBar}>
            {[
              { id: 'upload', icon: '📝', label: 'Study Material' },
              { id: 'summary', icon: '✨', label: 'AI Summary' },
              { id: 'quiz', icon: '🎯', label: 'Quiz' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? {...styles.tab, ...styles.tabActive} : styles.tab}
                className="tab"
              >
                <span>{tab.icon}</span>
                <span className="tabLabel">{tab.label}</span>
                {activeTab === tab.id && <div style={styles.tabIndicator} />}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={styles.contentArea} className="contentArea">

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div style={styles.uploadSection}>
                <div style={styles.uploadZone}>
                  <label style={styles.uploadLabel} className="uploadLabel">
                    <input
                      type="file"
                      accept=".pdf,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.txt"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      disabled={fileLoading}
                    />
                    {fileLoading ? (
                      <div style={styles.uploadContent}>
                        <div style={styles.uploadSpinner}>⟳</div>
                        <p style={styles.uploadText}>Extracting text...</p>
                      </div>
                    ) : uploadedFile ? (
                      <div style={styles.uploadContent}>
                        <div style={styles.uploadSuccess}>✓</div>
                        <p style={styles.uploadFileName}>{uploadedFile}</p>
                        <p style={styles.uploadSubtext}>Click to upload different file</p>
                      </div>
                    ) : (
                      <div style={styles.uploadContent}>
                        <div style={styles.uploadIcon}>📎</div>
                        <p style={styles.uploadText}>Drop your file here or click to browse</p>
                        <div style={styles.formatChips}>
                          {['PDF', 'Word', 'Excel', 'Image', 'TXT'].map(f => (
                            <span key={f} style={styles.chip}>{f}</span>
                          ))}
                        </div>
                        <p style={styles.uploadSubtext}>Supports handwritten notes via OCR • Max 5 pages recommended</p>
                      </div>
                    )}
                  </label>
                </div>

                <div style={styles.divider}>
                  <div style={styles.dividerLine} />
                  <span style={styles.dividerText}>or paste text directly</span>
                  <div style={styles.dividerLine} />
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your chapter text, lecture notes, or any study material here..."
                  style={styles.textarea}
                />

                <div style={styles.actionRow} className="actionRow">
                  <button
                    onClick={handleSummary}
                    style={loading === 'summary' ? {...styles.btnSummary, opacity: 0.6} : styles.btnSummary}
                    disabled={loading === 'summary'}
                  >
                    {loading === 'summary' ? '⟳ Generating...' : '✨ Generate Summary'}
                  </button>
                  <button
                    onClick={handleQuiz}
                    style={loading === 'quiz' ? {...styles.btnQuiz, opacity: 0.6} : styles.btnQuiz}
                    disabled={loading === 'quiz'}
                  >
                    {loading === 'quiz' ? '⟳ Generating...' : '🎯 Generate Quiz'}
                  </button>
                </div>

                {content && (
                  <p style={styles.charCount}>{content.length.toLocaleString()} characters loaded</p>
                )}
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div style={styles.summarySection}>
                {summary ? (
                  <>
                    <div style={styles.summaryHeader}>
                      <h3 style={styles.summaryTitle}>✨ AI Generated Summary</h3>
                      <button onClick={() => setActiveTab('upload')} style={styles.backBtn}>← Back</button>
                    </div>
                    <div style={styles.summaryCard}>
                      <div style={styles.summaryText}>{summary}</div>
                    </div>
                    <button
                      onClick={handleQuiz}
                      style={loading === 'quiz'
                        ? {...styles.btnQuiz, opacity: 0.6, marginTop: '16px'}
                        : {...styles.btnQuiz, marginTop: '16px'}}
                      disabled={loading === 'quiz'}
                    >
                      {loading === 'quiz' ? '⟳ Generating...' : '🎯 Generate Quiz from this content'}
                    </button>
                  </>
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>✨</div>
                    <p style={styles.emptyText}>No summary yet</p>
                    <p style={styles.emptySubtext}>Go to Study Material tab and click Generate Summary</p>
                    <button onClick={() => setActiveTab('upload')} style={styles.btnSummary}>
                      ← Go to Study Material
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div style={styles.quizSection}>
                {quizData.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🎯</div>
                    <p style={styles.emptyText}>No quiz yet</p>
                    <p style={styles.emptySubtext}>Go to Study Material tab and click Generate Quiz</p>
                    <button onClick={() => setActiveTab('upload')} style={styles.btnQuiz}>
                      ← Go to Study Material
                    </button>
                  </div>
                ) : score !== null ? (
                  <div style={styles.scoreScreen}>
                    <div style={styles.scoreCircle} className="scoreCircle">
                      <div style={styles.scoreNumber} className="scoreNumber">{scorePercent}%</div>
                      <div style={styles.scoreLabel}>Score</div>
                    </div>
                    <h2 style={styles.scoreTitle}>
                      {scorePercent === 100 ? '🎉 Perfect Score!' :
                       scorePercent >= 70 ? '👍 Well done!' :
                       scorePercent >= 50 ? '📚 Good effort!' : '💪 Keep practicing!'}
                    </h2>
                    <p style={styles.scoreSubtitle}>
                      You got <strong style={{color: '#a5b4fc'}}>{score}</strong> out of{' '}
                      <strong style={{color: '#a5b4fc'}}>{quizData.length}</strong> questions correct
                    </p>

                    <div style={styles.reviewSection}>
                      {quizData.map((q, index) => {
                        const userAnswer = answers[index] || '';
                        const isCorrect =
                          userAnswer.trim().toLowerCase().startsWith(q.correctAnswer?.trim().toLowerCase()) ||
                          userAnswer.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();
                        return (
                          <div key={index} style={{...styles.reviewCard, borderColor: isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}}>
                            <div style={styles.reviewHeader}>
                              <span style={{color: isCorrect ? '#4ade80' : '#f87171'}}>{isCorrect ? '✓' : '✗'}</span>
                              <span style={styles.reviewQ}>Q{index + 1}. {q.question}</span>
                            </div>
                            {!isCorrect && (
                              <p style={styles.correctAns}>Correct: {q.correctAnswer}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button onClick={() => { setScore(null); setAnswers({}); }} style={styles.retryBtn}>
                      🔄 Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={styles.quizProgress}>
                      <span style={styles.quizProgressText}>
                        {Object.keys(answers).length} / {quizData.length} answered
                      </span>
                      <div style={styles.progressBar}>
                        <div style={{
                          ...styles.progressFill,
                          width: `${(Object.keys(answers).length / quizData.length) * 100}%`
                        }} />
                      </div>
                    </div>

                    {quizData.map((q, index) => (
                      <div key={index} style={styles.questionCard}>
                        <div style={styles.questionHeader}>
                          <span style={styles.questionNum}>Q{index + 1}</span>
                          <p style={styles.questionText}>{q.question}</p>
                        </div>
                        <div style={styles.optionsGrid}>
                          {q.options.map((option, i) => (
                            <div
                              key={i}
                              onClick={() => handleAnswer(index, option)}
                              style={answers[index] === option
                                ? {...styles.option, ...styles.optionSelected}
                                : styles.option}
                            >
                              <span style={styles.optionLetter}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              {/* ✅ FIX: A. B. C. D. strip kar diya */}
                              <span style={styles.optionText}>
                                {option.replace(/^[A-D]\.\s*/i, '')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleSubmitQuiz}
                      style={Object.keys(answers).length < quizData.length
                        ? {...styles.submitQuizBtn, opacity: 0.5, cursor: 'not-allowed'}
                        : styles.submitQuizBtn}
                      disabled={Object.keys(answers).length < quizData.length}
                    >
                      Submit Quiz ({Object.keys(answers).length}/{quizData.length} answered)
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bgBlob: {
    position: 'fixed',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #4338ca 0%, transparent 70%)',
    opacity: 0.08,
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(12px)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerLogo: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    background: 'rgba(99,102,241,0.2)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(99,102,241,0.3)',
    flexShrink: 0,
  },
  headerBrand: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '6px 14px 6px 6px',
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  userName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    fontWeight: '500',
  },
  logoutBtn: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  main: {
    maxWidth: '780px',
    margin: '0 auto',
    padding: '32px 20px',
    position: 'relative',
    zIndex: 1,
  },
  tabBar: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '4px',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: 'rgba(99,102,241,0.15)',
    color: '#a5b4fc',
    border: '1px solid rgba(99,102,241,0.2)',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: '-1px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '2px',
    background: '#6366f1',
    borderRadius: '2px',
  },
  contentArea: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    padding: '28px',
    minHeight: '400px',
  },
  uploadSection: { display: 'flex', flexDirection: 'column', gap: '20px' },
  uploadZone: {
    border: '2px dashed rgba(99,102,241,0.3)',
    borderRadius: '14px',
    background: 'rgba(99,102,241,0.04)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  uploadLabel: {
    display: 'block',
    cursor: 'pointer',
    padding: '32px',
  },
  uploadContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  uploadIcon: { fontSize: '36px', opacity: 0.6 },
  uploadSuccess: {
    width: '48px',
    height: '48px',
    background: 'rgba(34,197,94,0.15)',
    border: '2px solid rgba(34,197,94,0.4)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#4ade80',
  },
  uploadSpinner: {
    fontSize: '32px',
    color: '#a5b4fc',
  },
  uploadText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    margin: 0,
    textAlign: 'center',
  },
  uploadFileName: {
    color: '#a5b4fc',
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
    textAlign: 'center',
    wordBreak: 'break-all',
  },
  uploadSubtext: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '12px',
    margin: 0,
    textAlign: 'center',
  },
  formatChips: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    padding: '4px 12px',
    background: 'rgba(99,102,241,0.15)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '20px',
    fontSize: '11px',
    color: '#a5b4fc',
    fontWeight: '500',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  textarea: {
    width: '100%',
    minHeight: '180px',
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    lineHeight: '1.6',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  btnSummary: {
    flex: 1,
    minWidth: '140px',
    padding: '13px 20px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnQuiz: {
    flex: 1,
    minWidth: '140px',
    padding: '13px 20px',
    background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  charCount: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: '12px',
    textAlign: 'right',
    margin: '0',
  },
  summarySection: {},
  summaryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px',
    padding: '6px 12px',
    cursor: 'pointer',
  },
  summaryCard: {
    background: 'rgba(99,102,241,0.05)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '14px',
    padding: '24px',
  },
  summaryText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '14px',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
  },
  emptyIcon: { fontSize: '48px', opacity: 0.3 },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: '13px',
    margin: '0 0 16px',
    textAlign: 'center',
  },
  quizSection: {},
  quizProgress: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  quizProgressText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
    textAlign: 'right',
  },
  progressBar: {
    height: '3px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
    borderRadius: '2px',
    transition: 'width 0.3s',
  },
  questionCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '16px',
  },
  questionHeader: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'flex-start',
  },
  questionNum: {
    background: 'rgba(99,102,241,0.2)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '12px',
    color: '#a5b4fc',
    fontWeight: '600',
    flexShrink: 0,
    marginTop: '2px',
  },
  questionText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '15px',
    margin: 0,
    lineHeight: '1.5',
    fontWeight: '500',
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  optionSelected: {
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.4)',
  },
  optionLetter: {
    width: '26px',
    height: '26px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    flexShrink: 0,
  },
  optionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
  },
  submitQuizBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  scoreScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '16px',
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'conic-gradient(#6366f1 0deg, rgba(255,255,255,0.05) 0deg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid rgba(99,102,241,0.4)',
    boxShadow: '0 0 40px rgba(99,102,241,0.2)',
  },
  scoreNumber: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#a5b4fc',
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    marginTop: '2px',
  },
  scoreTitle: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
    textAlign: 'center',
  },
  scoreSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
    margin: 0,
    textAlign: 'center',
  },
  reviewSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  reviewCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid',
    borderRadius: '10px',
    padding: '12px 16px',
  },
  reviewHeader: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  reviewQ: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  correctAns: {
    color: '#4ade80',
    fontSize: '12px',
    margin: '6px 0 0 22px',
  },
  retryBtn: {
    padding: '12px 32px',
    background: 'rgba(99,102,241,0.15)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '10px',
    color: '#a5b4fc',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
};