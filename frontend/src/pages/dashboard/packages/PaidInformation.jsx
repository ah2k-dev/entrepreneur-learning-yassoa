import { Button, Grid, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import coursesImage from '/public/courses/course-poster.webp';
import { FaPlay } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gatSubscriptionPage, updateSubscriptionPage } from '../../../redux/actions/authActions';
import VimeoCustomPlayer from '../../../components/VimeoCustomPlayer';
const PaidInformation = () => {
    const md = useMediaQuery('(max-width: 767px)');
    const [title, setTitle] = useState(' Andy, Rejoins la communauté et accède à plus de 1000 Podcasts et étude de cas')
    const [subTitle, setSubTitle] = useState('En business, c’est mieux d’être accompagné que d’être seul !')
    const [videoUrl, setVideoUrl] = useState('https://vimeo.com/178894608')
    const navigate = useNavigate();
    const { user, SUBS_PAGE_DETAILS, SUBS_PAGE_DETAILS_LOADING } = useSelector((state) => state?.auth)
    const [isVideoPlay, setIsVIdeoPlay] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = () => {
        try {
            dispatch(updateSubscriptionPage({ title: title, subtitle: subTitle, video: videoUrl }))
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetSubs = async () => {
        try {
            let resp = await dispatch(gatSubscriptionPage());
            if (resp.success) {
                setTitle(resp?.data?.title)
                setSubTitle(resp?.data?.subtitle)
                setVideoUrl(resp?.data?.video)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        handleGetSubs()
    }, [])

    return (
        <div className=' p-6 h-full flex flex-col relative '>
            {user.role == 'admin' ? (
                <>
                    <TextInput
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextInput
                        label="Sub title"
                        mt={'sm'}
                        value={subTitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                    />

                    <button disabled={SUBS_PAGE_DETAILS_LOADING} onClick={() => handleSubmit()} className='absolute px-4 top-2 right-2 rounded-md py-1 z-[2] bg-[#38b6ff] hover:bg-[#3099d6] text-white' >
                        {SUBS_PAGE_DETAILS_LOADING ? "Updating" : "Update"}
                    </button>
                </>
            ) : (
                <>
                    <h3 className='text-fontColor md:text-xl lg:text-2xl font-bold  w-full'>
                        {title}
                    </h3>
                    <p className='text-fontColor text-base mt-3 font-normal w-full'>
                        {subTitle}
                    </p>
                </>
            )}
            <div className='flex-1 flex justify-center items-center'>
                <div className='max-w-[500px] w-[90%] mx-auto flex flex-col justify-center items-center mt-4 gap-2 pb-3'>
                    {user.role == 'admin' && (
                        <TextInput
                            label="Video Url"
                            className='w-full'
                            mt={'sm'}
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    )}
                    <div className='w-full h-full aspect-video relative '>
                        {!isVideoPlay ? (
                            <VimeoCustomPlayer url={videoUrl} />
                        ) : (
                            <>
                                <img src={coursesImage} className='!h-full aspect-video object-cover !w-full' />
                                <Button
                                    onClick={() => { setIsVIdeoPlay(true) }}
                                    color={'#38b6ff'}
                                    className="max-w-16 !size-5 !text-[8px] md:!size-10 !p-0 md:!text-xl !absolute !left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%] z-[1]"
                                    radius={'xl'}
                                >
                                    <FaPlay />
                                </Button>
                            </>

                        )}
                    </div>

                    <Button onClick={() => navigate('/dashboard/plans/list')} variant='filled' className='w-fit pb-3' color={'#ff6d3f'}>
                        Rejoindre la communauté
                    </Button>
                </div>

            </div>
        </div >
    )
}



export default PaidInformation