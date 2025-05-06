// Main App Component
const App = () => {
    const [text, setText] = React.useState('');
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [error, setError] = React.useState('');
    const [result, setResult] = React.useState(null);
    
    const analyzeSentiment = async () => {
        if (!text.trim()) {
            setError('Please enter some text to analyze');
            return;
        }
        
        setIsAnalyzing(true);
        setError('');
        
        try {
            // Updated API endpoint path for Vercel
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            
            if (!response.ok) {
                throw new Error('Server error');
            }
            
            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze sentiment. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const clearAll = () => {
        setText('');
        setResult(null);
        setError('');
    };
    
    const getEmoji = () => {
        if (!result) return '';
        
        const polarity = result.raw_polarity;
        
        if (polarity > 0.75) return '😃';
        if (polarity > 0.5) return '😊';
        if (polarity > 0.25) return '🙂';
        if (polarity > 0) return '😐';
        if (polarity > -0.25) return '😕';
        if (polarity > -0.5) return '😞';
        if (polarity > -0.75) return '😠';
        return '😡';
    };
    
    const getMeterPosition = () => {
        if (!result) return '50%';
        return `${(result.raw_polarity + 1) * 50}%`;
    };
    
    return (
        <div className="app-container">
            <Header />
            
            <div className="main-card">
                <div className="input-section">
                    <textarea
                        placeholder="Enter text to analyze its sentiment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    
                    <div className="button-group">
                        <button 
                            className="btn btn-primary"
                            onClick={analyzeSentiment}
                            disabled={isAnalyzing}>
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={clearAll}
                            disabled={isAnalyzing}>
                            Clear
                        </button>
                    </div>
                </div>
                
                {isAnalyzing && <LoadingSpinner />}
                
                {error && <div className="error-message">{error}</div>}
                
                {result && !isAnalyzing && (
                    <ResultsSection 
                        result={result} 
                        emoji={getEmoji()} 
                        meterPosition={getMeterPosition()} 
                    />
                )}
            </div>
            
            <InfoCard />
            <Footer />
        </div>
    );
};

// Header Component
const Header = () => {
    return (
        <div className="header">
            <h1>Sentiment Analysis</h1>
            <p>Analyze the emotional tone of your text</p>
        </div>
    );
};

// Loading Spinner Component
const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <div className="loading-text">Analyzing your text...</div>
        </div>
    );
};

// Results Section Component
const ResultsSection = ({ result, emoji, meterPosition }) => {
    // Calculate background color based on sentiment
    const getBgColor = () => {
        const polarity = result.raw_polarity;
        if (polarity > 0.5) return 'rgba(46, 204, 113, 0.1)'; // Strong positive
        if (polarity > 0) return 'rgba(46, 204, 113, 0.05)'; // Mild positive
        if (polarity > -0.5) return 'rgba(231, 76, 60, 0.05)'; // Mild negative
        return 'rgba(231, 76, 60, 0.1)'; // Strong negative
    };

    return (
        <div className="results-section" style={{ background: getBgColor() }}>
            <h2 className="results-title">Analysis Results</h2>
            
            <div className="results-display">
                <div className="emoji">{emoji}</div>
                <div className="sentiment-info">
                    <div className={`sentiment-label sentiment-${result.label.toLowerCase()}`}>
                        {result.label}
                    </div>
                    <div className="sentiment-score">
                        Score: {result.score.toFixed(4)}
                    </div>
                    
                    {/* Show language information if available */}
                    {result.detected_language && (
                        <div className="language-info">
                            Detected language: {result.detected_language}
                            {result.was_translated && " (translated for analysis)"}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="sentiment-meter">
                <div className="meter-container">
                    <div className="meter-fill"></div>
                    <div className="meter-indicator" style={{ left: meterPosition }}></div>
                </div>
                <div className="meter-labels">
                    <span>Very Negative</span>
                    <span>Neutral</span>
                    <span>Very Positive</span>
                </div>
            </div>
        </div>
    );
};

// Info Card Component
const InfoCard = () => {
    return (
        <div className="info-card">
            <h2>About Sentiment Analysis</h2>
            <p>
                Sentiment analysis is natural language processing technique used to determine
                the emotional tone behind a body of text.
            </p>
            <p>
                This tool uses TextBlob to analyze your text and provides:
            </p>
            <ul>
                <li>A sentiment label (POSITIVE or NEGATIVE)</li>
                <li>A sentiment score between -1 (very negative) and 1 (very positive)</li>
                <li>A visual representation of where your text falls on the sentiment spectrum</li>
            </ul>
            <p>
                Try it with product reviews, social media posts, or any text you want to analyze!
            </p>
        </div>
    );
};

// Footer Component
const Footer = () => {
    return (
        <div className="footer">
            <p>Built with React and TextBlob</p>
        </div>
    );
};

// Render the App
ReactDOM.render(<App />, document.getElementById('root'));