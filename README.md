# ProjectionMapping

## Getting Started

#### Step 1: Clone a copy of the project to your machine

Prerequisite: git

On the project's GitHub page, hit the "Code" button and copy the HTTPS link. Open a directory on your computer with the terminal and enter:

```
git clone https://github.com/Affixrevy/ProjectionMapping.git
```

Alternatively, you can install Github Desktop and clone the project via it's prompts.

#### Step 2: Add Rhubarb Lipsync

Rhubarb Lipsync is a code package that animates the mouths of avatars to match their speech from audio files. Download the .zip file [here](https://github.com/DanielSWolf/rhubarb-lip-sync/releases).

On the rightbar, find the compatible release to your machine and download it.

Unzip, and place the folder at the same level as the root of the ProjectionMapping git directory as shown below.
```
ParentFolder
↪ ProjectionMapping (git root directory)
↪ Rhubarb-Lip-Sync-1.13.0-macOS (unzipped download, in this case for mac)
```

#### Step 3: Start the backend

Prerequisites: python3.12, pip

Navigate to the backend directory from the root of the git directory:

```
cd backend/
```

Install requirements with:

```
pip install -r requirements.txt
```

Run the backend with:

```
python3 main.py
```

#### Step 4: Start the frontend

Prerequisites: npm, node

Navigate back to the root of the git directory. From the backend folder, enter:

```
cd ..
```

Navigate to the frontend of the project:

```
cd frontend/projectionmapping/
```

Install, build, and run the frontend:

```
npm install
npm run build
npm run dev
```

Enter ```http://localhost:3000/``` in the browser of your choice.

#### Step 5: Add assets

In the browser, you can create an avatar, upload images, add text, and attach audio. 

Avatar creation is done using ReadyPlayerMe. It can be used in our project without having to log in or create an account. 

Once all assets have been added, hit "Animate"!

### Step 6: Edit the scene

Camera movements: Left Mouse Button to rotate the camera, Right Mouse Button to move the camera's position, scroll wheel to zoom in and out.

Each avatar and image can be selected from the theatre tree on the top left to be edited in the panel on the top right. It can be scaled, moved, and rotated in the scene.


