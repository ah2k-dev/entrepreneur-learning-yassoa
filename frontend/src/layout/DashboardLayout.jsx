import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import LogoImg from '/public/logo.png'
import BellIcon from '/public/icons/bell-icon.png'
import ProfileImage from '/public/profiles/profile.jpg'
import { Avatar, Box, Button, Flex, Modal, Text, Title } from '@mantine/core'
import { asideNavigation } from '../data/data'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { logout, UpdateProfile } from '../redux/actions/authActions'
import { MdModeEdit } from 'react-icons/md'
import { FaEdit, FaUserEdit } from 'react-icons/fa'
import { uploadFileInChunks } from '../services/helpers/uploader'
import { filePath } from '../configs/axios.configs'
const DashboardLayout = () => {
    const md = useMediaQuery('(max-width: 767px)');
    const [asideOpen, setAsideOpen] = useState(true)
    useEffect(() => {
        const mainDashboardLayout = document.getElementById("main-dashboard-layout");
        const dashboardHeader = document.getElementById("dashboard-header");
        const dashboardLayoutContent = document.getElementById("dashboard-layout-content");
        dashboardLayoutContent.style.height = (mainDashboardLayout.clientHeight - dashboardHeader.clientHeight) + 'px'
        if (md) {
            setAsideOpen(false)
        } else {
            setAsideOpen(true)
        }
    }, [md])

    return (
        <div className='bg-[#f6fbff] h-screen' id='main-dashboard-layout'>
            {asideOpen && md && (
                <div onClick={() => setAsideOpen(false)} className='absolute w-full h-full inset-0 bg-[#0000006e] z-40'></div>
            )}
            <Header setAsideOpen={setAsideOpen} />
            <div id='dashboard-layout-content' className='flex flex-nowrap relative overflow-hidden' >

                <Aside asideOpen={asideOpen} setAsideOpen={setAsideOpen} />
                <div className='bg-white w-full relative overflow-x-hidden overflow-y-auto rounded-md' style={{ width: md ? '100%' : 'calc(100% - 250px)' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

const Aside = ({ asideOpen, setAsideOpen }) => {
    const md = useMediaQuery('(max-width: 767px)');
    const [locationEndPoint, setLocationEndPoint] = useState('');
    const { user, loading, updateProfileLoading } = useSelector((state) => state?.auth);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [profileImage, setProfileImage] = useState(null);
    useEffect(() => {
        let path = location.pathname;
        let pathArr = path.split('/');
        if (pathArr.length > 0) {
            setLocationEndPoint(pathArr[pathArr.length - 1]);
        }
    }, [location.pathname])
    const [opened, { open, close }] = useDisclosure(false);

    const handleLogout = async () => {
        try {
            let resp = await dispatch(logout());
            if (resp) {
                navigate('/login')
            }
        } catch (error) {

        }
    };


    const HandleUpdateProfile = async (value) => {
        try {
            let profileImageLink = null
            if (profileImage) {
                let ImageResp = await uploadFileInChunks(profileImage);
                if (ImageResp?.data?.success) {
                    profileImageLink = filePath + ImageResp?.data?.data?.link
                    console.log(' success ', profileImageLink)
                    let formData = {
                        name: user?.name || '',
                        phone: user?.phone || '',
                        address: user?.address || '',
                        zip: user?.zip || '',
                        city: user?.city || '',
                        country: user?.country || '',
                        email: user?.email || '',
                        profileImage: profileImageLink,
                        haveBusiness: user?.haveBusiness || false
                    }
                    let resp = await dispatch(UpdateProfile(formData));
                    if (resp.success) {
                        setProfileImage(null)
                    }

                } else {
                    warningMessage('Failed to upload file');
                    return;
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div
                style={{ width: asideOpen ? '100%' : '0' }}
                className='overflow-x-hidden transition-all duration-200 shadow-2xl md:shadow-none max-w-[250px] w-0 md:w-full flex flex-col justify-between items-center fixed md:relative top-0 left-0 bg-[#f6fbff] z-50 h-full pt-3 md:pt-0'>
                <button onClick={() => setAsideOpen(false)} className='md:hidden absolute top-3 right-3 size-9 border-none outline-none bg-gray-200 flex justify-center items-center rounded-md'>
                    <IoChevronBackOutline />
                </button>

                <div className='flex justify-center items-center flex-col'>
                    <div className='relative rounded-full w-full flex flex-col justify-center items-center  h-fit  '>
                        <Avatar color="orange" size={'90px'} src={profileImage ? URL.createObjectURL(profileImage) : user?.profileImage} alt='logo' className='size-28' >
                            {user?.name?.split('').length > 0 ? user?.name?.split('')[0] : ''}
                        </Avatar>
                        {locationEndPoint == 'profile' && (
                            <div className='absolute bottom-0 w-full flex justify-end items-center text-fontColor py-2     z-10 h-4'>
                                {!profileImage && (
                                    <label htmlFor='profileImage'>
                                        <FaEdit className='cursor-pointer ' />
                                        <input type='file' className='hidden' onChange={(e) => setProfileImage(e.target.files[0])} id='profileImage' />
                                    </label>
                                )}
                            </div>
                        )}

                    </div>
                    {locationEndPoint == 'profile' && profileImage && (
                        <div className=' w-full flex gap-2 justify-end items-center text-fontColor py-2'>
                            <button onClick={() => setProfileImage(null)} className='text-[#ff6d3f] bg-slate-100 text-[10px] py-1 px-1 rounded-md' >
                                Cancel
                            </button>
                            <button disabled={updateProfileLoading} onClick={() => HandleUpdateProfile()} className='bg-[#32A4E6] text-white text-[10px] py-1 px-1 rounded-md' >
                                {updateProfileLoading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    )}
                    <h2 className='font-poppins font-normal text-lg mt-3 text-fontColor'>
                        {user.name}
                    </h2>
                </div>
                <div className='px-4 flex flex-col gap-1 mt-4 flex-1  w-full'>
                    {asideNavigation.map((item, index) =>
                        item.allow.includes(user.role) &&
                        (
                            <Link onClick={() => (md && setAsideOpen(false))} className={`p-2 text-md hover:bg-gray-200 transition-all duration-300 rounded-md ${locationEndPoint == item.endpoint ? 'text-[#38b6ff] font-bold' : 'text-[#535353]'}`} key={index} to={item.path}>
                                {item.label}
                            </Link>
                        ))}

                </div>
                <div className='px-4 flex flex-col gap-1 pb-5 w-full'>
                    <Link onClick={() => (md && setAsideOpen(false))} to={'/dashboard/settings/profile'} className={`  text-md ${locationEndPoint == 'profile' || locationEndPoint == 'clients' || locationEndPoint == 'editor' ? 'text-[#38b6ff] font-bold' : 'text-[#535353] font-normal'} hover:text-[#3d93c5]`}>
                        Réglages
                    </Link>
                    <Link to={'#'} onClick={open} className=' text-md text-[#ff6d3f] hover:text-[#db6440]'>
                        Se déconnecter
                    </Link>
                </div>
                <Modal centered opened={opened} onClose={close} >
                    <Flex justify={"center"} className="w-full pb-10 px-5" direction={"column"}>
                        <Box>
                            <Title
                                fw={"500"}
                                ta={"center"}
                                order={2}
                                className="text-bold"
                                c={"#2E3459"}
                            >
                                Tu pars ?

                            </Title>
                            <Text ta={"center"} size="sm" c={"#606060"}>
                                Revenez nous voir vite, de nouveaux Podcasts sont publiés tous les jours !
                            </Text>
                        </Box>

                        <Flex
                            className="justify-end gap-5 mt-6 left-0 relative"
                        >

                            <Button
                                w={"100%"}
                                onClick={() => handleLogout()}
                                className="!drop-shadow-2xl"
                                color={"#ff6d3f"}
                                loading={loading}
                            >
                                OK
                            </Button>
                            <Button
                                w={"100%"}
                                variant="light"
                                className="!underline"
                                fw={"300"}
                                color={"#323232"}
                                onClick={() => close()}
                            >
                                Annuler
                            </Button>
                        </Flex>
                    </Flex>
                </Modal>

            </div>
        </>
    )
}

const Header = ({ setAsideOpen }) => {
    const { user } = useSelector((state) => state?.auth);
    const navigate = useNavigate();
    const md = useMediaQuery("(max-width: 767px)");
    return (
        <div className='h-20 flex w-full justify-between items-center px-4' id='dashboard-header'>
            <div className='flex items-center gap-4'>
                <img src={LogoImg} alt='logo' className='size-12' />
                <button onClick={() => setAsideOpen(true)} className='md:hidden size-9 border-none outline-none bg-gray-200 flex justify-center items-center rounded-md z-10'>
                    <IoChevronForwardOutline />
                </button>
            </div>
            <div className='flex justify-between gap-4 items-center'>
                <Button size={md ? 'compact-xs' : 'compact-md'}
                    onClick={() => navigate('/dashboard/plans/list')}
                    variant="light" color="orange" radius="xl"
                >
                    Upgrade
                </Button>
                <p className='md:text-base text-sm'>
                    FR
                </p>
                <div className='flex justify-between  items-center gap-4'>
                    <img src={BellIcon} className='size-5 md:size-7' />
                    <Avatar
                        size={md ? 'sm' : 'md'}
                        onClick={() => navigate('/dashboard/settings/profile')} color="orange" className='cursor-pointer' src={user?.profileImage} alt='logo' radius="xl" >
                        {user?.name?.split('').length > 0 ? user?.name?.split('')[0] : ''}
                    </Avatar>
                </div>
            </div>
        </div>
    )
}
export default DashboardLayout