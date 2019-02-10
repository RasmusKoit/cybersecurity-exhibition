
import json
from flask import Flask, render_template, request, jsonify, render_template_string
from utils import face_swap2
from PIL import Image
import dlib
import cv2
import os
from io import BytesIO
import base64
import numpy

model = './shape_predictor_68_face_landmarks.dat'
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(model)

def stringToImage(base64_string):
    imgdata = base64.b64decode(base64_string)
    return Image.open(BytesIO(imgdata))

app = Flask(__name__)

def make_app():
    app = Flask(__name__)

    @app.route('/')
    def index():
      print(render_template_string('./card.html'))
      return render_template('./index.html')

    @app.route('/api/image', methods = ['POST'])
    def imageUploader():
      request.accept_mimetypes['text/plain']
      try:
        npimg = numpy.fromstring(base64.b64decode(request.data.split(',')[1]), dtype=numpy.uint8)
        img2 = cv2.imdecode(npimg, 1)

        directory = './images/'
        images = []
        for filename in os.listdir(directory):
          img1 = cv2.imread(os.path.join(directory, filename))
          output1, output2 = face_swap2(img2,img1, detector, predictor)
          img = Image.fromarray(cv2.cvtColor(output1, cv2.COLOR_BGR2RGB), mode='RGB')

          buffer = BytesIO()
          img.save(buffer,format="JPEG")
          myimage = buffer.getvalue()

          result = 'data:image/jpg;base64,' + base64.b64encode(myimage)
          images.append(result)

        return jsonify(images)
      except:
        return json.dumps({ 'message': 'Something went wrong in the server' }), 422

    @app.route('/api/image')
    def getImage():
      f = open('./temp/hello.jpg', 'r')

      return f.read()

    return app


if __name__ == '__main__':
  app = make_app()
  app.run(port=8080)