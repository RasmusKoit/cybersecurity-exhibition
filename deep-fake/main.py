
import json
from flask import Flask, render_template, request, jsonify, render_template_string


app = Flask(__name__)

def make_app():
    app = Flask(__name__)

    @app.route('/')
    def index():
      print(render_template_string('./card.html'))
      return render_template('./index.html')

    @app.route('/api/image', methods = ['POST'])
    def frequencyCracker():
      request.accept_mimetypes['application/json']
      cipher_text = request.get_json()['cipher_text']
      try:
        result = 'uks kaks kolm'
        return jsonify(result)
      except:
        return json.dumps({ 'message': 'Something went wrong in the server' }), 500

    return app

if __name__ == '__main__':
  app = make_app()
  app.run(port=8080)