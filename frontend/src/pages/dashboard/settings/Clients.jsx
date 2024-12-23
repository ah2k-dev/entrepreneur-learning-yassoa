import { Button, Flex, Grid, Skeleton, Table, TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clientsData, dashboardData } from '../../../data/data';
import SettingMenu from '../../../components/SettingMenu';
import { useDispatch, useSelector } from 'react-redux';
import { GetClients } from '../../../redux/actions/authActions';
import { getCurrencySymbol } from '../../../services/helpers/Currency';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useMediaQuery } from '@mantine/hooks';

const ClientsSetting = () => {
    const dispatch = useDispatch();
    const { clients, clientsLoading } = useSelector((state) => state?.auth);
    const [csvLoading, setCsvLoading] = useState(false);
    const md = useMediaQuery('(max-width: 767px)');
    useEffect(() => {
        dispatch(GetClients())
    }, [dispatch])

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename: 'EA_clients_data'
    });

    const handleExportData = () => {
        try {
            setCsvLoading(true)
            if (clients.length == 0) {
                warningMessage('Aucune donnée disponible pour le téléchargement')
            }
            const rowData = clients.map((row, i) => {
                return {
                    "S.No": (i + 1),
                    "Date d’inscription": formatDateTime(row.createdAt),
                    "Client": row.name,
                    "Level": row?.payments[row?.payments?.length - 1]?.stripePlanType,
                    "Paiement": row.totalAmount,
                    "Ancienneté": timeAgo(row.createdAt),
                    "Email": row.email,
                    "currency": getCurrencySymbol(import.meta.env.VITE_CURRENCY)
                }
            });

            const csv = generateCsv(csvConfig)(rowData);
            download(csvConfig)(csv);

            setCsvLoading(false)
        } catch (error) {
            console.log(error)
            setCsvLoading(false)

        }
    };

    return (
        <div className='p-3 md:p-6 w-full'>
            <div className='flex justify-between items-center flex-wrap'>
                <h2 className='text-fontColor text-2xl w-fit font-bold'>
                    Réglages
                </h2>
                <Button disabled={csvLoading} onClick={() => handleExportData()} radius={'0'} className='px-2 md:!px-5' styles={{ label: { fontSize: md ? '10px' : '13px' } }} h={'40px'} variant='filled' color={'#535353'}>
                    Download Data
                </Button>
            </div>
            <div className='w-full overflow-hidden h-full  mt-2'>

                <SettingMenu path={'clients'} />

                <div className='w-full max-w-screen-xl overflow-auto  mt-10'>
                    <table className='w-full' withRowBorders={false}  >
                        <thead>
                            <tr>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-start !w-[300px]'>Date d’inscription </th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-start'>Client</th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-center'>Level </th>
                                <th className='text-fontColor font-semibold  text-base md:text-lg text-end'>Paiement</th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-center'>Ancienneté</th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-start'>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientsLoading ? (
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
                            ) : clients?.length === 0 ? (
                                // Show message when no clients are found
                                <tr>
                                    <td colSpan={6}>
                                        <p className="text-2xl text-center w-full">No Clients found</p>
                                    </td>
                                </tr>
                            ) : (
                                // Render client rows
                                clients?.map((element, i) => (
                                    <tr key={i}>
                                        <td className="text-fontColor text-sm md:text-base py-2 !w-[20%] min-w-16 p-2 text-start">
                                            {formatDateTime(element.createdAt)}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-start">
                                            {element.name}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-center">
                                            {element?.payments[element?.payments?.length - 1]?.stripePlanType}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-end">
                                            {element.totalAmount} {getCurrencySymbol(import.meta.env.VITE_CURRENCY)}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-center">
                                            {timeAgo(element.createdAt)}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit md:w-[30%] !min-w-8 !max-w-[100px] p-2 text-start">
                                            {element.email}
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

function timeAgo(createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdDate) / 1000);

    const intervals = {
        year: 31536000,   // Seconds in a year
        month: 2592000,   // Seconds in a month
        week: 604800,     // Seconds in a week
        day: 86400,       // Seconds in a day
        hour: 3600,       // Seconds in an hour
        minute: 60,       // Seconds in a minute
        second: 1         // Seconds in a second
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const count = Math.floor(diffInSeconds / seconds);
        if (count >= 1) {
            return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
        }
    }

    return "just now";
}

export default ClientsSetting