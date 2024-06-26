# For prerequisites running the following sample, visit https://help.aliyun.com/document_detail/611472.html

from http import HTTPStatus
import dashscope
from dashscope.audio.asr import Recognition

from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

@app.route('/asr', methods=['POST'])
def asr():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join('./tmp/', filename)
        file.save(filepath)
        print(filepath)
        # 调用asr_service
        transcription = asr_service(filepath)

        # 删除临时文件
        os.remove(filepath)

        return jsonify({"transcription": transcription})

def asr_service(input_file = "test.mp3", format = "MP3", sample_rate = 16000):
    dashscope.api_key = 'sk-7256558bec3147cca459b4280a1978b6'
    recognition = Recognition(model='paraformer-realtime-v1',
                            format=format,
                            sample_rate=sample_rate,
                            callback=None)
    result = recognition.call(input_file)
    result_text = ""
    if result.status_code == HTTPStatus.OK:
        for sentence in result.get_sentence():
            result_text += sentence['text']
        print('Recognition done!')
    else:
        print('Error: ', result.message)

    return result_text

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)