import React, { useEffect, useState } from 'react'
import SettingMenu from '../../../components/SettingMenu'
import { useDispatch, useSelector } from 'react-redux'
import { cancelSubscription, getMySubscription, getPaymentMethods, removePaymentMethod } from '../../../redux/actions/subscriptionActions';
import { Badge, Button, Skeleton } from '@mantine/core';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { getCurrencySymbol } from '../../../services/helpers/Currency';

const SubscriptionSettingPage = () => {
    const { mySubscription, mySubscriptionLoading } = useSelector((state) => state?.subscription);
    const { paymentMethodsList, paymentMethodsListLoading } = useSelector((state) => state?.subscription);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [subsLoading, setSubLoading] = useState(false)
    useEffect(() => {
        dispatch(getMySubscription())
        dispatch(getPaymentMethods())
    }, [])

    const handleUnSubscribe = () => {
        try {
            setSubLoading(true)
            Swal.fire({
                title: "Es-tu sûr?",
                text: "Vous êtes sur le point d'annuler votre abonnement",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Annuler mon abonnement!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let resp = await dispatch(cancelSubscription())
                    if (resp) {
                        Swal.fire({
                            title: "Annulé!",
                            text: "L'abonnement a été annulé",
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate('/dashboard/plans/list')
                            }
                        })
                    }

                }
            });
            setSubLoading(false)
        } catch (err) {
            setSubLoading(false)
            console.log(err)
        }
    }

    const handleRemoveSubscribe = (id) => {
        try {
            Swal.fire({
                title: "Es-tu sûr?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Oui, supprimez-le !"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let resp = await dispatch(removePaymentMethod(id))
                    if (resp) {
                        Swal.fire({
                            title: "Supprimé!",
                            text: "La carte a été supprimée.",
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed) {

                            }
                        })
                    }

                }
            });

        } catch (err) {
            console.log(err)
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
                <SettingMenu path={'subscription'} />
                <div className='p-4 text-fontColor mt-6'>
                    {mySubscription?.status == 'active' ? (
                        <>
                            <div className='flex w-full justify-between mt-4 items-center'>
                                <div>
                                    <p className='text-gray-700 text-sm'>
                                        Current Plan
                                    </p>
                                    <div className="flex justify-start items-center my-8 mt-2">
                                        <span className="mr-2 text-3xl font-semibold text-fontColor uppercase">{mySubscription?.plan?.amount / 100} {getCurrencySymbol(mySubscription?.plan?.currency)}</span>
                                        <Badge color='orange' variant='light' size='lg' radius={'sm'} className=" !py-4 block  !font-semibold !capitalize">{mySubscription?.plan.interval_count}/{mySubscription?.plan.interval}</Badge>
                                    </div>
                                </div>
                                {mySubscription?.status == 'active' && (
                                    <button
                                        onClick={() => handleUnSubscribe()}
                                        className="text-red-600 bg-white  border-red-600 border-solid border-2 hover:bg-red-600 hover:text-white  focus:ring-4 focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        Cancel Subscripton
                                    </button>
                                )}
                            </div>
                            <div className='mt-2'>
                                <p className='text-sm'>
                                    Status
                                </p>
                                <div className=' capitalize text-base text-[#141414]'>
                                    {mySubscription?.status}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <p className='text-sm  '>
                                    Started from:
                                </p>
                                <div className='text-base text-[#141414]'>
                                    {formatDateTime(mySubscription?.created ? mySubscription?.created * 1000 : null)}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='h-full mt-8 flex flex-col justify-center items-center font-poppins gap-2 text-fontColor'>
                                <BsFillCheckCircleFill className='text-4xl font-bold text-green-600' />
                                <h4 className='text-2xl font-bold'>Aucun abonnement trouvé</h4>
                                <p className='text-center text-gray-500 font-normal text-base'>Vous n'avez aucun abonnement!</p>
                                <button
                                    onClick={() => navigate('/dashboard/plans/list')}
                                    className="text-white mt-2 bg-[#38b6ff] bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-md text-sm px-5 md:px-12 py-2 text-center">
                                    Voir le plan
                                </button>
                            </div>
                        </>
                    )}
                    {mySubscription?.status == 'active' ? (
                        <div className='mt-3'>
                            <p className='text-sm'>
                                Current end at:
                            </p>
                            <div className='  text-base text-[#141414]'>
                                {formatDateTime(mySubscription?.current_period_end ? mySubscription?.current_period_end * 1000 : null)}
                            </div>
                        </div>
                    ) : mySubscription?.status == 'canceled' ? (
                        <div className='mt-3'>
                            <p className='text-sm'>
                                Canceled at:
                            </p>
                            <div className='  text-base text-[#141414]'>
                                {formatDateTime(mySubscription?.canceled_at ? mySubscription?.canceled_at * 1000 : null)}
                            </div>
                        </div>

                    ) : ''}
                    {paymentMethodsListLoading ? (
                        <div className='flex flex-col gap-1'>
                            <Skeleton h={40} className='w-full' />
                            <Skeleton h={40} className='w-full' />
                            <Skeleton h={40} className='w-full' />
                        </div>
                    ) : paymentMethodsList.length > 0 && (
                        <div className='mt-3'>
                            <label className='mb-2 pt-3 font-bold text-fontColor border-t border-[#a8a8a881] w-full block'>
                                Vos moyens de paiement
                            </label>
                            <div className='overflow-y-auto relative'>
                                {paymentMethodsList.map((item, i) => (
                                    <div className='flex justify-between items-center p-2 text-sm bg-slate-50 hover:bg-slate-100 cursor-pointer mb-1 text-fontColor rounded-sm' key={i}>
                                        <div className='flex gap-2 justify-center items-center'>
                                            <img className='w-8' src={`/icons/credit_cards/${item.card.display_brand}.png`} />
                                            <span className='capitalize font-medium'>
                                                {item.card.brand}
                                            </span>
                                        </div>
                                        <div className='flex items-center justify-center gap-2'>
                                            <span>
                                                XXXX XXXX XXXX {item.card.last4}
                                            </span>
                                            <Button size='xs' variant='outline' color='red' onClick={() => handleRemoveSubscribe(item.id)}>
                                                Remove Card
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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

export default SubscriptionSettingPage