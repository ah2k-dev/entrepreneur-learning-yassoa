import { Button, Popover, Slider } from "@mantine/core";
import React, { useRef, useState } from "react";
import { FaPause, FaPlay, FaVolumeUp, FaVolumeDown } from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null); // Reference to the audio element
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1); // Volume state (0 to 1)

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => {
        const time = (e / 100) * duration;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e / 100;
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    const increaseVolume = () => {
        const newVolume = Math.min(volume + 0.1, 1); // Increase volume by 0.1
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    const decreaseVolume = () => {
        const newVolume = Math.max(volume - 0.1, 0); // Decrease volume by 0.1
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    return (
        <div className="w-full flex items-center gap-3 md:gap-6">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            ></audio>

            {/* Play/Pause Button */}
            <Button
                onClick={togglePlay}
                color={'#38b6ff'}
                className="max-w-16 !size-5 !text-[8px] md:!size-10 !p-0 md:!text-xl"
                radius={'xl'}
            >
                {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>

            {/* Time Display */}
            <div className="font-semibold text-fontColor text-[8px] md:text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Seek Bar */}

            <Slider
                label={null}
                color="#ff6d3f"
                size="sm"
                showLabelOnHover={false}
                value={(currentTime / duration) * 100 || 0}
                onChange={handleSeek}
                className="w-full flex-1"
            />

            <Popover position="bottom" withArrow shadow="md">
                <Popover.Target>
                    <div className="cursor-pointer text-[#737373] text-lg md:text-3xl">
                        {(volume * 100) == 0 ? (
                            <HiSpeakerXMark />
                        ) : (
                            <HiSpeakerWave />
                        )}
                    </div>
                </Popover.Target>
                <Popover.Dropdown>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={decreaseVolume}
                            variant="subtle"
                            className="!p-0 min-w-0 !size-8 text-3xl"
                            radius="xl"
                        >
                            <FaVolumeDown />
                        </Button>
                        <Slider
                            label={null}
                            color="#000"
                            size="sm"
                            showLabelOnHover={false}
                            value={volume * 100}
                            onChange={handleVolumeChange}
                            className="w-24"
                        />
                        <Button
                            onClick={increaseVolume}
                            variant="subtle"
                            className="!p-0 min-w-0 !size-8 text-3xl text-black"
                            radius="xl"
                        >
                            <FaVolumeUp />
                        </Button>
                    </div>
                </Popover.Dropdown>
            </Popover>


        </div>
    );
};

// Helper function to format time in MM:SS
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default AudioPlayer;
