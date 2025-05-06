from http.server import BaseHTTPRequestHandler
from textblob import TextBlob
import json

def analyze_text(text):
    """Analyze sentiment of text using TextBlob"""
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    label = "POSITIVE" if polarity >= 0 else "NEGATIVE"
    
    return {
        'label': label,
        'score': abs(polarity),
        'raw_polarity': polarity
    }

def handler(event, context):
    """Lambda-style handler for Vercel serverless function"""
    try:
        # Parse body
        body = json.loads(event['body'])
        text = body.get('text', '')
        
        if not text:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No text provided'}),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        
        # Analyze text
        result = analyze_text(text)
        
        # Return success response
        return {
            'statusCode': 200,
            'body': json.dumps(result),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    
    except Exception as e:
        # Return error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
