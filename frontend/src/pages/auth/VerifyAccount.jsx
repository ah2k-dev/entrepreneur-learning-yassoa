import { Box, Button, Flex, Grid, Image, PasswordInput, PinInput, TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import LoginImage from '/public/auth/login.webp'
import LogoImg from '/public/logo.png'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { isEmail, useForm } from '@mantine/form'
import { successMessage, warningMessage } from '../../services/helpers'
import { useDispatch } from 'react-redux'
import { requestEmailVerification, verifyEmail } from '../../redux/actions/authActions'
const VerifyAccountPage = () => {
    const { email } = useParams()
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [timer, setTimer] = useState(0);

    const form = useForm({
        initialValues: {
            email: '',
            code: '',
        },
        validate: {
            email: isEmail("Invalid email"),
        }
    })

    useEffect(() => {
        const decodedEmail = window.atob(email);
        form.setValues({ email: decodedEmail });
        handleResendCode(decodedEmail);
    }, [email]);

    const handleSubmit = async (values) => {
        try {
            if (!form.isValid()) return;

            setLoading(true);
            let resp = await dispatch(
                verifyEmail({
                    email: values.email,
                    emailVerificationToken: parseInt(values.code),
                })
            );

            if (resp == 'success') {
                navigate("/login");
            }
        } catch (error) {
            console.error("Verification failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async (email) => {
        if (timer > 0) return; // Prevent resending if timer is active

        try {
            // Uncomment the following line when API is ready
            await dispatch(requestEmailVerification({ email: email }));
            successMessage("Verification code resent!");
            setTimer(120); // Start a 2-minute timer
        } catch (error) {
            console.error("Error resending code:", error);
        }
    };

    // Timer countdown logic
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval); // Cleanup interval on unmount
        }
    }, [timer]);

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
                            <h2 className='text-xl md:text-3xl font-bold mt-1 text-fontColor poppins-bold'>
                                Vérifiez votre email
                            </h2>
                            <p className='text-sm md:text-sm mt-1 font-[400] text-fontColor font-poppins'>
                                {form.values.email}
                            </p>
                        </div>
                        <div className='flex w-full justify-center flex-col items-center text-[#535353] mt-8'>
                            <form
                                onSubmit={form.onSubmit((values) =>
                                    handleSubmit(values)
                                )}
                                className='w-full max-w-[500px] flex justify-center flex-col items-center gap-10'>
                                <PinInput
                                    variant='filled'
                                    placeholder=""
                                    length={6}
                                    type="number"
                                    {...form.getInputProps("code")}
                                />

                                <Button
                                    loading={loading} type='submit' variant='filled' color={'#38b6ff'} fw={'500'}
                                >
                                    {loading ? 'Loading...' : "Vérifier l'email"}

                                </Button>

                                <div className='w-full flex justify-between flex-wrap flex-col md:flex-row items-center'>
                                    <button
                                        type='button'
                                        className='text-[#9f9e9e] text-md font-normal w-fit'
                                        onClick={() => handleResendCode(form.values.email)}
                                        disabled={timer > 0}
                                    >
                                        {timer > 0 ? `Renvoyer le code dans ${timer}s` : "Renvoyer le code"}
                                    </button>
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

export default VerifyAccountPage