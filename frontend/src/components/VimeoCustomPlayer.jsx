import { Loader } from '@mantine/core';
import React from 'react';
import { FaPlay } from 'react-icons/fa6';
import ReactPlayer from 'react-player';

const VimeoCustomPlayer = ({ url }) => {
    return (
        <div className='bg-black  h-full w-full relative'>
            <Loader color="blue" className="absolute top-[50%] left-[50%] z-0 translate-y-[-50%] translate-x-[-50%]" />
            <ReactPlayer
                playIcon={<FaPlay />}
                url={url}
                playing
                controls
                width="100%"
                height="100%"
                className="z-[3] relative "
            />

        </div>
    );
};

export default VimeoCustomPlayer;
