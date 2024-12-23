import React, { useEffect, useRef } from 'react';
// import Player from '@vimeo/player';

const VimeoPlayer = ({ url }) => {
    const playerRef = useRef(null);

    // // Extract video ID from Vimeo URL
    // const getVimeoId = (url) => {
    //     const regex = /vimeo\.com\/(\d+)/;
    //     const match = url.match(regex);
    //     return match ? match[1] : null; // Return the video ID or null if not matched
    // };

    // const videoId = getVimeoId(url);

    // useEffect(() => {
    //     if (videoId) {
    //         const player = new Player(playerRef.current, {
    //             id: videoId,
    //             width: 640,
    //             autoplay: true,
    //         });

    //         // Example: Event listener for playback
    //         player.on('play', () => {
    //             console.log('Video is playing');
    //         });

    //         return () => player.destroy();
    //     } else {
    //         console.error('Invalid Vimeo URL');
    //     }
    // }, [videoId]);

    return <div ref={playerRef}></div>;
};


export default VimeoPlayer;
