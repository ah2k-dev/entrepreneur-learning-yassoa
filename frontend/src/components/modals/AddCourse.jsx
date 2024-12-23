import { Button, Image, Modal, Select, TextInput, SimpleGrid, Text, Flex, Textarea, NumberInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6';
import { Dropzone, IMAGE_MIME_TYPE, } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import { AddCourse, EditCourse, getCourses } from '../../redux/actions/coursesAction';
import { IoIosLink } from 'react-icons/io';
import { courseSteps } from '../../data/data';
import { successMessage, warningMessage } from '../../services/helpers';
import { uploadFileInChunks } from '../../services/helpers/uploader';
const VIDEO_MIME_TYPE = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mpeg",
    "video/quicktime",
    "video/x-matroska",
    "video/x-ms-wmv",
    "video/x-flv",
];
const AddCourseModal = ({ data = null, openModal, setOpenModal }) => {
    const { coursesList, courseAddLoading } = useSelector((state) => state?.course);
    const dispatch = useDispatch();
    const form = useForm({
        initialValues: {
            _id: null,
            title: '',
            step: 'step1',
            description: '',
            position: '',
            thumbnail: '',
            binaryImage: null,
            thumbnailName: '',
            video: '',
        },
        validate: {
            title: (value) => {
                if (value.length == 0) {
                    return "Titre is required!";
                }
                return null;
            },
            step: (value) => {
                if (value.length == 0) {
                    return "Step is required!";
                }
                return null;
            },
            description: (value) => {
                if (value.length == 0) {
                    return "Description is required!";
                }
                return null;
            },
            video: (value) => {
                if (value.length == 0) {
                    return "Contenu is required!";
                }
                return null;
            },

        }
    })

    const handleSubmit = async (values) => {
        try {
            let resp = null;
            let thumbnail = form.values.thumbnail;
            if (!form.values?._id && !form.values.binaryImage) {
                form.setErrors({ thumbnail: 'Image de présentation is required!' });
                return;
            }
            if (form.values.binaryImage) {
                let ImageResp = await uploadFileInChunks(form.values.binaryImage);
                if (ImageResp?.data?.success) {
                    form.setValues({ thumbnail: ImageResp?.data?.data?.link })
                    thumbnail = ImageResp?.data?.data?.link
                } else {
                    warningMessage('Failed to upload file');
                    return;
                }
            }
       
            if (form.values?._id) {
                resp = await dispatch(EditCourse({ values: { ...form.values, thumbnail: thumbnail }, id: form.values?._id }))
            } else {
                resp = await dispatch(AddCourse({ ...form.values, thumbnail: thumbnail }))
            }
    
            if (resp.success && !form.values?._id) {
                setOpenModal(false)
                form.reset()
                dispatch(getCourses());
            } else if (resp.success) {
                successMessage('Course successfully updated')
                dispatch(getCourses());
            }

        } catch (err) {

        }
    }

    useEffect(() => {
        try {
            if (data?._id) {
                let thumbnailArr = data.thumbnail.split('/');
                form.setValues({ ...data, thumbnailName: thumbnailArr[thumbnailArr.length - 1] })
            }
        } catch (err) {
            console.log(err)
        }
    }, [data, coursesList])

    return (
        <Modal centered size={'lg'} opened={openModal} onClose={() => setOpenModal(false)} withCloseButton={false}>
            <div className='relative'>
                <div className='flex justify-center items-center pb-4 w-full'>
                    <h4 className='text-center text-[#38b6ff] font-semibold text-2xl'>
                        Ajouter un cours
                    </h4>
                    <Button variant='subtle' className='!absolute !right-0 !top-0 z-10' onClick={() => setOpenModal(false)}>
                        <FaXmark />
                    </Button>
                </div>
                <form onSubmit={form.onSubmit((values) =>
                    handleSubmit(values)
                )}>

                    <div className='py-3'>
                        <div className='flex flex-wrap md:flex-nowrap  items-center gap-2 md:gap-4 w-full'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Titre
                            </label>
                            <TextInput
                                variant="filled"
                                className='w-full md:w-9/12 !rounded-full'
                                radius="xl"
                                placeholder="Who do you want to be ?"
                                {...form.getInputProps("title")}
                            />
                        </div>
                        <div className='flex flex-wrap md:flex-nowrap  items-center gap-2 md:gap-4 w-full mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Step
                            </label>
                            <Select
                                data={courseSteps}
                                className='capitalize w-full md:w-9/12  !rounded-full'
                                variant="filled"
                                radius="xl"
                                {...form.getInputProps("step")}
                            />
                        </div>
                        <div className='flex flex-wrap md:flex-nowrap  items-center gap-2 md:gap-4 w-full mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Description courte
                            </label>
                            <Textarea
                                variant="filled"
                                className='w-full md:w-9/12 !rounded-full'
                                autosize
                                minRows={6}
                                radius='xl'
                                placeholder="Je peux t’accompagner pour performer tes ventes"
                                {...form.getInputProps("description")}
                            />
                        </div>



                        <div className='flex flex-wrap md:flex-nowrap  items-center gap-2 md:gap-4 w-full mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Position
                            </label>
                            <div className='w-full md:w-9/12 flex gap-3'>
                                <NumberInput
                                    variant="filled"
                                    className='w-full  !rounded-full'
                                    radius="xl"
                                    placeholder="Position"
                                    {...form.getInputProps("position")}
                                />
                            </div>
                        </div>


                        <div className='flex flex-wrap md:flex-nowrap  items-center gap-2 md:gap-4 w-full mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Image de présentation
                            </label>
                            <div className='w-full md:w-9/12 flex gap-3 flex-col'>
                                {!form?.values?.thumbnailName ? (
                                    <Dropzone multiple={false} accept={IMAGE_MIME_TYPE} onDrop={(e) => form.setValues({ binaryImage: e[0], thumbnailName: e[0].name })}>
                                        <Text ta="center">Drag & Drop the picture of the video</Text>
                                    </Dropzone>
                                ) : (
                                    <Flex className='w-full items-center justify-between bg-[#DDEFF9] p-3 rounded-md'>
                                        <p className='text-sm text-fontColor'>
                                            {form?.values?.thumbnailName}
                                        </p>
                                        <Button onClick={() => form.setValues({ binaryImage: null, thumbnailName: '' })} variant='subtle' color='orange' size='xs'>
                                            Change
                                        </Button>
                                    </Flex>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-wrap md:flex-nowrap  items-center gap-2 md:gap-4 w-full mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Contenu
                            </label>
                            <div className='w-full md:w-9/12 flex gap-3 flex-col'>
                                <TextInput
                                    variant="filled"
                                    className='w-full !rounded-full'
                                    radius="xl"
                                    placeholder="URL of the video"
                                    {...form.getInputProps("video")}
                                    leftSection={<IoIosLink />}
                                />
                            </div>
                        </div>



                        <div className='flex flex-wrap md:flex-nowrap  items-center gap-2 md:gap-4 w-full mt-4'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>

                            </label>
                            <div className='w-full md:w-9/12 flex gap-5 justify-center '>
                                <Button loading={courseAddLoading} variant='filled' type='submit' color={'#38b6ff'}>
                                    Enregistrer
                                </Button>
                            </div>
                        </div>
                    </div>

                </form>
            </div >
        </Modal >

    )
}

export default AddCourseModal