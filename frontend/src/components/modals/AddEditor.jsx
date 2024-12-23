import { Button, Image, Modal, Select, TextInput, SimpleGrid, Text, Flex, Textarea, PasswordInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6';
import { isEmail, useForm } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import { successMessage } from '../../services/helpers';
import { AddEditor, GetEditor, UpdateEditor } from '../../redux/actions/authActions';
const AddEditorModal = ({ data = null, openModal, setOpenModal, setEditData }) => {
    const { addEditorLoading } = useSelector((state) => state?.auth);
    const dispatch = useDispatch();

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
        },
        validate: {
            name: (value) => {
                if (value.length == 0) {
                    return "Name is required!";
                }
                return null;
            },
            phone: (value) => {
                if (value.length == 0) {
                    return "Phone is required!";
                }
                return null;
            },
            email: isEmail("Invalid email"),
            password: (value) => {
                if (value.length < 8 && data == null) {
                    return "Password must be at least 8 characters";
                }
                return null;
            },

        }
    })

    const handleSubmit = async (values) => {
        try {
            let resp = null;
            if (data) {
                resp = await dispatch(UpdateEditor({ name: form.values.name, phone: form.values.phone, email: form.values.email }, form.values?._id))

            } else {
                resp = await dispatch(AddEditor(values))
            }
            if (resp.success && !form.values?._id) {
                setOpenModal(false)
                form.reset();
                setEditData(null)
            } else if (resp.success) {
                successMessage('Editor successfully updated')
                dispatch(GetEditor())
            }

        } catch (err) {
            console.log(ErrorEvent)
        }
    }
    useEffect(() => {
        if (data?._id) {
            form.setValues(data)
        }
    }, [data])

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
                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 mt-4 md:mt-4 md:gap-4 w-full'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Name
                            </label>
                            <TextInput
                                variant="filled"
                                className='w-full md:w-9/12 !rounded-full'
                                radius="xl"
                                placeholder=""
                                {...form.getInputProps("name")}
                            />
                        </div>
                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 mt-4 md:mt-4 md:gap-4 w-full'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Email
                            </label>
                            <TextInput
                                variant="filled"
                                className='w-full md:w-9/12 !rounded-full'
                                radius="xl"
                                type='email'
                                placeholder=""
                                {...form.getInputProps("email")}
                            />
                        </div>
                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 mt-4 md:mt-4 md:gap-4 w-full'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                Phone
                            </label>
                            <TextInput
                                variant="filled"
                                className='w-full md:w-9/12 !rounded-full'
                                radius="xl"
                                placeholder=""
                                {...form.getInputProps("phone")}
                            />
                        </div>
                        {data == null && (
                            <div className='flex flex-wrap md:flex-nowrap items-center gap-2 mt-4 md:mt-4 md:gap-4 w-full'>
                                <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>
                                    Password
                                </label>
                                <PasswordInput
                                    variant="filled"
                                    className='w-full md:w-9/12 !rounded-full'
                                    radius="xl"
                                    placeholder=""
                                    {...form.getInputProps("password")}
                                />
                            </div>
                        )}

                        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full mt-4'>
                            <label className='w-full md:w-3/12 font-normal text-lg text-fontColor'>

                            </label>
                            <div className='w-full md:w-9/12 flex gap-5 justify-center '>
                                <Button loading={addEditorLoading} variant='filled' type='submit' color={'#38b6ff'}>
                                    Ajouter un éditeur
                                </Button>
                            </div>
                        </div>
                    </div>

                </form>
            </div >
        </Modal >

    )
}


export default AddEditorModal