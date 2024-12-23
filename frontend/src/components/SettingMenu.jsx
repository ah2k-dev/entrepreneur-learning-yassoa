import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const SettingNavs = [
    {
        link: "/dashboard/settings/profile",
        label: 'Profil',
        allowed: ['admin', 'user', 'editor']
    },
    {
        link: "/dashboard/settings/clients",
        label: 'Clients',
        allowed: ['admin']
    },
    {
        link: "/dashboard/settings/editor",
        label: 'Editors',
        allowed: ['admin']
    },
    {
        link: "/dashboard/settings/invoices",
        label: 'Factures',
        allowed: ['user']
    },
    {
        link: "/dashboard/settings/subscription",
        label: 'Abonnement',
        allowed: ['user']
    },
]

const SettingMenu = ({ path }) => {
    const { user } = useSelector((state) => state?.auth)
    return (
        <div className='mt-3 gap-3 courseStepsList flex'>
            {SettingNavs.map((item, i) =>
                item.allowed.includes(user.role) &&
                (
                    <MenuButton link={item.link} label={item.label} currPath={path} />
                ))}
        </div>
    )
}


const MenuButton = ({ link, label, currPath }) => {
    return (
        <Link
            to={link}
            className={`capitalize transition-all duration-200 block text-sm md:text-base py-2 px-4 md:px-10 mb-1 hover:bg-blue-300 hover:text-white  rounded-full ${link.includes(currPath) ? 'bg-[#38b6ff] text-white' : 'bg-[#f1efef] text-fontColor'} `}
        >
            {label}
        </Link>
    )
}

export default SettingMenu