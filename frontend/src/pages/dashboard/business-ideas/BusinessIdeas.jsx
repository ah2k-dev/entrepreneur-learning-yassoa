import { Badge, Button, Grid, Image, Menu, Pill, Select, Skeleton, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { SlMagnifier } from 'react-icons/sl';
import BusinessImage from '/public/business-ideas/business-image.webp';
import { BsThreeDots } from 'react-icons/bs';
import { LuDownload } from 'react-icons/lu';
import AddBusinessIdeas from '../../../components/modals/AddBusinessIdea';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteBusiness, downloadBusinessDoc, getBusiness } from '../../../redux/actions/businessActions';
import Swal from 'sweetalert2';
import { baseURL, filePath } from '../../../configs/axios.configs';
import { useNavigate } from 'react-router-dom';
import { podcastNiche, podcastType } from '../../../data/data';
import { Country } from 'country-state-city';
const BusinessIdeas = () => {
    const md = useMediaQuery('(max-width: 767px)');
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState({
        pays: null,
        type: null,
        niche: null,
        tarif: null
    });
    const [openModal, setOpenModal] = useState(false);
    const { user } = useSelector((state) => state?.auth)
    const dispatch = useDispatch();
    const { businessList, businessListLoading } = useSelector((state) => state?.business);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const isAlready = tags.find((item) => item == search)
        if (search.trim() && !isAlready && tags.length < 6) {
            setTags([...tags, search.trim()]);
            setSearch('');
        }
    };

    useEffect(() => {
        dispatch(getBusiness());
    }, [dispatch])

    return (
        <div className='pt-0 '>
            <AddBusinessIdeas openModal={openModal} setOpenModal={setOpenModal} />
            <div className='p-5 sticky top-0 bg-white z-10 shadow-sm h-full'>
                <div className='flex justify-between items-center flex-wrap'>
                    <h2 className='text-fontColor text-2xl w-fit font-bold'>
                        Idées de Business
                    </h2>
                    <div className='flex w-fit items-center justify-between md:justify-end gap-3'>

                        <FilterMenu tags={tags} setTags={setTags} />
                        {user.role !== 'user' && (
                            <Button onClick={() => setOpenModal(true)} radius={'0'} className='px-2 md:!px-5 !min-w-[fit-content]' styles={{ label: { fontSize: md ? '10px' : '13px' } }} h={'40px'} variant='filled' color={'#535353'}>
                                Add an Idea
                            </Button>
                        )}
                    </div>
                </div>

                <div className='mt-3 gap-3 flex'>
                    {Object.entries(tags).map(([key, value], index) =>
                        value && (
                            <Pill
                                size="md"
                                key={index}
                                withRemoveButton
                                onRemove={() => {
                                    // Create a copy of the object without the removed key
                                    const newTags = { ...tags };
                                    delete newTags[key];
                                    setTags(newTags); // Update the state
                                }}
                            >
                                {value}
                            </Pill>
                        ))}
                </div>
            </div>

            <Grid >
                {businessListLoading ?
                    (
                        <>
                            <Grid.Col span={{ base: 12, md: 6, xl: 4 }} className='px-4 md:!px-8'>
                                <Skeleton width={180} height={20} mt={6} radius="lg" />
                                <Skeleton height={200} mt={6} radius="sm" />
                                <Skeleton height={40} mt={6} radius="lg" />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6, xl: 4 }} className='px-4 md:!px-8'>
                                <Skeleton width={180} height={20} mt={6} radius="lg" />
                                <Skeleton height={200} mt={6} radius="sm" />
                                <Skeleton height={40} mt={6} radius="lg" />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6, xl: 4 }} className='px-4 md:!px-8'>
                                <Skeleton width={180} height={20} mt={6} radius="lg" />
                                <Skeleton height={200} mt={6} radius="sm" />
                                <Skeleton height={40} mt={6} radius="lg" />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6, xl: 4 }} className='px-4 md:!px-8'>
                                <Skeleton width={180} height={20} mt={6} radius="lg" />
                                <Skeleton height={200} mt={6} radius="sm" />
                                <Skeleton height={40} mt={6} radius="lg" />
                            </Grid.Col>
                        </>
                    )
                    :
                    businessList.length == 0 || businessList == null ?
                        (
                            <p className='text-fontColor text-xl w-full font-medium text-center'>
                                No Business Ideas found
                            </p>
                        )

                        : businessList.map((item, i) => (
                            <Grid.Col key={i} span={{ base: 12, md: 6, xl: 4 }}>
                                <BusinessCard item={item} />
                            </Grid.Col>
                        ))
                }
            </Grid>

        </div>
    )
}

const BusinessCard = ({ item }) => {
    const { user } = useSelector((state) => state?.auth);
    const { downloadDocLoading } = useSelector((state) => state?.business);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleDelete = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let resp = await dispatch(DeleteBusiness(id));
                    if (resp) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Business Ideas has been deleted.",
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // dispatch(getBusiness());
                            }
                        })
                    }

                }
            });

        } catch (error) {
            console.log(error);
        }
    }

    const handleDownloadDocuement = async (item) => {
        try {
            if (item.document) {

                let resp = await dispatch(downloadBusinessDoc(item));
                if (resp.success) {
                    const link = document.createElement('a');
                    link.href = resp?.data?.url;
                    link.target = '_blank'
                    link.click();
                    URL.revokeObjectURL(link.href);
                }
            } else {
                navigate('/dashboard/plans/buy-plan')
            }
        } catch (err) {
            console.log('err ', err)
        }
    }
    return (
        <div className='p-5'>
            <AddBusinessIdeas data={item} openModal={openModal} setOpenModal={setOpenModal} />
            <h4 className='text-[#38b6ff] font-bold text-xl line-clamp-1'> {item.title} </h4>
            <Image className='max-h-[35vh] h-full min-h-[200px] object-cover' src={filePath + item.image} />
            <p className='text-black text-sm mt-2 text-justify line-clamp-3'>
                {item.description}
            </p>
            <div className='flex justify-between items-center mt-3'>

                {user.role !== 'user' ? (
                    <Menu shadow="md" width={200} className='relative'>
                        <Menu.Target>
                            <button className='px-2 py-1 hover:bg-slate-200 text-2xl text-fontColor rounded-md'>
                                <BsThreeDots />
                            </button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                onClick={() => setOpenModal(true)}
                            >
                                Update
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                onClick={() => handleDelete(item?._id)}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                ) : (<b></b>)}

                <div className='flex gap-3'>
                    <Button disabled={downloadDocLoading} variant='transparent' onClick={() => handleDownloadDocuement(item)} className='px-2 py-1 hover:bg-slate-200 !text-xl !text-fontColor rounded-md'>
                        <LuDownload />
                    </Button>
                    {item.tarif == 'Paid' ? (<Badge color="orange" className='!text-sm' size="xl">Débloquer</Badge>) : (<Badge color={"#38b6ff"} className='!text-sm' size="xl">Gratuit</Badge>)}

                </div>
            </div>
        </div>
    )
}


const FilterMenu = ({ tags, setTags }) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState(false);
    const dispatch = useDispatch()

    const handleSearchSubmit = useCallback(() => {

        if (tags?.type || tags?.niche || tags?.pays || tags?.tarif) {
            setActiveFilter(true)
        } else {
            setActiveFilter(false)
        }

        dispatch(
            getBusiness({
                search,
                type: tags?.type || null,
                niche: tags?.niche || null,
                pays: tags?.pays || null,
                tarif: tags?.tarif || null

            })
        );
    }, [tags, search, dispatch]);

    useEffect(() => {
        handleSearchSubmit();
    }, [handleSearchSubmit]);

    return (
        <>
            <TextInput
                radius={'xl'}
                className='!rounded-full  '
                classNames={{ input: '!bg-[#f1efef]' }}
                rightSection={
                    <SlMagnifier />
                }
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search...'
                value={search}
            />

            <Menu closeOnItemClick={false} opened={menuOpened} onClose={() => setMenuOpened(false)} openDelay={100} closeDelay={400} shadow="md" width={300}>
                <Menu.Target>
                    <button onClick={() => setMenuOpened(true)} className={`max-w-16 !size-10 !p-0 text-xl ${activeFilter ? 'bg-[#38b6ff] text-white' : 'bg-[#F1EFEF] text-fontColor'}  hover:!text-white hover:!bg-[#38b6ff]  rounded-full flex justify-center items-center`}  >
                        <IoFilter />
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label onClick={() => setMenuOpened(true)} >
                        <div>
                            <div>
                                <label>Type</label>
                                <Select
                                    data={podcastType}
                                    className="!rounded-full"
                                    variant="filled"
                                    radius="xl"
                                    searchable
                                    clearable
                                    value={tags?.type || ''}
                                    onChange={(e) => setTags({ ...tags, type: e })}
                                />
                            </div>
                            <div>
                                <label>Niche</label>
                                <Select
                                    data={podcastNiche}
                                    className="!rounded-full"
                                    variant="filled"
                                    radius="xl"
                                    searchable
                                    clearable
                                    value={tags?.niche || ''}
                                    onChange={(e) => setTags({ ...tags, niche: e })}
                                />
                            </div>
                            <div>
                                <label>Pays</label>
                                <Select
                                    searchable
                                    clearable
                                    data={Country.getAllCountries().map((item) => item.name)}
                                    className='w-full !rounded-full'
                                    variant="filled"
                                    radius="xl"
                                    value={tags?.pays || ''}
                                    onChange={(e) => setTags({ ...tags, pays: e })}
                                />
                            </div>
                            <div>
                                <label>Tarif</label>
                                <Select
                                    searchable
                                    clearable
                                    data={[{ value: 'Free', label: 'Gratuit' }, { value: 'Paid', label: 'Débloquer' }]}
                                    className='w-full !rounded-full'
                                    variant="filled"
                                    radius="xl"
                                    value={tags?.tarif || ''}
                                    onChange={(e) => { setTags({ ...tags, tarif: e }) }}
                                />
                            </div>
                        </div>
                    </Menu.Label>
                </Menu.Dropdown>
            </Menu >
        </>
    )
}

function cleanBase64String(base64String) {
    return base64String.replace(/[\n\r\s]+/g, ''); // Remove unwanted characters
}

function downloadDocument({ base64String, filename, mimeType }) {
    try {
        // Clean the Base64 string
        const cleanString = cleanBase64String(base64String);

        // Decode the Base64 string to binary data
        const binaryData = atob(cleanString);
        const binaryArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            binaryArray[i] = binaryData.charCodeAt(i);
        }

        // Create a Blob from the binary data
        const blob = new Blob([binaryArray], { type: mimeType });

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;

        // Trigger the download
        link.click();

        // Clean up the URL object
        URL.revokeObjectURL(link.href);
    } catch (err) {
        console.error("Error downloading document:", err);
    }
}


export default BusinessIdeas