import wave, sys, struct, json, os

from flask import Flask, request, redirect, url_for
from werkzeug import secure_filename

UPLOAD_FOLDER = '/tmp/'
ALLOWED_EXTENSIONS = set(['wav','wave'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/')
def main_page():
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form action="/upload" method=post enctype=multipart/form-data>
      <p><input type="file" name="spikes_file">
         <input type=submit value=Upload>
    </form>
    '''

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['spikes_file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect(url_for('provide_json_of_wav', filename=filename))
    else:
        return "Invalid file"

@app.route('/json-for/<filename>')
def provide_json_of_wav(filename):
    w = wave.open(os.path.join(app.config['UPLOAD_FOLDER'], filename), 'rb')
    if w:
        pcm_list = []
        for i in range(w.getnframes()):
            frame = w.readframes(1)
            pcm_list.append(struct.unpack("h", frame)[0])
        return json.dumps(pcm_list[40:])
    else:
        return "Oops!, couldn't read" + os.path.join(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.config['DEBUG'] = True
    if app.config['DEBUG']:
        from werkzeug import SharedDataMiddleware
        app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
            '/': os.path.join(os.path.dirname(__file__), '..')
            })
    app.run()
