from http.server import BaseHTTPRequestHandler
from textblob import TextBlob
import json

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Get the size of data
        content_length = int(self.headers['Content-Length'])
        
        # Get the data
        post_data = self.rfile.read(content_length)
        
        # Parse JSON data
        data = json.loads(post_data.decode('utf-8'))
        text = data.get('text', '')
        
        # Set response headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        if not text:
            error_response = json.dumps({'error': 'No text provided'})
            self.wfile.write(error_response.encode('utf-8'))
            return
        
        try:
            # Using TextBlob for sentiment analysis
            analysis = TextBlob(text)
            
            # Convert polarity to a label (-1 to 1 scale)
            polarity = analysis.sentiment.polarity
            label = "POSITIVE" if polarity >= 0 else "NEGATIVE"
            
            # Create response
            response = {
                'label': label,
                'score': abs(polarity),
                'raw_polarity': polarity
            }
            
            # Send response
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            error_response = json.dumps({'error': str(e)})
            self.wfile.write(error_response.encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()