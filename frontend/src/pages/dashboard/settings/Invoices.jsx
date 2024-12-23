import { Button, Skeleton } from '@mantine/core'
import React, { useEffect } from 'react'
import SettingMenu from '../../../components/SettingMenu';
import { useDispatch, useSelector } from 'react-redux';
import { MyInvoices } from '../../../redux/actions/authActions';
import { LuDownload } from 'react-icons/lu';
import { useMediaQuery } from '@mantine/hooks';
import { getCurrencySymbol } from '../../../services/helpers/Currency';

const InvoicesSettings = () => {
    const dispatch = useDispatch();
    const md = useMediaQuery('(max-width: 767px)');
    const { myInvoicesList, myInvoicesLoading } = useSelector((state) => state?.auth)

    useEffect(() => {
        dispatch(MyInvoices())
    }, [dispatch])



    return (
        <div className='p-3 md:p-6 w-full'>
            <div className='flex justify-between items-center flex-wrap'>
                <h2 className='text-fontColor text-2xl w-fit font-bold'>
                    Réglages
                </h2>
            </div>
            <div className='w-full overflow-hidden h-full  mt-2'>

                <SettingMenu path={'invoices'} />

                <div className='w-full max-w-screen-xl overflow-auto  mt-10'>
                    <table className='w-full' withRowBorders={false}  >
                        <thead>
                            <tr>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-start !w-[300px]'>Date </th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-center'>Type</th>
                                <th className='text-fontColor font-semibold  text-base md:text-lg text-end'>Paiement</th>
                                <th className='text-fontColor font-semibold pr-5 text-base md:text-lg text-center'>Facture</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myInvoicesLoading ? (
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
                            ) : myInvoicesList?.length === 0 ? (
                                // Show message when no myInvoicesList are found
                                <tr>
                                    <td colSpan={6}>
                                        <p className="text-2xl text-center w-full">No Invoices found</p>
                                    </td>
                                </tr>
                            ) : (
                                // Render myInvoicesList rows
                                myInvoicesList?.map((element, i) => (
                                    <tr key={i}>
                                        <td className="text-fontColor text-sm md:text-base py-2 !w-[20%] min-w-16 p-2 text-start">
                                            {formatDateTime(element.createdAt)}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-center">
                                            {element?.stripePlanType || 'Subscription'}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-[10%] max-w-[90px] p-2 text-end">
                                            {element?.amount} {getCurrencySymbol(element?.currency || import.meta.env.VITE_CURRENCY)}
                                        </td>
                                        <td className="text-fontColor text-sm md:text-base py-2 w-fit min-w-16 max-w-[100px] p-2 text-center">
                                            <button onClick={() => downloadPDF(element)} className='px-2 py-1 hover:bg-slate-200 text-2xl text-fontColor rounded-md'>
                                                <LuDownload />
                                            </button>
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


const downloadPDF = (row) => {
    // Create Invoice HTML
    const invoiceHTML = `
      <html>
        <head>
          <title>Entrepreneur Anonyme Subscription Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Entrepreneur Anonyme Subscription Invoice</h1>
          <table>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Payment</th>
            </tr>
            <tr>
              <td>${formatDateTime(row.createdAt)}</td>
              <td>${row?.stripePlanType || 'Subscription'} </td>
              <td>${row.amount} ${getCurrencySymbol(row?.currency || import.meta.env.VITE_CURRENCY)}</td>
            </tr>
          </table>
          <p>Total: ${row.amount}</p>
        </body>
      </html>
    `;

    // Open Invoice in a New Window
    const newWindow = window.open("", "_blank");
    newWindow.document.write(invoiceHTML);
    newWindow.document.close();

    // Automatically Trigger Print
    setTimeout(() => {
        newWindow.print();
        newWindow.close();
    }, 500); // Wait for the document to render
};

export default InvoicesSettings