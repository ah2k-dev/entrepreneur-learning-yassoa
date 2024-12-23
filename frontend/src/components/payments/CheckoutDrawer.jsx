import { Drawer, Skeleton } from '@mantine/core'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentMethod, createSubscription, getPaymentMethods } from '../../redux/actions/subscriptionActions';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { successMessage } from '../../services/helpers';
import { getMee } from '../../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';

const CheckoutDrawer = ({ isOpen, setOpen, selectedPlan }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state?.auth);
    const { paymentMethodsList, paymentMethodsListLoading, subscriptionCheckoutLoading } = useSelector((state) => state?.subscription);
    const [isPaymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        dispatch(getPaymentMethods());
    }, [])

    // stripe items
    const stripe = useStripe();
    const elements = useElements();

    // main function
    const handleCreateSubscription = async (e = null, paymentMethod = null) => {
        if (e) {
            e.preventDefault()
        }
        try {
            const priceId = selectedPlan?.default_price?.id
            const planType = selectedPlan?.name
            const prodId = selectedPlan?.id
            let paymentMethodId = null;
            let addPmtMethod = { success: false }
            if (paymentMethod) {
                paymentMethodId = paymentMethod.id;
                addPmtMethod.success = true
            } else {
                const paymentMethod = await stripe?.createPaymentMethod({
                    type: "card",
                    card: elements?.getElement(CardElement),
                });
                paymentMethodId = paymentMethod?.paymentMethod?.id;
                addPmtMethod = await dispatch(addPaymentMethod({ paymentMethodId: paymentMethodId }));
            }

            if (addPmtMethod.success) {
                let createSubs = await dispatch(createSubscription({ paymentMethodId: paymentMethodId, planId: priceId, planType: planType, prodId: prodId }));
                if (createSubs.success) {
                    dispatch(getMee())
                    setPaymentSuccess(true);
                    successMessage("Paiement réussi")
                }

            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Drawer bg={'#f6fbff'} ff={'Poppins'} offset={8} position='right' radius="md" opened={isOpen} onClose={() => setOpen(false)} title="EA Subscription">
                <div className="w-full h-full">
                    <div className='w-full'>
                        <label className='mb-2 font-bold text-fontColor border-b border-[#73717981] w-full block'>
                            Détails de l'utilisateur
                        </label>
                        <p className='flex justify-between font-poppins text-fontColor'>
                            <span className='text-sm font-semibold'>Name: </span>
                            <span className='text-sm'>{user.name}</span>
                        </p>
                        <p className='flex justify-between font-poppins text-fontColor'>
                            <span className='text-sm font-semibold'>Email: </span>
                            <span className='text-sm'>{user.email}</span>
                        </p>
                    </div>
                    <div className='w-full mt-3'>
                        <label className='mb-2 font-bold text-fontColor border-b border-[#73717981] w-full block'>
                            Abonnement sélectionné
                        </label>
                        <p className='flex justify-between font-poppins text-fontColor'>
                            <span className='text-sm font-semibold'>Plan: </span>
                            <span className='text-sm'>{selectedPlan?.name}</span>
                        </p>
                        <p className='flex justify-between font-poppins text-fontColor'>
                            <span className='text-sm font-semibold'>Price: </span>
                            <span className='text-sm uppercase'>{selectedPlan?.default_price?.unit_amount / 100} {selectedPlan?.default_price?.currency}</span>
                        </p>
                    </div>
                    {isPaymentSuccess ? <PaymentSuccess /> : (
                        <div>
                            <div className='mt-3'>

                                {paymentMethodsListLoading ? (
                                    <div className='flex flex-col gap-1'>
                                        <Skeleton h={40} className='w-full' />
                                        <Skeleton h={40} className='w-full' />
                                        <Skeleton h={40} className='w-full' />
                                    </div>
                                ) : paymentMethodsList.length > 0 && (
                                    <div className='mt-3'>
                                        <label className='mb-2 font-bold text-fontColor border-b border-[#73717981] w-full block'>
                                            Vos moyens de paiement
                                        </label>
                                        <div className='max-h-[120px] overflow-y-auto relative'>
                                            {paymentMethodsList.map((item, i) => (
                                                <div onClick={() => handleCreateSubscription(null, item)} className='flex justify-between p-2 text-sm bg-slate-50 hover:bg-slate-100 cursor-pointer mb-1 text-fontColor rounded-sm' key={i}>
                                                    <span className='capitalize font-semibold'>
                                                        {item.card.brand}
                                                    </span>
                                                    <span>
                                                        XXXX XXXX XXXX {item.card.last4}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={(e) => handleCreateSubscription(e, null)} className='w-full bg-[#f1efef] px-3 py-4 mt-6 flex flex-col gap-4 rounded-md'>
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                padding: '10px ',
                                                backgroundColor: "#f1efef",
                                                color: "#535353",
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "16px",
                                                "::placeholder": {
                                                    color: "#a8a8a8",
                                                },
                                            },
                                            invalid: {
                                                color: "#e5424d", // Color for invalid input
                                            },
                                        },
                                    }}
                                />
                                <button

                                    className="text-white bg-[#38b6ff] mt-6 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    type='submit' disabled={subscriptionCheckoutLoading}>
                                    {subscriptionCheckoutLoading ? 'Loading...' : 'Subscribe'}
                                </button>
                            </form>

                        </div>
                    )}
                </div>
            </Drawer >

        </div >
    )
}

const PaymentSuccess = () => {
    const navigate = useNavigate();
    return (
        <div className='h-full mt-8 flex flex-col justify-center items-center font-poppins gap-2 text-fontColor'>
            <BsFillCheckCircleFill className='text-4xl font-bold text-green-600' />
            <h4 className='text-2xl font-bold'>Paiement réussi!</h4>
            <p className='text-center text-gray-500 font-normal text-base'>Félicitations, votre paiement a été traité avec succès. Merci pour votre confiance !</p>
            <button
                onClick={() => navigate('/dashboard/settings/invoices')}
                className="text-white mt-2 bg-[#38b6ff] bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-md text-sm px-5 md:px-12 py-2 text-center">
                Voir les Factures
            </button>
        </div>
    )
}

export default CheckoutDrawer