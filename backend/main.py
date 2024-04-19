import os
import shutil

from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests

app = Flask(__name__)


def clear_folder_contents(folder_path):
    # Loop over each item in the directory
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            # Check if the item is a file or a symbolic link and delete it
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            # If the item is a directory, clear its contents by recursively calling the function
            elif os.path.isdir(file_path):
                clear_folder_contents(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')


@app.route('/reset')
def reset_app():
    print('Resetting app...')
    # Clear only the contents of subfolders and any files directly under './session'
    for item in os.listdir('./session'):
        path = os.path.join('./session', item)
        if os.path.isfile(path) or os.path.islink(path):
            try:
                os.unlink(path)
            except Exception as e:
                print(f'Failed to delete {path}. Reason: {e}')
        elif os.path.isdir(path):
            clear_folder_contents(path)
    return "<H1>Content Cleared. Session Reset</H1>"
    # return jsonify({"message": "Content Cleared"}), 400


@app.route('/upload', methods=['POST'])
@cross_origin()
def upload():
    print("There was a file")
    if request.is_json:
        data = request.get_json()
        file_url = data.get('file_url')
        if file_url:
            # Fetch the .glb file from the URL
            response = requests.get(file_url)
            if response.status_code == 200:
                # Get current time
                now = datetime.now()
                time_string = now.strftime('%y%m%d-%H-%M-%S')

                # You might want to save the file or process it as needed
                with open(f'session/avatars/avatar-{time_string}.glb', 'wb') as f:
                    f.write(response.content)
                return jsonify({"message": "File downloaded successfully"}), 200
            else:
                return jsonify({"message": "Failed to fetch file"}), 400
        else:
            return jsonify({"message": "No URL provided"}), 400
    return jsonify({"message": "Invalid request"}), 400


@app.route('/attach-audio', methods=['POST'])
def attach_audio():
    # TODO implement
    pass


if __name__ == '__main__':
    app.run(debug=True)
