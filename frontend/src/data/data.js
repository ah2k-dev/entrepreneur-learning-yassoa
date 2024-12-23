export const asideNavigation = [
    {
        label: "Dashboard",
        path: '/dashboard',
        endpoint: 'dashboard',
        allow: ['admin'],
    },
    {
        label: "Podcasts & Use Cases",
        path: '/dashboard/podcasts',
        endpoint: 'podcasts',
        allow: ['admin', 'user', 'editor'],
    },
    {
        label: "Idées de Business",
        path: '/dashboard/business-ideas',
        endpoint: 'business-ideas',
        allow: ['admin', 'user', 'editor'],
    },
    {
        label: "Cours & Ateliers",
        path: '/dashboard/courses',
        endpoint: 'courses',
        allow: ['admin', 'user', 'editor'],
    },
    {
        label: "Acheter un plan",
        path: '/dashboard/plans/buy-plan',
        endpoint: 'buy-plan',
        allow: ['admin'],
    },
]

export const dashboardData = [
    {
        date: '21 Nov 2024',
        totalUsers: '400',
        newUsers: '100',
        lavel2: '150',
        payment: '1700€',
        status: '',
    },
    {
        date: '21 Nov 2024',
        totalUsers: '400',
        newUsers: '100',
        lavel2: '150',
        payment: '1700€',
        status: '',
    },
    {
        date: '21 Nov 2024',
        totalUsers: '400',
        newUsers: '100',
        lavel2: '150',
        payment: '1700€',
        status: '',
    },
    {
        date: '21 Nov 2024',
        totalUsers: '400',
        newUsers: '100',
        lavel2: '150',
        payment: '1700€',
        status: '',
    },
    {
        date: '21 Nov 2024',
        totalUsers: '400',
        newUsers: '100',
        lavel2: '150',
        payment: '1700€',
        status: '',
    },
]

export const DummyAuth = {
    "_id": "6746257008d898dd1e16f407",
    "name": "Admin",
    "email": "ah2k.dev@gmail.com",
    "phone": "03140067817",
    "profileImage": '',
    "haveBusiness": false,
    "role": "admin",
    "emailVerified": true,
    "isActive": true,
}
export const clientsData = [
    {
        registrationDate: "21 Nov 2024 - 13:24",
        client: "Client 1",
        level: 1,
        payment: "0 €",
        seniority: "2 ans 3 mois",
        email: "Client1@gmail.com",
    },
    {
        registrationDate: "20 Nov 2024 - 11:24",
        client: "Client 2",
        level: 2,
        payment: "300 €",
        seniority: "7 mois",
        email: "Client2@gmail.com",
    },
    {
        registrationDate: "19 Nov 2024 - 03:24",
        client: "Client 3",
        level: 1,
        payment: "0 €",
        seniority: "1 mois",
        email: "Client3@gmail.com",
    },
    {
        registrationDate: "17 Nov 2024 - 16:24",
        client: "Client 4",
        level: 1,
        payment: "0 €",
        seniority: "1 mois",
        email: "Client4@gmail.com",
    },
    {
        registrationDate: "15 Nov 2024 - 21:24",
        client: "Client 5",
        level: 1,
        payment: "0 €",
        seniority: "1 mois",
        email: "Client5@gmail.com",
    },
    {
        registrationDate: "15 Nov 2024 - 17:34",
        client: "Client 6",
        level: 1,
        payment: "0 €",
        seniority: "1 mois",
        email: "Client6@gmail.com",
    },
    {
        registrationDate: "15 Nov 2024 - 15:15",
        client: "Client 7",
        level: 1,
        payment: "0 €",
        seniority: "1 mois",
        email: "Client7@gmail.com",
    },
    {
        registrationDate: "14 Nov 2024 - 10:21",
        client: "Client 8",
        level: 1,
        payment: "0 €",
        seniority: "1 mois",
        email: "Client8@gmail.com",
    },
];

export const podcastType = [
    {
        value: 'Vente & Commerce',
        label: 'Vente & Commerce'
    },
    {
        value: 'Conseil',
        label: 'Conseil'
    },
    {
        value: 'Ecommerce',
        label: 'Ecommerce'
    },
    {
        value: 'Media & Marketing',
        label: 'Media & Marketing'
    },
    {
        value: 'Service',
        label: 'Service'
    },
    {
        value: 'Software & Tech',
        label: 'Software & Tech'
    },
]
export const podcastNiche = [
    { value: 'Accessoires', label: 'Accessoires' },
    { value: 'Animaux', label: 'Animaux' },
    { value: 'Art', label: 'Art' },
    { value: 'Autre', label: 'Autre' },
    { value: 'Beauté & Bien être', label: 'Beauté & Bien être' },
    { value: 'Bébé & Enfants', label: 'Bébé & Enfants' },
    { value: 'Cadeaux', label: 'Cadeaux' },
    { value: 'Cinéma', label: 'Cinéma' },
    { value: 'Coaching', label: 'Coaching' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Contenu', label: 'Contenu' },
    { value: 'Design', label: 'Design' },
    { value: 'Divertissement', label: 'Divertissement' },
    { value: 'Ecommerce', label: 'Ecommerce' },
    { value: 'Ecriture', label: 'Ecriture' },
    { value: 'Education', label: 'Education' },
    { value: 'Energie', label: 'Energie' },
    { value: 'Environnement', label: 'Environnement' },
    { value: 'Evénementiel', label: 'Evénementiel' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Fitness', label: 'Fitness' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Hardware', label: 'Hardware' },
    { value: 'Immobilier', label: 'Immobilier' },
    { value: 'Investissement', label: 'Investissement' },
    { value: 'Joaillerie', label: 'Joaillerie' },
    { value: 'Journalisme', label: 'Journalisme' },
    { value: 'Juridique & Légal', label: 'Juridique & Légal' },
    { value: 'Luxe', label: 'Luxe' },
    { value: 'Maison & Déco', label: 'Maison & Déco' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Médical', label: 'Médical' },
    { value: 'Music', label: 'Music' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Politique', label: 'Politique' },
    { value: 'Productivité', label: 'Productivité' },
    { value: 'Recrutement & RH', label: 'Recrutement & RH' },
    { value: 'Réseaux sociaux', label: 'Réseaux sociaux' },
    { value: 'SaaS', label: 'SaaS' },
    { value: 'Santé', label: 'Santé' },
    { value: 'SEO', label: 'SEO' },
    { value: 'Sport', label: 'Sport' },
    { value: 'Système de paiement', label: 'Système de paiement' },
    { value: 'Technologie', label: 'Technologie' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Ventes & Commerce', label: 'Ventes & Commerce' },
    { value: 'Vêtement & Mode', label: 'Vêtement & Mode' },
    { value: 'Vice', label: 'Vice' },
    { value: 'Voyage & Tourisme', label: 'Voyage & Tourisme' },
];

export const revenueRanges = [
    { value: '<10K', label: '< 10 K€' },
    { value: '10K-50K', label: '10 K€ - 50 K€' },
    { value: '50K-100K', label: '50 K€ - 100 K€' },
    { value: '100K-500K', label: '100 K€ - 500 K€' },
    { value: '500K-1M', label: '500 K€ - 1M€' },
    { value: '1M-5M', label: '1 M€ - 5 M€' },
    { value: '5M-10M', label: '5 M€ - 10 M€' },
    { value: '10M-100M', label: '10 M€ - 100 M€' },
    { value: '>100M', label: '> 100 M€' },
];

export const AuDepart = [
    { value: '0€', label: '0€' },
    { value: '1000€', label: '1000€' },
    { value: '1 K€ - 5 K€', label: '1 K€ - 5 K€' },
    { value: '5 K€ - 10 K€', label: '5 K€ - 10 K€' },
    { value: '> 10 K€', label: '> 10 K€' },
];

export const employeeRanges = [
    { value: '0', label: '0 employés' },
    { value: '1', label: '1 employé' },
    { value: '2', label: '2 employés' },
    { value: '3', label: '3 employés' },
    { value: '4', label: '4 employés' },
    { value: '5', label: '5 employés' },
    { value: '6', label: '6 employés' },
    { value: '7', label: '7 employés' },
    { value: '8', label: '8 employés' },
    { value: '9', label: '9 employés' },
    { value: '10', label: '10 employés' },
    { value: '10-20', label: '10 - 20 employés' },
    { value: '20-50', label: '20 - 50 employés' },
    { value: '50-100', label: '50 - 100 employés' },
    { value: '>100', label: '> 100 employés' },
];

export const courseSteps = [
    { label: 'Introduction', value: 'introduction' },
    { label: 'Etape 1', value: 'step1' },
    { label: 'Etape 2', value: 'step2' },
    { label: 'Etape 3', value: 'step3' },
    { label: 'Etape 4', value: 'step4' },
    { label: 'Etape 5', value: 'step5' },
    { label: 'Etape 6', value: 'step6' }
]

export const podcastsSections = [
    {
        sectionIndex: 2,
        sectionName: '',
        title: "",
        content: "",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        binaryImage: null,
        imageName: null
    },
    {
        sectionIndex: 3,
        sectionName: '',
        title: "",
        content: "",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        binaryImage: null,
        imageName: null
    },
    {
        sectionIndex: 4,
        sectionName: '',
        title: "",
        content: "",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        binaryImage: null,
        imageName: null
    },
    {
        sectionIndex: 5,
        sectionName: '',
        title: "",
        content: "",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        binaryImage: null,
        imageName: null
    },
    {
        sectionIndex: 6,
        sectionName: '',
        title: "",
        content: "",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        binaryImage: null,
        imageName: null
    },
    {
        sectionIndex: 7,
        sectionName: '',
        title: "",
        content: "",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        binaryImage: null,
        imageName: null,
        binaryImage: null,
        imageName: null
    },
]

export const businessType = [
    {
        label: "Freelance",
        value: "Freelance",
    },
    {
        label: "Startup (1- 2 ans)",
        value: "Startup (1- 2 ans)",
    },
    {
        label: "Petite entreprise ( 2- 5 ans)",
        value: "Petite entreprise ( 2- 5 ans)",
    },
    {
        label: "Moyenne entreprise ( 5 - 10 ans)",
        value: "Moyenne entreprise ( 5 - 10 ans)",
    },
]

export const registerReference = [
    {
        label: "Bouche à oreille",
        value: "Bouche à oreille",
    },
    {
        label: "Facebook",
        value: "Facebook",
    },
    {
        label: "Google",
        value: "Google",
    },
    {
        label: "Instagram",
        value: "Instagram",
    },
    {
        label: "Linkedin",
        value: "Linkedin",
    },
    {
        label: "Tiktok",
        value: "Tiktok",
    },
    {
        label: "Youtube",
        value: "Youtube",
    },
    {
        label: "Autre",
        value: "Autre",
    },
]