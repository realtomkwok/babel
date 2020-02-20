from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

# import apps
from apps.translate_stt import translate_speech_to_text


APP = Flask(
    __name__,
    static_folder='../frontend/build/',
    template_folder='../frontend/build'
)
CORS(APP)

@APP.route('/')
def index():
    return render_template('index.html')

@APP.route('/translate', methods=['POST', 'GET'])
def translate():
    data = request.get_json()
    fromLanguage = data['fromLanguage']
    toLanguage = data['toLanguage']
    print('{},{}'.format(fromLanguage, toLanguage))
    retrievedResults = translate_speech_to_text(fromLanguage, toLanguage)
    return jsonify(retrievedResults)

if __name__ == '__main__':
    APP.run(
        debug=True,
    )