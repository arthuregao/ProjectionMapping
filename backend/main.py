import os
import json
from datetime import datetime

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import requests

BASE_SESSION_STRUCTURE = {
    'audio': [],
    'avatars': {},
    'images': [],
    'text': []
}


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

    with open('session/session.json', 'w') as session_json:
        json.dump(BASE_SESSION_STRUCTURE, session_json)


def create_directory_structure(base_path='session'):
    print("i am running")
    if not os.path.exists(base_path):
        os.makedirs(base_path, exist_ok=True)

    directories = ['audio', 'avatars', 'images']
    for directory in directories:
        path = os.path.join(base_path, directory)
        if not os.path.exists(path):
            os.makedirs(path, exist_ok=True)

    # with open('session/session.json', 'w') as session_json:
    #     json.dump(BASE_SESSION_STRUCTURE, session_json)


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

with app.app_context():
    create_directory_structure()


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

                avatar_name = f'avatar-{time_string}.glb'

                # You might want to save the file or process it as needed
                with open(f'session/avatars/{avatar_name}', 'wb') as f:
                    f.write(response.content)

                with open('session/session.json', 'r') as session_json:
                    current_session = json.load(session_json)

                current_session['avatars'][avatar_name] = {
                    'audio': None
                }

                with open('session/session.json', 'w') as session_json:
                    json.dump(current_session, session_json)

                return jsonify({"message": "File downloaded successfully"}), 200
            else:
                return jsonify({"message": "Failed to fetch file"}), 400
        else:
            return jsonify({"message": "No URL provided"}), 400
    return jsonify({"message": "Invalid request"}), 400


@app.route('/upload-image', methods=['POST'])
@cross_origin()
def upload_image_assets():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        now = datetime.now()
        time_string = now.strftime('%y%m%d-%H-%M-%S')
        image_name = f'image-{time_string}-{filename}'
        file_path = os.path.join('session/images', image_name)
        file.save(file_path)

        try:
            with open('session/session.json', 'r+') as session_json:
                current_session = json.load(session_json)
                current_session['images'].append(image_name)
                session_json.seek(0)
                json.dump(current_session, session_json)
                session_json.truncate()
        except Exception as e:
            return jsonify({"message": "Failed to update session file", "error": str(e)}), 500

        return jsonify({"message": "File uploaded and session updated successfully"}), 200
    return jsonify({"message": "Invalid file or request"}), 400


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif', 'webp'}


@app.route('/images/<filename>')
@cross_origin()
def uploaded_file(filename):
    return send_from_directory('session/images', filename)


@app.route('/get-session', methods=['GET'])
@cross_origin()
def get_session_asset_names():
    try:
        # Open the session.json file in read mode
        with open('session/session.json', 'r') as file:
            data = json.load(file)
            # Return the JSON data
            return jsonify(data)
    except FileNotFoundError:
        # Return an error message if the file is not found
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        # Return a generic error message for any other exceptions
        return jsonify({"error": "An error occurred", "message": str(e)}), 500


@app.route('/attach-audio', methods=['POST'])
def attach_audio():
    # TODO implement
    pass


if __name__ == '__main__':
    app.run(debug=True)
