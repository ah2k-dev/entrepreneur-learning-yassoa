import { Button, Flex, Grid, PasswordInput, Radio, Select, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { City, Country } from 'country-state-city'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { UpdatePassword, UpdateProfile } from '../../../redux/actions/authActions'
import SettingMenu from '../../../components/SettingMenu'
import { uploadFileInChunks } from '../../../services/helpers/uploader'
import { filePath } from '../../../configs/axios.configs'

const ProfileSetting = () => {
    const { user, updateProfileLoading } = useSelector((state) => state?.auth);
    const [cities, setCities] = useState([]);
    const dispatch = useDispatch();
    const [passwordLoading, setPasswordLoading] = useState(false)
    let initialVal = {
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        zip: user.zip || '',
        city: user.city || '',
        country: user.country || '',
        email: user.email || '',
        profileImage: user.profileImage || '',
        haveBusiness: user.haveBusiness || false
    }
    const form = useForm({
        initialValues: initialVal,
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
            address: (value) => {
                if (value.length == 0) {
                    return "Address is required!";
                }
                return null;
            },


        }
    })

    useEffect(() => {

        let city = [...new Set(City.getCitiesOfCountry(form.values.country).map((item) => item.name))];
        setCities(city)
    }, [form.values.country]);

    const HandleUpdateProfile = async (value) => {
        try {

            let resp = await dispatch(UpdateProfile(value));
        } catch (error) {

        }
    }

    useEffect(() => {
        form.setValues({
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            zip: user.zip || '',
            city: user.city || '',
            country: user.country || '',
            email: user.email || '',
            profileImage: user.profileImage || '',
            haveBusiness: user?.haveBusiness || false
        })
    }, [user])

    const passwordForm = useForm({
        initialValues: {
            password: '',
        },
        validate: {
            password: (value) => {
                if (value.length < 8) {
                    return "Password must be at least 8 characters";
                }
                return null;
            },

        }
    })
    const HandleUpdatePassword = async (values) => {
        try {
            setPasswordLoading(true)
            let resp = await dispatch(UpdatePassword({ currentPassword: values.password, newPassword: values.password }));
            setPasswordLoading(false)
        } catch (error) {
            setPasswordLoading(false)
        }
    }
    return (
        <div className='p-3 md:p-6 w-full'>
            <div className='flex justify-between items-center flex-wrap'>
                <h2 className='text-fontColor text-2xl w-fit font-bold'>
                    Réglages
                </h2>
            </div>
            <div className='w-full overflow-hidden h-full  mt-2'>
                <SettingMenu path={'profile'} />

                <Grid
                    component={'form'}
                    onSubmit={form.onSubmit((values) =>
                        HandleUpdateProfile(values)
                    )}
                    autocomplete="off"
                    className='w-full !mx-0 mt-5'
                    justify="space-between" >

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            placeholder='Nom'
                            {...form.getInputProps("name")}
                        />

                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            placeholder='Téléphone'
                            {...form.getInputProps("phone")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            placeholder='Adresse'
                            {...form.getInputProps("address")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            placeholder='Zip Code'
                            {...form.getInputProps("zip")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                            searchable
                            clearable
                            placeholder='Pays'
                            data={Country.getAllCountries().map((item) => ({ value: item.isoCode, label: item.name }))}
                            {...form.getInputProps("country")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                            searchable
                            clearable
                            placeholder='Ville'
                            data={cities}
                            {...form.getInputProps("city")}
                        />

                    </Grid.Col>
                    {user.role == 'user' && (
                        <Grid.Col span={{ base: 12, md: 6 }}>
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
                                    checked={form.values.haveBusiness}
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
                                    checked={!form.values.haveBusiness}
                                    onChange={() => form.setValues({ haveBusiness: false })}
                                />
                            </div>
                        </Grid.Col>
                    )}
                    <Grid.Col span={{ base: 12 }} mt={'md'}>
                        <Flex className="w-full justify-end">
                            <Button loading={updateProfileLoading} type='submit' className='!px-8' variant='filled' color={'#38b6ff'}>
                                Enregistrer
                            </Button>
                        </Flex>
                    </Grid.Col>
                </Grid>

                <Grid component={'form'} onSubmit={passwordForm.onSubmit((values) => HandleUpdatePassword(values))} autocomplete="off" className='w-full !mx-0 mt-5' justify="space-between" >
                    <Grid.Col span={{ base: 12, md: 6 }} mt={'md'}>
                        <TextInput
                            placeholder='Email'
                            {...form.getInputProps("email")}
                            classNames={{ input: '!bg-[#E5E4E4]' }}
                            readOnly
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }} mt={'md'}>
                        <PasswordInput
                            placeholder='Password'
                            classNames={{ input: '!bg-[#E5E4E4]' }}
                            {...passwordForm.getInputProps('password')}
                        />
                        <Flex justify='end'>
                            <p
                                className="!underline !text-xs  text-fontColor cursor-pointer "
                                onClick={() => { passwordForm.setValues({ password: generateRandomPassword(10) }) }}>
                                Generate Random!

                            </p>
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }} mt={'md'}>
                        <Flex className="w-full justify-end">
                            <Button loading={passwordLoading} type='submit' className='!px-8' variant='filled' color={'#FF6C3D'}>
                                Mettre à jour
                            </Button>
                        </Flex>
                    </Grid.Col>
                </Grid>

            </div>
        </div>
    )
}

function generateRandomPassword(length = 12) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:',.<>?";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
}
export default ProfileSetting