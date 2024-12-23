import { Button, Skeleton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import VimeoCustomPlayer from '../../../components/VimeoCustomPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, getSingleCourse } from '../../../redux/actions/coursesAction';
import { filePath } from '../../../configs/axios.configs';
import { warningMessage } from '../../../services/helpers';

const CourseDetailsPage = () => {
    const md = useMediaQuery('(max-width: 767px)');
    const { step, id } = useParams()
    const navigate = useNavigate();
    const [isVideoPlay, setIsVIdeoPlay] = useState(false);
    const { coursesList, courseDetail, courseDetailLoading, coursesListLoading } = useSelector((state) => state?.course);
    const dispatch = useDispatch()
    const [currentStep, setCurrentStep] = useState(0);
    const [currentCourse, setCurrentCourse] = useState(0);

    const handleGetCourse = async () => {
        try {

            if (coursesList.length == 0) {
                let resp = await dispatch(getCourses(step));
                if (resp.success) {
                    if (resp.data.length == 0) {
                        navigate('/dashboard/courses');
                        warningMessage('course not found')
                    }
                }
            }
            let currentIndex = coursesList.findIndex((item) => item._id == id);
            setCurrentCourse(currentIndex)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        let stepNumber = step.replace('step', '');
        setCurrentStep(parseInt(stepNumber))
        dispatch(getSingleCourse(id));
        handleGetCourse()
    }, [id])

    const handleStep = async (action = 'next') => {
        try {

            let currentIndex = coursesList.findIndex((item) => item._id == id);
            if (action == 'next') {
                let NextCourse = coursesList[currentIndex + 1];
                if (NextCourse) {
                    setIsVIdeoPlay(false)
                    navigate(`/dashboard/courses/${step}/${NextCourse._id}`)
                } else {
                    let resp = await dispatch(getCourses(`step${currentStep + 1}`));
                    if (resp.success) {
                        if (resp.data.length == 0) {
                            warningMessage(`Courses not found in etape ${currentStep + 1}`)
                        } else {
                            setIsVIdeoPlay(false)
                            navigate(`/dashboard/courses/step${currentStep + 1}/${resp.data[0]._id}`)
                        }
                    }
                }
            } else if (action == 'prev') {
                let PrevCourse = coursesList[currentIndex - 1];
                if (PrevCourse) {
                    setIsVIdeoPlay(false)
                    navigate(`/dashboard/courses/${step}/${PrevCourse._id}`)
                } else {

                    let resp = await dispatch(getCourses(`step${currentStep - 1}`));
                    if (resp.success) {
                        if (resp.data.length == 0) {
                            warningMessage(`Courses not found in etape ${currentStep - 1}`)
                        } else {
                            setIsVIdeoPlay(false)
                            navigate(`/dashboard/courses/step${currentStep - 1}/${resp.data[resp.data.length - 1]._id}`)
                        }
                    }
                }
            }

        } catch (error) {
            console.log('error ', error)
        }
    }
    return (
        <div className='p-6 h-full flex flex-col'>
            {courseDetailLoading ? (
                <div className='flex gap-1 md:justify-between md:flex-nowrap flex-wrap'>
                    <Skeleton h={40} className='w-full md:w-7/12' radius={'xl'} />
                    <div className='flex gap-2  w-full md:w-5/12'  >
                        <Skeleton h={40} radius={'xl'} />
                        <Skeleton h={40} radius={'xl'} />
                    </div>
                </div>
            ) : (
                <div className='flex gap-1 md:justify-between md:flex-nowrap flex-wrap'>
                    <h4 className='text-[#38b6ff] flex-1 font-bold text-sm sm:text-base md:text-xl'>{courseDetail?.title} </h4>
                    <div className='flex gap-2 md:w-fit w-full md:justify-start justify-end'>
                        <Button disabled={currentStep == 1 && currentCourse == 0 ? true : false} loading={courseDetailLoading} onClick={() => handleStep('prev')} variant='filled' radius={'xl'} size={md ? 'xs' : 'md'} color={'#ff6c3d'}>
                            Revenir
                        </Button>
                        <Button loading={courseDetailLoading} onClick={() => handleStep('next')} radius={'xl'} size={md ? 'xs' : 'md'} color={'#38b6ff'}>
                            Cours suivant
                        </Button>
                    </div>
                </div>
            )
            }
            {courseDetailLoading ? (
                <Skeleton h={40} mt={'md'} />
            ) : (
                <p className='text-fontColor text-base mt-3 font-normal  w-full'>
                    {courseDetail?.description}
                </p>
            )
            }
            <div className='flex-1 flex justify-center items-center'>
                <div className='w-[90%]   mx-auto flex flex-col justify-center items-center mt-4 gap-2'>
                    <div className='w-full h-full aspect-video relative min-h-[200px] max-h-[65vh]'>
                        {courseDetailLoading ? (<Skeleton className='h-full w-full' h={'100%'} />) :
                            isVideoPlay ? (
                                <VimeoCustomPlayer url={courseDetail?.video} />
                            ) : (
                                <>
                                    <img src={filePath + courseDetail?.thumbnail} className='!h-full aspect-video object-cover !w-full' />
                                    <Button
                                        onClick={() => { courseDetail?.video ? setIsVIdeoPlay(true) : navigate('/dashboard/plans/buy-plan') }}
                                        color={'#38b6ff'}
                                        className="max-w-16 !size-5 !text-[8px] md:!size-10 !p-0 md:!text-xl !absolute !left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%] z-[1]"
                                        radius={'xl'}
                                    >
                                        <FaPlay />
                                    </Button>
                                </>

                            )}
                    </div>
                </div>

            </div>
        </div >
    )
}

export default CourseDetailsPage