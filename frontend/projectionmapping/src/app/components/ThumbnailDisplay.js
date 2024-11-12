import React, { useState, useEffect } from 'react';

function AvatarGallery(props) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        async function fetchImages() {
            setLoading(true);
            setError(null);
            const fetchUrl = `http://localhost:5050/avatars/${props.name}`;
            try {
                const response = await fetch(fetchUrl, { signal: abortController.signal });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Create a blob URL
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setImages(prevImages => [...prevImages, { url, id: prevImages.length }]);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Failed to fetch images', error);
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchImages().then(r => {});

        return () => {
            abortController.abort();
            // Clean up the created blob URLs
            images.forEach(image => URL.revokeObjectURL(image.url));
        };
    }, [props.name]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading images: {error}</p>;

    return (
        <div className="avatar-con">
            {images.map((image, index) => (
                <img key={index} src={image.url} alt={`Loaded image ${index}`} />
            ))}
        </div>
    );
}

export default AvatarGallery;
