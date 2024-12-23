import { Button, Image, Modal, Select, TextInput, SimpleGrid, Text, Flex, Textarea } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import { AddEditBusiness, getBusiness } from '../../redux/actions/businessActions';
import { successMessage } from '../../services/helpers';
import { IoIosLink } from 'react-icons/io';
import { Country } from 'country-state-city';
import { podcastNiche, podcastType } from '../../data/data';
import { uploadFileInChunks } from '../../services/helpers/uploader';

const AddBusinessIdeas = ({ data = null, openModal, setOpenModal }) => {

    const { businessList, businessAddLoading } = useSelector((state) => state?.business);
    const dispatch = useDispatch();

    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            tarif: 'Free',
            pays: '',
            type: '',
            niche: '',
            imageName: '',
            image: '',
            binaryPicture: null,
            document: '',
            idIdea: '',
        },
        validate: {
            title: (value) => {
                if (value.length == 0) {
                    return "Titre is required!";
                }
                return null;
            },

            description: (value) => {
                if (value.length == 0) {
                    return "Description is required!";
                }
                if (value.length > 300) {
                    return "Description max. 300 caractères autorisés!";
                }
                return null;
            },
            document: (value) => {
                if (value.length == 0) {
                    return "document is required!";
                }
                return null;
            },

        }
    })

    const handleSubmit = async (values) => {
        try {
            let imageLink = form.values.image;
            if (!form.values?._id && !form.values.binaryPicture) {
                form.setErrors({ imageLink: 'Image is required!' });
                return;
            }
            if (form.values.binaryPicture) {
                let ImageResp = await uploadFileInChunks(form.values.binaryPicture);
                if (ImageResp?.data?.success) {
                    form.setValues({ image: ImageResp?.data?.data?.link })
                    imageLink = ImageResp?.data?.data?.link
                } else {
                    warningMessage('Failed to upload file');
                    return;
                }
            }
            let resp = await dispatch(AddEditBusiness({ ...values, image: imageLink }))
            if (resp.success && !form.values?._id) {
                setOpenModal(false)
                form.reset()
                dispatch(getBusiness());
            } else if (resp.success) {
                successMessage('Business Idea successfully updated')
                dispatch(getBusiness());
            }

        } catch (err) {

        }
    }
    useEffect(() => {
        if (data?._id) {
            let imageArr = data.image.split('/');
            form.setValues({ ...data, imageName: imageArr[imageArr.length - 1] })
        } else {
            form.setValues({ idIdea: `Idee${businessList.length + 1}` })
        }
    }, [data, businessList])

    return (
        <Modal centered size={'lg'} classNames={{ body: '!pt-0' }} opened={openModal} onClose={() => setOpenModal(false)} withCloseButton={false}>
            <div className='relative'>
                <div className='flex justify-center items-center py-4 w-full sticky top-0 bg-white z-[2]'>
                    <h4 className='text-center text-[#38b6ff] font-semibold text-2xl'>
                        Ajouter une Idée
                    </h4>
                    <Button variant='subtle' className='!absolute !right-0 !top-3 z-10' onClick={() => setOpenModal(false)}>
                        <FaXmark />
                    </Button>
                </div>
                <form onSubmit={form.onSubmit((values) =>
                    handleSubmit(values)
                )}>

                    <div className='py-3'>
                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Titre
                            </label>
                            <TextInput
                                variant="filled"
                                className='w-full md:w-9/12 !rounded-full'
                                radius="xl"
                                placeholder="Title of the idea (100 Cara)"
                                {...form.getInputProps("title")}
                            />
                        </div>

                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Description courte
                            </label>
                            <Textarea
                                variant="filled"
                                className='w-full md:w-9/12 !rounded-full'
                                autosize
                                minRows={6}
                                radius='xl'
                                placeholder="Description of the idea (300 cara max)"
                                {...form.getInputProps("description")}
                            />
                        </div>

                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Tarif
                            </label>
                            <div className='w-full md:w-9/12 flex gap-3'>
                                <Select
                                    data={[{ value: 'Free', label: 'Gratuit' }, { value: 'Paid', label: 'Débloquer' }]}
                                    className='capitalize !rounded-full w-full'
                                    variant="filled"
                                    radius="xl"
                                    {...form.getInputProps("tarif")}
                                />
                            </div>
                        </div>

                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Pays
                            </label>
                            <div className='w-full md:w-9/12 flex gap-3'>
                                <Select
                                    searchable
                                    clearable
                                    data={Country.getAllCountries().map((item) => item.name)}
                                    className='w-full !rounded-full'
                                    variant="filled"
                                    radius="xl"
                                    {...form.getInputProps("pays")}
                                />

                            </div>
                        </div>

                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Type
                            </label>
                            <div className='w-full md:w-9/12 flex gap-3'>
                                <Select
                                    data={podcastType}
                                    className=' !rounded-full'
                                    variant="filled"
                                    radius="xl"
                                    {...form.getInputProps("type")}
                                />

                                <Select
                                    data={podcastNiche}
                                    className=' !rounded-full'
                                    variant="filled"
                                    radius="xl"
                                    {...form.getInputProps("niche")}
                                />
                            </div>
                        </div>


                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Image
                            </label>
                            <div className='w-full md:w-9/12 flex gap-3 flex-col'>
                                {!form.values.imageName ? (
                                    <Dropzone multiple={false} accept={IMAGE_MIME_TYPE} onDrop={(e) => form.setValues({ binaryPicture: e[0], imageName: e[0].name })}>
                                        <Text ta="center">Drop images here</Text>
                                    </Dropzone>
                                ) : (
                                    <Flex className='w-full items-center justify-between bg-[#DDEFF9] p-3 rounded-md'>
                                        <p className='text-sm text-fontColor'>
                                            {form.values.imageName}
                                        </p>
                                        <Button onClick={() => form.setValues({ binaryPicture: null, imageName: '' })} variant='subtle' color='orange' size='xs'>
                                            Change
                                        </Button>
                                    </Flex>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full mt-4 md:mt-2'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Document
                            </label>
                            <div className='w-full md:w-9/12 flex gap-3 flex-col'>
                                <TextInput
                                    variant="filled"
                                    className='w-full !rounded-full'
                                    radius="xl"
                                    placeholder="URL of the Document"
                                    {...form.getInputProps("document")}
                                    leftSection={<IoIosLink />}
                                />
                            </div>
                        </div>


                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full mt-4'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                ID-Idee
                            </label>
                            <div className='w-full md:w-9/12 flex gap-3'>
                                <p>{form.values.idIdea}</p>
                            </div>
                        </div>
                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full mt-4'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>

                            </label>
                            <div className='w-full md:w-9/12 flex gap-5 justify-center '>
                                <Button variant='subtle' type='button' color='orange'>
                                    Supprimer
                                </Button>
                                <Button loading={businessAddLoading} variant='filled' type='submit' color={'#38b6ff'}>
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

export default AddBusinessIdeas