import React, { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { Button, Popover, Slider } from '@mantine/core';
import { FaPause, FaPlay, FaVolumeDown, FaVolumeUp } from 'react-icons/fa';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';

const VimeoAudioPlayer = ({ src }) => {
    const playerRef = useRef(null);
    const vimeoPlayerRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [status, setStatus] = useState('paused');
    const [videoId, setVideoId] = useState(null);
    const [isBuffering, setIsBuffering] = useState(false); // Track buffering state

    // Update videoId when URL changes
    useEffect(() => {
        setIsBuffering(true)
        setVideoId(getVimeoId(src));
    }, [src]);

    // Initialize or update the Vimeo player
    useEffect(() => {
        if (!videoId) return;
        if (playerRef.current) {
            playerRef.current.innerHTML = '';
        }

        let iframeContent = document.getElementById('iframeContent');
        if (iframeContent) {
            iframeContent.innerHTML = ''
        }
        // Destroy the previous player instance if it exists
        if (vimeoPlayerRef.current) {
            vimeoPlayerRef.current.destroy();
        }

        // Create a new player instance
        vimeoPlayerRef.current = new Player(playerRef.current, {
            id: videoId,
            width: 640,
        });

        // Fetch total video duration
        vimeoPlayerRef.current.getDuration().then((duration) => {
            setDuration(duration); // Set duration in state
            setIsBuffering(false)
        });

        // Listen to time updates
        vimeoPlayerRef.current.on('timeupdate', (event) => {
            setCurrentTime(event.seconds); // Update current time
        });

        // Get initial volume
        vimeoPlayerRef.current.getVolume().then((initialVolume) => {
            setVolume(initialVolume); // Set the current volume in state
        });

        // Listen for play and pause events
        vimeoPlayerRef.current.on('play', () => {
            setStatus('playing');
        });

        vimeoPlayerRef.current.on('pause', () => {
            setStatus('paused');
        });

        vimeoPlayerRef.current.on('bufferstart', () => {
            setIsBuffering(true); // Set buffering state to true
        });

        vimeoPlayerRef.current.on('bufferend', () => {
            setIsBuffering(false); // Set buffering state to false
        });
        return () => {
            vimeoPlayerRef.current?.destroy();
            vimeoPlayerRef.current = null;
        };
    }, [videoId]);


    const handlePlay = () => {
        if (status === 'paused') {
            vimeoPlayerRef.current?.play();
        } else {
            vimeoPlayerRef.current?.pause();
        }
    };

    const handleSliderChange = (value) => {
        const newTime = parseFloat(value);
        vimeoPlayerRef.current.setCurrentTime(newTime); // Seek video to new time
        setCurrentTime(newTime); // Update state
    };

    const handleVolumeChange = (value) => {
        const newVolume = parseFloat(value) / 100;
        vimeoPlayerRef.current.setVolume(newVolume); // Set video volume
        setVolume(newVolume); // Update state
    };

    return (
        <div className='w-full'>

            <div className="hidden" id="iframeContent" ref={playerRef}></div>


            <div className="w-full flex items-center gap-3 md:gap-6">
                <Button
                    loading={isBuffering}
                    onClick={handlePlay}
                    color={'#38b6ff'}
                    className="max-w-16 !size-5 !text-[8px] md:!size-10 !p-0 md:!text-xl"
                    radius={'xl'}
                >
                    {status === 'playing' ? <FaPause /> : <FaPlay />}

                </Button>

                <div className="font-semibold text-fontColor text-[8px] md:text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <Slider
                    label={null}
                    color="#ff6d3f"
                    size="sm"
                    min="0"
                    step="0.1"
                    disabled={isBuffering}
                    showLabelOnHover={false}
                    max={duration}
                    value={currentTime || 0}
                    onChange={handleSliderChange}
                    className="w-full flex-1"
                />

                <Popover position="bottom" withArrow shadow="md">
                    <Popover.Target>
                        <div className="cursor-pointer text-[#737373] text-lg md:text-3xl">
                            {volume === 0 ? <HiSpeakerXMark /> : <HiSpeakerWave />}
                        </div>
                    </Popover.Target>
                    <Popover.Dropdown className='!bg-[#ffffff46] backdrop-blur-sm !p-1'>
                        <div className="flex items-center gap-2">
                            {/* <Button
                                variant="subtle"
                                className="!p-0 min-w-0 !size-8 text-3xl"
                                radius="xl"
                            >
                                <FaVolumeDown />
                            </Button> */}
                            <Slider
                                label={null}
                                color="#000"
                                size="sm"
                                showLabelOnHover={false}
                                value={volume * 100}
                                onChange={handleVolumeChange}
                                className="w-24"
                            />
                            {/* <Button
                                variant="subtle"
                                className="!p-0 min-w-0 !size-8 text-3xl text-black"
                                radius="xl"
                            >
                                <FaVolumeUp />
                            </Button> */}
                        </div>
                    </Popover.Dropdown>
                </Popover>
            </div>
        </div>
    );
};

export default VimeoAudioPlayer;

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

function getVimeoId(url = null) {
    if (url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:[^\d]*\/)*(\d+)/;
        const match = url.match(regex);
        return match ? match[1] : null; // Return the ID or null if not found
    } else {
        return null;
    }
}
