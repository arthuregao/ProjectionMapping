import os
import json
import shutil
import subprocess
import platform

import requests
from datetime import datetime
from pydub import AudioSegment

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

BASE_SESSION_STRUCTURE = {
    'audio': [],
    'avatars': {},
    'images': [],
    'text': []
}


def convert_to_ogg(audio_path):
    # Assuming audio_path is the path to the input audio file
    original_audio = AudioSegment.from_file(audio_path)
    ogg_path = audio_path.rsplit('.', 1)[0] + '.ogg'
    original_audio.export(ogg_path, format='ogg')
    return ogg_path


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


def create_directory_structure(base_path='session'):
    print("i am running")
    if not os.path.exists(base_path):
        os.makedirs(base_path, exist_ok=True)

    directories = ['audio', 'avatars', 'images']
    for directory in directories:
        path = os.path.join(base_path, directory)
        if not os.path.exists(path):
            os.makedirs(path, exist_ok=True)

    if not os.path.exists('session/session.json'):
        with open('session/session.json', 'w') as session_json:
            json.dump(BASE_SESSION_STRUCTURE, session_json)


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

    with open('session/session.json', 'w') as session_json:
        json.dump(BASE_SESSION_STRUCTURE, session_json)

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
                # Extract the ID from the file URL
                start_index = len("https://models.readyplayer.me/")
                end_index = file_url.index(".glb")
                avatar_id = file_url[start_index:end_index]

                # Get current time
                now = datetime.now()
                time_string = now.strftime('%y%m%d-%H-%M-%S')

                # avatar_name = f'avatar-{time_string}.glb'
                avatar_name = f'{avatar_id}.glb'

                image_name = generate_avatar_thumbnail(avatar_id)

                # You might want to save the file or process it as needed
                with open(f'session/avatars/{avatar_name}', 'wb') as f:
                    f.write(response.content)

                with open('session/session.json', 'r') as session_json:
                    current_session = json.load(session_json)

                current_session['avatars'][avatar_name] = {
                    'audio': None,
                    'thumbnail': image_name
                }

                with open('session/session.json', 'w') as session_json:
                    json.dump(current_session, session_json)

                return jsonify({"message": "File downloaded successfully"}), 200
            else:
                return jsonify({"message": "Failed to fetch file"}), 400
        else:
            return jsonify({"message": "No URL provided"}), 400
    return jsonify({"message": "Invalid request"}), 400


def generate_avatar_thumbnail(avatarID):

    base_url = "https://models.readyplayer.me/"

    endpoint = ".png?camera=portrait"

    # Make a GET request to the API
    response = requests.get(base_url + avatarID + endpoint)

    # Check if the request was successful
    if response.status_code == 200:
        # The API responded with a 2D render of the avatar
        avatar_image_data = response.content

        avatar_name = f'{avatarID}.png'

        with open(f'session/avatars/{avatar_name}', "wb") as file:
            file.write(avatar_image_data)

        return avatar_name
    else:
        # The request was not successful, handle the error
        print("Failed to get avatar 2D render. Status code:", response.status_code)


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
        filename.rsplit('.', 1)[1].lower() in {
            'png', 'jpg', 'jpeg', 'gif', 'webp'}


@app.route('/images/<filename>')
@cross_origin()
def uploaded_file(filename):
    return send_from_directory('session/images', filename)


@app.route('/avatars/<filename>')
@cross_origin()
def send_uploaded_glb(filename):
    return send_from_directory('session/avatars', filename)


@app.route('/audio/<filename>')
@cross_origin()
def send_uploaded_audio(filename):
    return send_from_directory('session/audio', filename)


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
@cross_origin()
def attach_audio():
    avatar_name = request.form.get('avatar_name')
    audio_file = request.files.get('audio_file')

    if avatar_name is None or audio_file is None:
        return jsonify({"message": "Missing avatar name or audio file"}), 400

    avatar_path = f'session/avatars/{avatar_name}'
    if not os.path.exists(avatar_path):
        return jsonify({"error": "Avatar not found"}), 404

    if audio_file and allowed_audio_file(audio_file.filename):
        audio_filename = secure_filename(audio_file.filename)
        now = datetime.now()
        time_string = now.strftime('%y%m%d-%H-%M-%S')
        audio_name = f'audio-{time_string}-{audio_filename}'
        audio_path = os.path.join('session/audio', audio_name)
        audio_file.save(audio_path)

        # Check if conversion is needed
        if not audio_filename.endswith('.ogg'):
            audio_path = convert_to_ogg(audio_path)

        # Running the rhubarb script
        try:
            script_path = os.path.abspath('../../Rhubarb-Lip-Sync-1.13.0-macOS/') \
                if platform.system().lower() == 'darwin' \
                else os.path.abspath('../../Rhubarb-Lip-Sync-1.13.0-Linux/')
            audio_absolute_path = os.path.abspath(audio_path)

            output_file_path = f"{audio_name.rsplit('.', 1)[0]}.json"
            command = [
                script_path + '/rhubarb',
                audio_absolute_path,
                '-f', 'json',
                '--machineReadable',
                '-o', f'session/audio/{output_file_path}'
            ]
            result = subprocess.run(command, capture_output=True, text=True)
            print(result)
            if result.returncode != 0:
                return jsonify({"message": "Failed to run rhubarb script", "error": result.stderr}), 500

            with open('session/session.json', 'r+') as session_json:
                current_session = json.load(session_json)

                if avatar_name in current_session['avatars']:
                    current_session['avatars'][avatar_name]['audio'] = audio_name
                    current_session['avatars'][avatar_name]['audio_json'] = output_file_path
                    current_session['audio'].append(audio_name)
                else:
                    return jsonify({"error": "Avatar does not have a record in the session"}), 404

                session_json.seek(0)
                json.dump(current_session, session_json)
                session_json.truncate()

            return jsonify({"message": "Audio attached and processed successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Failed to update session file", "error": str(e)}), 500
    else:
        return jsonify({"message": "Invalid audio file"}), 400


def allowed_audio_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in {'mp3', 'wav', 'ogg'}


# Function to sanitize the input text
def sanitize_text(text):
    # Replace with your desired sanitization logic. A simple example:
    import html
    return html.escape(text)


@app.route('/upload-text', methods=['POST'])
@cross_origin()
def upload_text():
    if 'text' not in request.form:
        return jsonify({'error': 'No text data provided'}), 400

    text = request.form['text']
    sanitized_text = sanitize_text(text)

    # Load session data (create file if it doesn't exist)
    session_file = 'session/session.json'
    try:
        with open(session_file, 'r') as f:
            session_data = json.load(f)
    except FileNotFoundError:
        session_data = {'text': []}  # Initialize

    # Update session data
    session_data['text'].append(sanitized_text)

    # Save updated session data
    with open(session_file, 'w') as f:
        json.dump(session_data, f)

    return jsonify({'message': 'Text uploaded and stored successfully'}), 200





if __name__ == '__main__':
    app.run(debug=True)
