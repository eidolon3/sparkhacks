# main.py (Backend)
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import traceback
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@app.route('/api/analyze-plant', methods=['POST'])
def analyze_plant():
    try:
        print("Received request")
        
        image_data = request.json
        print("Request data:", image_data)
        
        if not image_data or 'image' not in image_data:
            return jsonify({"error": "No image provided"}), 400
            
        image_data = image_data['image']
        print("Image data length:", len(image_data))

        if 'base64,' in image_data:
            image_data = image_data.split('base64,')[1]

        print("Attempting OpenAI request...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """You Are Plant Sentry, and your job is to recieve images of crops and check the health of the plant. You are to Check this plant to see if it has any visual diseases or problems..Look at the general health of the plant. 
                            If it looks sickly, rotten, diseased, etc or if there is anything wrong with it at at all, give a detailed description of the problem and antidotes. 
                            At the very top in headings, you should state the type of crop/plant, Disease Diagnosis (if you determine the plant has a diseaase, if not then state that you think its not diseased, if you think it has an unknown disease then state that
                            ) and your confidence level of that disease diagnosis in %. 
                            NEVER SAY YOU DO NOT KNOW THE PLANT, make your best guess. 
                            If the image is not of a plant, let the user know that the image does not include a plant, describe what you see on the screen, and to please sent a plant"

This is how your answer should be formatted. Each should be a heading.

PLANT_GUESS

DIAGNOSIS: CONFIDENCE LEVEL

WHAT THE DISEASE IS 

DESCRIPTION OF THE PROBLEM

ANTIDOTES AND SOLUTIONS

PREVENTIVE MEASURES FOR THE FUTURE

(don't copy the heading names verbatim and with capital letters)"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_data}"
                            }
                        }
                    ]
                }
            ]
        )
        
        return jsonify({"analysis": response.choices[0].message.content})

    except Exception as e:
        print("Error occurred:")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)