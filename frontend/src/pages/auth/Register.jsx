import { Box, Button, Flex, Grid, Image, PasswordInput, Radio, Select, TextInput } from '@mantine/core'
import React, { useState } from 'react'
import LoginImage from '/public/auth/register.webp'
import LogoImg from '/public/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { checkUser, requestEmailVerification, signup } from '../../redux/actions/authActions'
import { isEmail, useForm } from '@mantine/form'
import { useDispatch } from 'react-redux'
import { businessType, employeeRanges, podcastNiche, podcastType, registerReference } from '../../data/data'
const RegisterPage = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [tab, setTabs] = useState('userInfo')
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
            haveBusiness: '',
            businessType: '',
            type: '',
            employees: '',
            reference: '',

        },
        validate: {
            email: isEmail("Invalid email"),
            password: (value) => {
                if (value.length < 8) {
                    return "Password must be at least 8 characters";
                }
                return null;
            },
            phone: (value) => {
                if (value.length == 0) {
                    return "Phone is required!";
                }
            },
            name: (value) => {
                if (value.length == 0) {
                    return "Name is required!";
                }
            },
            businessType: (value) => {
                if (value.length == 0 && tab == 'businessInfo') {
                    return "This field Type is required!";
                }
            },
            type: (value) => {
                if (value.length == 0 && tab == 'businessInfo') {
                    return "This field is required!";
                }
            },
            employees: (value) => {
                if (value.length == 0 && tab == 'businessInfo') {
                    return "This field is required!";
                }
            },
            reference: (value) => {
                if (value.length == 0 && tab == 'businessInfo') {
                    return "This field is required!";
                }
            },
        }
    })
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            if (tab == 'userInfo') {
                let resp = await dispatch(checkUser({ phone: values.phone, email: values.email }));
                if (resp.success) {
                    setTabs('businessInfo');
                    setLoading(false)
                    return;
                } else {
                    let setErr = {};
                    if (resp.message?.errorKey?.includes('email')) {
                        setErr.email = 'Email already exist!'
                    }
                    if (resp.message?.errorKey?.includes('phone')) {
                        setErr.phone = 'Téléphone already exist!'
                    }
                    form.setErrors(setErr)
                    setLoading(false)
                    return;
                }
            }

            let resp = await dispatch(signup(values))
            if (resp == 'success') {

                let encodeEmail = window.btoa(values.email);
                navigate(`/account-verification/${encodeEmail}`);
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)

        }
    }
    return (
        <Box className="w-screen h-screen relative overflow-hidden bg-[#f8f8f8]">
            <Flex className='!m-0 !p-0 h-full w-full'>
                <div className='relative overflow-hidden h-full w-full md:w-[50%] p-0 max-w-screen max-h-screen'>

                    <div className='w-full left-5 top-5 absolute md:left-10 md:top-10'>
                        <img
                            src={LogoImg}
                            alt='Entrepreneur anonyme logo'
                            className='size-12 md:size-16'
                        />
                    </div>
                    <div className='flex flex-col justify-center h-full w-full  relative overflow-auto'>

                        <div className='flex w-full justify-center flex-col items-center text-[#535353] '>

                            <form onSubmit={form.onSubmit((values) =>
                                handleSubmit(values)
                            )} className='w-full max-w-[500px] flex justify-center flex-col items-center gap-5 '>
                                {tab == 'userInfo' ? (
                                    <div className='w-full flex justify-center flex-col items-center gap-5 mb-6'>
                                        <div className='flex w-full justify-center flex-col items-center '>
                                            <h2 className='text-xl md:text-3xl font-bold mt-1 text-fontColor poppins-bold'>
                                                Je crée un compte
                                            </h2>
                                        </div>
                                        <TextInput
                                            variant="filled"
                                            radius="md"
                                            placeholder="Prénom"
                                            className='w-[90%]'
                                            size='md'
                                            {...form.getInputProps("name")}
                                        />
                                        <TextInput
                                            variant="filled"
                                            radius="md"
                                            placeholder="Email"
                                            className='w-[90%]'
                                            size='md'
                                            type='email'
                                            autoComplete="off"
                                            {...form.getInputProps("email")}
                                        />
                                        <TextInput
                                            variant="filled"
                                            radius="md"
                                            placeholder="Téléphone"
                                            className='w-[90%]'
                                            size='md'
                                            type='tel'
                                            autoComplete="off"
                                            {...form.getInputProps("phone")}
                                        />

                                        <div className='flex justify-between flex-wrap md:flex-nowrap gap-2 md:gap-0 w-[90%]'>
                                            <Radio
                                                label="J’ai déjà une entreprise"
                                                className='!text-[#9f9e9e] font-poppins font-normal'
                                                name='account_type'
                                                iconColor={'#000000'}
                                                color={'#38b6ff2e'}
                                                value="check"
                                                variant="filled"
                                                size={'md'}
                                                styles={{
                                                    radio: {
                                                        backgroundColor: '#38b6ff2e',
                                                        border: 'none'
                                                    }
                                                }}
                                                onChange={() => form.setValues({ haveBusiness: true })}
                                            />
                                            <Radio
                                                label="Pas encore"
                                                className='!text-[#9f9e9e] font-poppins font-normal'
                                                name='account_type'
                                                iconColor={'#000000'}
                                                color={'#38b6ff2e'}
                                                value="check"
                                                variant="filled"
                                                size='md'
                                                styles={{
                                                    radio: {
                                                        backgroundColor: '#38b6ff2e',
                                                        border: 'none'
                                                    }
                                                }}
                                                onChange={() => form.setValues({ haveBusiness: false })}
                                            />
                                        </div>

                                        <PasswordInput
                                            variant="filled"
                                            radius="md"
                                            placeholder="Mot de passe"
                                            className='w-[90%]'
                                            size='md'
                                            autoComplete="off"
                                            {...form.getInputProps("password")}
                                        />

                                    </div>
                                ) : (
                                    <div className='w-full flex justify-center flex-col items-center gap-5'>
                                        <div className='flex w-full justify-center flex-col items-center '>
                                            <h2 className='text-xl md:text-3xl font-bold mt-1 text-fontColor poppins-bold'>
                                                Quel type d’entrepreneur êtes-vous ?
                                            </h2>
                                        </div>
                                        <Select
                                            variant="filled"
                                            radius="md"
                                            placeholder="Type d’entreprise"
                                            className='w-[90%]'
                                            size='md'
                                            data={businessType}
                                            {...form.getInputProps("businessType")}
                                        />
                                        <Select
                                            variant="filled"
                                            radius="md"
                                            className='w-[90%]'
                                            placeholder='Domaine d’activité'
                                            size='md'
                                            searchable
                                            data={podcastType}
                                            {...form.getInputProps("type")}
                                        />

                                        <Select
                                            variant="filled"
                                            radius="md"
                                            className='w-[90%]'
                                            placeholder='Type d’activité'
                                            size='md'
                                            searchable
                                            data={podcastNiche}
                                            {...form.getInputProps("niche")}
                                        />

                                        <Select
                                            variant="filled"
                                            radius="md"
                                            className='w-[90%]'
                                            size='md'
                                            placeholder='Taille de votre équipe'
                                            searchable
                                            data={employeeRanges}
                                            {...form.getInputProps("employees")}
                                        />
                                        <Select
                                            variant="filled"
                                            radius="md"
                                            className='w-[90%]'
                                            size='md'
                                            placeholder='Comment nous avez-vous connus ?'
                                            searchable
                                            defaultValue={'Bouche à oreille'}
                                            data={registerReference}
                                            {...form.getInputProps("reference")}
                                        />

                                    </div>
                                )}
                                <div className='w-full flex justify-center mt-3 flex-col items-center gap-3'>
                                    <Button loading={loading} type='submit' radius={'0'} variant='filled' color={'#ff6d3f'} fw={'500'} className='!font-medium !px-10'>
                                        Je me lance
                                    </Button>
                                    {tab == 'userInfo' ? (
                                        <Link to='/login' className='text-[#9f9e9e] text-md font-normal my-0'>
                                            Vous avez déjà un compte ?
                                        </Link>

                                    ) : (
                                        <></>

                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className='relative overflow-hidden h-full hidden md:flex md:w-[50%]' >
                    <img
                        className='object-cover object-center p-0 m-0 h-full w-full'
                        src={LoginImage}
                        alt='login image'
                    />
                </div>
            </Flex>
        </Box>
    )
}

export default RegisterPage