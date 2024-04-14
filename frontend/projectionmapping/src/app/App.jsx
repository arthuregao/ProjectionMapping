"use client";

import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import { useState, useEffect } from "react";

const config = {
  clearCache: true,
  bodyType: "fullbody",
  quickStart: false,
  language: "en",
};

const style = { width: "100%", height: "100vh", border: "none", margin: 0 };

function App() {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    console.log(avatarUrl);
  }, [avatarUrl]);

  const handleOnUserSet = (event) => {
    console.log(`User ID is: ${event.data.id}`);
  };

  const handleOnAvatarExported = (event) => {
    console.log(
      `Avatar URL is: ${event.data.url}?morphTargets=Oculus%20Visemes`
    );
    setAvatarUrl(`${event.data.url}?morphTargets=Oculus%20Visemes`);
  };

  const handleUserAuthorized = (event) => {
    console.log(`User is:`, event.data);
  };

  const handleAssetUnlocked = (event) => {
    console.log(`Asset unlocked is: ${event.data.assetId}`);
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <AvatarCreator
        subdomain="diorama-projection-mapping"
        config={config}
        style={style}
        onAvatarExported={handleOnAvatarExported}
        onUserAuthorized={handleUserAuthorized}
        onAssetUnlock={handleAssetUnlocked}
        onUserSet={handleOnUserSet}
      />
    </div>
  );
}

export default App;
