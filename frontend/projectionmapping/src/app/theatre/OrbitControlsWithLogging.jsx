import React, { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';

const OrbitControlsWithLogging = () => {
  const controls = useRef();

  useEffect(() => {
    const handleCameraChange = () => {
      console.log('Camera Position:', controls.current.object.position.toArray());
    };

    if (controls.current) {
      controls.current.addEventListener('change', handleCameraChange);
    }

    return () => {
      if (controls.current) {
        controls.current.removeEventListener('change', handleCameraChange);
      }
    };
  }, []);

  return <OrbitControls ref={controls} />;
};

export default OrbitControlsWithLogging;
