import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPlans } from '../../../redux/actions/subscriptionActions'
import { Loader } from '@mantine/core'
import CheckoutDrawer from '../../../components/payments/CheckoutDrawer'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Link } from 'react-router-dom'
import { getCurrencySymbol } from '../../../services/helpers/Currency'

const PackageListPage = () => {
    const [isOpen, setOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null)
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state?.auth);
    const { plansList, plansListLoading } = useSelector((state) => state?.subscription);
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);
    useEffect(() => {
        dispatch(getPlans());
    }, [dispatch])

    const handleOpenCheckoutDrawer = (item) => {
        setSelectedPlan(item)
        setOpen(true)
    }

    return (
        <section className="w-full h-full">
            <Elements stripe={stripePromise}>
                <CheckoutDrawer isOpen={isOpen} setOpen={setOpen} selectedPlan={selectedPlan} />
            </Elements>
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-fontColor ">Investissez en vous même !</h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl ">
                        "The best investment you can make is in yourself." <strong className='font-bold'>Warren Buffett</strong>
                    </p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {plansListLoading ? (
                        <>
                            <div className='w-full h-full'>

                            </div>
                            <div className='w-full h-full flex justify-center'>
                                <Loader />
                            </div>
                            <div className='w-full h-full'>

                            </div>
                        </>
                    ) : plansList.length == 0 && plansList == null ? (
                        <div className='w-full h-full'>
                            <p className='text-2xl text-center text-fontColor '>
                                No Plans found
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col h-fit p-3 w-full text-fontColor bg-[#EFEEEE]   border border-[#EFEEEE] shadow-md  hover:border-[#38b6ff] hover:shadow-xl cursor-pointer xl:p-4 ">
                                <h3 className="mb-3 w-fit text-lg font-normal capitalize text-white bg-[#ff6c3d] px-4 ">Basic</h3>
                                <ul className='list-disc mb-3 pl-4 flex-1 mt-2 min-h-32'>
                                    <li>
                                        <p className="font-normal text-fontColor  text-sm ">Accès limité aux Podcasts</p>
                                    </li>
                                    <li>
                                        <p className="font-normal text-fontColor  text-sm ">Accès limité à la documentation</p>
                                    </li>
                                    <li>
                                        <p className="font-normal text-fontColor  text-sm ">Accès limité aux cours</p>
                                    </li>
                                </ul>

                                {user.role == 'user' &&
                                    (
                                        <button
                                            className="text-white bg-[#C4C1C1] cursor-not-allowed bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium text-sm px-5 py-2.5 text-center">
                                            Je me lance
                                        </button>
                                    )
                                }

                            </div>
                            {plansList.map((item, i) => (
                                <div className="flex flex-col p-3 w-full text-fontColor bg-[#F5FBFF]   border border-[#F5FBFF] shadow-md  hover:border-[#38b6ff] hover:shadow-xl cursor-pointer xl:p-4 ">
                                    <h3 className="mb-3 w-fit text-lg font-normal capitalize text-white bg-[#ff6c3d] px-4">{item?.name}</h3>
                                    <div className='flex-1 flex flex-col mb-4'>
                                        <p className="font-normal text-fontColor flex-1 text-sm">
                                            {item?.name.toLowerCase() === 'starter' ? (
                                                <ul className="list-disc pl-5 space-y-2 text-[11pt] font-sans text-fontColor">
                                                    <li>
                                                        <p className='font-bold text-fontColor'>+2000 Podcasts &amp; Études de Cas de Fondateurs</p>
                                                        <ul className="list-[circle] pl-5 space-y-2">
                                                            <li>
                                                                <p className=' text-fontColor'>Accès illimité à notre base de données d&apos;études de cas d&apos;entreprises prospères.</p>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className='font-bold'>Analyse approfondie &amp; des rapports exclusifs</p>
                                                        <ul className="list-[circle] pl-5 space-y-2">
                                                            <li>
                                                                <p className=' text-fontColor'>Une véritable mine d&apos;or de données sur les tendances émergentes et les idées de business à 1 million de dollars.</p>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            ) : (
                                                <ul className="list-disc pl-5 space-y-2 text-[11pt] font-sans text-fontColor">
                                                    <li>
                                                        <p className='font-bold text-fontColor'>Tous dans Starter +</p>
                                                    </li>
                                                    <li>
                                                        <p className='font-bold text-fontColor'>Le programme complet Entrepreneur Anonyme:</p>
                                                        <ul className="list-[circle] pl-5 space-y-2 text-fontColor">
                                                            <li>
                                                                <p className=' text-fontColor'> Accès illimité à tous les cours, ateliers et plans d&apos;action</p>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </p>

                                        <div className="flex justify-start items-baseline    mt-6">
                                            <span className="mr-2 text-3xl font-semibold text-fontColor uppercase">{item?.default_price?.unit_amount / 100} {getCurrencySymbol(item?.default_price?.currency)}</span>
                                            <span className="text-gray-500 block font-normal">{item?.default_price?.recurring?.interval_count}/{item?.default_price?.recurring?.interval == 'month' ? 'mois' : item?.default_price?.recurring?.interval == 'year' ? 'en' : item?.default_price?.recurring?.interval}</span>
                                        </div>
                                        <p className='text-sm text-red-400'>{item?.metadata?.price_details} </p>
                                    </div>

                                    {user.role == 'user' ?
                                        user?.stripeSubscriptionID ? (
                                            <div className='flex flex-col gap-1 justify-center items-center w-full'>
                                                <p className='text-sm text-red-400'>Vous avez déjà un abonnement</p>
                                                <Link
                                                    to={'/dashboard/settings/subscription'}
                                                    className="text-white bg-[#6a71d1] hover:bg-[#7279db] focus:ring-4 focus:ring-primary-200 font-medium text-sm px-5 py-2.5 text-center">
                                                    Voir mon abonnement
                                                </Link>
                                            </div>
                                        ) :
                                            (
                                                <button
                                                    onClick={() => handleOpenCheckoutDrawer(item)}
                                                    className="text-white bg-[#38b6ff] bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium text-sm px-5 py-2.5 text-center">
                                                    Commencer
                                                </button>
                                            ) : (
                                            <button
                                                className="text-white bg-[#bbbcbd] cursor-not-allowed bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium text-sm px-5 py-2.5 text-center">
                                                Uniquement pour les utilisateurs
                                            </button>
                                        )}
                                </div>
                            ))}

                        </>

                    )
                    }
                </div>
            </div>

        </section>
    )
}

export default PackageListPage