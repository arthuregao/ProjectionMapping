"use client"

import React, { useState, useEffect } from "react";
import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import { useRouter } from 'next/navigation'


const config = {
  clearCache: true,
  bodyType: "fullbody",
  quickStart: false,
  language: "en",
};

const style = { width: "100%", height: "100vh", border: "none", margi: 0 };

function AvatarCreatorComponent() {
  const router = useRouter();

  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    console.log(avatarUrl);
  }, [avatarUrl]);

  const handleOnUserSet = (event) => {
    console.log(`User ID is: ${event.data.id}`);
  };

  const handleOnAvatarExported = (event) => {
    const avatarUrlWithParams = `${event.data.url}?morphTargets=Oculus%20Visemes`;
    console.log(`Avatar URL is: ${avatarUrlWithParams}`);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file_url: avatarUrlWithParams })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Server response:', data);
      router.push('/')
    })
    .catch(error => {
      console.error('Error sending URL to the server:', error);
    });

    setAvatarUrl(avatarUrlWithParams);

  };

  const handleUserAuthorized = (event) => {
    console.log(`User is:`, event.data);
  };

  const handleAssetUnlocked = (event) => {
    console.log(`Asset unlocked is: ${event.data.assetId}`);
  };

  return (
      <AvatarCreator style={{width: "100%", height: "100vh", border: "none", margi: 0}}
        subdomain="diorama-projection-mapping"
        config={config}
        onAvatarExported={handleOnAvatarExported}
        onUserAuthorized={handleUserAuthorized}
        onAssetUnlock={handleAssetUnlocked}
        onUserSet={handleOnUserSet}
      />
  );
}

export default AvatarCreatorComponent;
