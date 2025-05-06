from flask import Flask, render_template, request, jsonify
from textblob import TextBlob
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        # Using TextBlob for sentiment analysis
        analysis = TextBlob(text)
        
        # Convert polarity to a label (-1 to 1 scale, where negative is negative sentiment)
        # Polarity closer to 1 means more positive, closer to -1 means more negative
        polarity = analysis.sentiment.polarity
        label = "POSITIVE" if polarity >= 0 else "NEGATIVE"
        
        return jsonify({
            'label': label,
            'score': abs(polarity),  # Use absolute value so the score is always positive
            'raw_polarity': polarity  # Include raw polarity for more advanced UI features
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)