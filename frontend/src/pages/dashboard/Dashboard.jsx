import { Button, Skeleton, Table } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DashboardList } from '../../redux/actions/authActions';
import { warningMessage } from '../../services/helpers';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { getCurrencySymbol } from '../../services/helpers/Currency';

const Dashboard = () => {
    const { user } = useSelector((state) => state?.auth);
    const navigate = useNavigate();
    const { dashboardLoading, dashboardData } = useSelector((state) => state?.auth);
    const dispatch = useDispatch();
    const [csvLoading, setCsvLoading] = useState(false)
    const md = useMediaQuery('(max-width: 767px)');

    useEffect(() => {
        if (user.role != 'admin') {
            navigate('/dashboard/podcasts')
            return;
        }
        dispatch(DashboardList());
    }, [user])

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename: 'EA_dashboard_data'
    });
    const handleExportData = () => {
        try {
            setCsvLoading(true)
            if (dashboardData.length == 0) {
                warningMessage('Aucune donnée disponible pour le téléchargement')
            }
            const rowData = dashboardData.map((row, i) => {
                return {
                    "S.No": (i + 1),
                    "Date": row.date,
                    "Tot users": row.totalUsers,
                    "New users": row.totalNewUsers,
                    "Level 2": row.newSubscribers,
                    "Payment": row.todayRevenue,
                    "Total Revenue": row.totalRevenue,
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

    if (user.role == 'admin') {
        return (
            <div className='p-6'>
                <div className='flex justify-between items-center flex-wrap'>
                    <h2 className='text-fontColor text-2xl w-fit font-bold'>
                        Dashboard
                    </h2>
                    <Button disabled={csvLoading} onClick={() => handleExportData()} radius={'0'} className='px-2 md:!px-5' styles={{ label: { fontSize: md ? '10px' : '13px' } }} h={'40px'} variant='filled' color={'#535353'}>
                        Download Data
                    </Button>
                </div>

                <div className='w-full overflow-auto max-w-screen-xl mt-10'>
                    <table className='w-full' withRowBorders={false}  >
                        <thead>
                            <tr>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-start !w-[300px]'>Date </th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-center'>Tot users</th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-center'>New users </th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-center'>Level 2</th>
                                <th className='text-fontColor font-semibold text-base md:text-lg text-end'>Payment</th>
                                <th className='text-fontColor font-semibold text-base md:text-lg text-end'>Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardLoading ? (
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
                            ) : dashboardData?.length === 0 ? (
                                // Show message when no data are found
                                <tr>
                                    <td colSpan={6}>
                                        <p className="text-2xl text-center w-full">Aucune donnée trouvée</p>
                                    </td>
                                </tr>
                            ) : (
                                // Render rows
                                dashboardData?.map((element, i) => (
                                    <tr key={i}>
                                        <td className="text-fontColor text-sm md:text-base py-2 !w-[20%] min-w-16 p-2 text-start">
                                            {(element.date)}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-center">
                                            {element.totalUsers}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-center">
                                            {element?.totalNewUsers}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-center">
                                            {element.newSubscribers}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-end">
                                            {(element.todayRevenue)} {getCurrencySymbol(import.meta.env.VITE_CURRENCY)}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit md:w-[30%] !min-w-8 !max-w-[100px] p-2 text-end">
                                            {element.totalRevenue} {getCurrencySymbol(import.meta.env.VITE_CURRENCY)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    } else {
        return "not allowed"
    }
}

export default Dashboard