import { Badge, Button, Flex, Grid, Menu, Skeleton, Table, TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clientsData, dashboardData } from '../../../data/data';
import SettingMenu from '../../../components/SettingMenu';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@mantine/hooks';
import AddEditorModal from '../../../components/modals/AddEditor';
import { BlockEditor, GetEditor } from '../../../redux/actions/authActions';
import { BsThreeDots } from 'react-icons/bs';
import Swal from 'sweetalert2';

const EditorsSetting = () => {
    const md = useMediaQuery('(max-width: 767px)');
    const { user, addEditorLoading, getEditors } = useSelector((state) => state?.auth);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const [editData, setEditData] = useState(null);
    useEffect(() => {
        dispatch(GetEditor())
    }, [dispatch])

    const handleDelete = async (element) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, ${element.isActive ? 'block' : 'activate'} it!`
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let resp = await dispatch(BlockEditor(element?._id));
                    if (resp.success) {
                        Swal.fire({
                            title: `${element.isActive ? 'Blocked' : 'Activated'}!`,
                            text: `Editor has been ${element.isActive ? 'blocked' : 'activated'}.`,
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                dispatch(GetEditor());
                            }
                        })
                    }

                }
            });

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='p-3 md:p-6 w-full'>
            <AddEditorModal data={editData} setEditData={setEditData} openModal={openModal} setOpenModal={setOpenModal} />
            <div className='flex justify-between items-center flex-wrap'>
                <h2 className='text-fontColor text-2xl w-fit font-bold'>
                    Réglages
                </h2>
                {user.role == 'admin' && (
                    <Button onClick={() => setOpenModal(true)} radius={'0'} className='px-2 md:!px-5 !min-w-[fit-content]' styles={{ label: { fontSize: md ? '10px' : '13px' } }} h={'40px'} variant='filled' color={'#535353'}>
                        Ajouter un éditeur
                    </Button>
                )}
            </div>
            <div className='w-full overflow-hidden h-full  mt-2'>
                <SettingMenu path={'editor'} />
                <div className='w-full overflow-auto  mt-10'>
                    <table className='w-full' withRowBorders={false}  >
                        <thead>
                            <tr>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-start'>Name</th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-start'>Email </th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-center'>Phone</th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-start !w-[300px]'>Date d’inscription </th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-start !w-[300px]'>Status </th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addEditorLoading ? (
                                // Show skeletons when loading
                                <>
                                    {[...Array(5)].map((_, index) => (
                                        <tr key={index}>
                                            <td colSpan={6}>
                                                <Skeleton height={50} className="w-full" mt={10} />
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            ) : getEditors?.length === 0 ? (
                                // Show message when no clients are found
                                <tr>
                                    <td colSpan={6}>
                                        <p className="text-2xl text-center w-full">No Clients found</p>
                                    </td>
                                </tr>
                            ) : (
                                // Render client rows
                                getEditors?.map((element, i) => (
                                    <tr key={i}>

                                        <td className="text-fontColor text-xs md:text-sm py-2 w-fit min-w-16  p-2 text-start">
                                            {element.name}
                                        </td>
                                        <td className="text-fontColor text-xs md:text-sm py-2 w-fit min-w-16   p-2 text-start">
                                            {element.email}
                                        </td>
                                        <td className="text-fontColor text-xs md:text-sm py-2 w-fit min-w-16 max-w-[100px] p-2 text-center">
                                            {element.phone}
                                        </td>
                                        <td className="text-fontColor text-xs md:text-sm py-2 !w-[20%] min-w-16 p-2 text-start">
                                            {formatDateTime(element.createdAt)}
                                        </td>
                                        <td className="text-fontColor text-xs md:text-sm py-2 min-w-8 !w-[10%]  p-2 text-start">
                                            {element.isActive ? <Badge variant="light" color="blue">Active</Badge> : <Badge variant="light" color="red">Blocked</Badge>}
                                        </td>
                                        <td className="text-fontColor text-xs md:text-sm py-2 w-fit min-w-16 max-w-[100px] p-2 text-center">
                                            {user.role == 'admin' && (
                                                <Menu shadow="md" width={200} className='relative'>
                                                    <Menu.Target>
                                                        <button className='px-2 py-1 hover:bg-slate-200 text-2xl text-fontColor rounded-md'>
                                                            <BsThreeDots />
                                                        </button>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            onClick={() => { setEditData(element); setOpenModal(true) }}
                                                        >
                                                            Update
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            color={element.isActive ? "red" : 'blue'}
                                                            onClick={() => handleDelete(element)}
                                                        >
                                                            {element.isActive ? 'Block' : 'Activate'}
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    )
}

function formatDateTime(date) {
    const datetime = new Date(date);
    const day = String(datetime.getDate()).padStart(2, '0');  
    const month = String(datetime.getMonth() + 1).padStart(2, '0'); 
    const year = datetime.getFullYear();
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} - ${hours}:${minutes}`;
}
export default EditorsSetting