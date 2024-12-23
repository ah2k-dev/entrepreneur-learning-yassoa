import { Box, Button, Flex, Grid, Image, PasswordInput, TextInput } from '@mantine/core'
import React, { useState } from 'react'
import LoginImage from '/public/auth/login.webp'
import LogoImg from '/public/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { isEmail, useForm } from '@mantine/form'
import { successMessage, warningMessage } from '../../services/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/actions/authActions'
const LoginPage = () => {
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state?.auth)
    const navigate = useNavigate()
    const form = useForm({
        initialValues: {
            email: 'admin@gmail.com',
            password: '12345678',
            rememberPass: 's'
        },
        validate: {
            email: isEmail("Invalid email"),
            password: (value) => {
                if (value.length < 8) {
                    return "Password must be at least 8 characters";
                }
                return null;
            },
        }
    })
    const handleSubmit = async (values) => {
        try {

            let resp = await dispatch(login({ email: values.email, password: values.password }));
            console.log(resp);
            if (resp == "Email not verified") {
                let encodeEmail = window.btoa(values.email);
                navigate(`/account-verification/${encodeEmail}`);
            }
            if (resp?.data?.user) {
                successMessage("Successfully login");
                navigate('/dashboard')
            }

        } catch (error) {

        }
    }
    return (
        <Box className="w-screen h-screen relative overflow-hidden bg-[#F8F8F8]">
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
                        <div className='flex w-full justify-center flex-col items-center '>
                            <h6 className='text-lg md:text-2xl font-medium text-fontColor font-poppins'>
                                Bienvenue à
                            </h6>
                            <h2 className='text-xl md:text-3xl font-bold mt-1 text-fontColor poppins-bold'>
                                Entrepreneur Anonyme
                            </h2>
                            <p className='text-lg md:text-xl mt-7  font-[400] text-fontColor font-poppins'>
                                Veuillez vous identifier
                            </p>
                        </div>
                        <div className='flex w-full justify-center flex-col items-center text-[#535353] mt-6'>
                            <form
                                onSubmit={form.onSubmit((values) =>
                                    handleSubmit(values)
                                )}
                                className='w-full max-w-[500px] flex justify-center flex-col items-center gap-10'>
                                <TextInput
                                    variant="filled"
                                    radius="md"
                                    placeholder="Email"
                                    className='w-[90%]'
                                    size='md'
                                    type='email'
                                    {...form.getInputProps("email")}
                                />
                                <PasswordInput
                                    variant="filled"
                                    radius="md"
                                    placeholder="Mot de passe"
                                    className='w-[90%]'
                                    size='md'
                                    {...form.getInputProps("password")}
                                />

                                <Button
                                    loading={loading} type='submit' variant='filled' color={'#38b6ff'} fw={'500'}
                                >
                                    {loading ? 'Loading...' : "Je me connecte"}

                                </Button>

                                <div className='w-full flex justify-between flex-wrap flex-col md:flex-row items-center'>
                                    <Link to='/forgot-password' className='text-[#c4c1c1] text-md font-normal w-fit'>
                                        Mots de passe oublié ?
                                    </Link>
                                    <Link to='/register' className='text-[#ff5757] text-md font-normal w-fit'>
                                        Je n’ai pas de compte
                                    </Link>
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

export default LoginPage