import {
    Dribbble,
    Facebook,
    Github,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';
import Link from 'next/link';

const data = {
    facebookLink: 'https://facebook.com/marketplace',
    instaLink: 'https://instagram.com/marketplace',
    twitterLink: 'https://twitter.com/marketplace',
    githubLink: 'https://github.com/marketplace',
    dribbbleLink: 'https://dribbble.com/marketplace',
    services: {
        ropa: '/ropa',
        zapatos: '/zapatos',
        tecnologia: '/tecnologia',
        accesorios: '/accesorios',
    },
    about: {
        about: '/nosotros',
        historia: '/historia',
        terminos: '/terminos-y-condiciones',
        privacidad: '/politica-de-privacidad',
    },
    help: {
        faqs: '/preguntas-frecuentes',
        soporte: '/soporte',
        devoluciones: '/devoluciones',
    },
    contact: {
        email: 'info@marketplace.com',
        phone: '+34 911 234 567',
        address: 'Madrid, España',
    },
    company: {
        name: 'MarketPlace',
        description:
            'El mejor marketplace para encontrar productos de calidad: ropa de moda, zapatos cómodos y tecnología de última generación.',
        logo: '/logo.webp',
    },
};

const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: data.facebookLink },
    { icon: Instagram, label: 'Instagram', href: data.instaLink },
    { icon: Twitter, label: 'Twitter', href: data.twitterLink },
    { icon: Github, label: 'GitHub', href: data.githubLink },
    { icon: Dribbble, label: 'Dribbble', href: data.dribbbleLink },
];

const aboutLinks = [
    { text: 'Sobre Nosotros', href: data.about.about },
    { text: 'Nuestra Historia', href: data.about.historia },
    { text: 'Términos y Condiciones', href: data.about.terminos },
    { text: 'Política de Privacidad', href: data.about.privacidad },
];

const serviceLinks = [
    { text: 'Ropa', href: data.services.ropa },
    { text: 'Zapatos', href: data.services.zapatos },
    { text: 'Tecnología', href: data.services.tecnologia },
    { text: 'Accesorios', href: data.services.accesorios },
];

const helpfulLinks = [
    { text: 'Preguntas Frecuentes', href: data.help.faqs },
    { text: 'Soporte', href: data.help.soporte },
    { text: 'Devoluciones', href: data.help.devoluciones, hasIndicator: true },
];

const contactInfo = [
    { icon: Mail, text: data.contact.email },
    { icon: Phone, text: data.contact.phone },
    { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
    return (
        <footer className="bg-[#030303] dark:bg-[#030303]/20 mt-16 w-full place-self-end rounded-t-xl text-white/60">
            <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div>
                        <div className="text-white/60 flex justify-center gap-2 sm:justify-start">
                            <img
                                src={data.company.logo || '/placeholder.svg'}
                                alt="logo"
                                className="h-8 w-8 rounded-full"
                            />
                            <span className="text-2xl font-semibold">
                {data.company.name}
              </span>
                        </div>

                        <p className="text-white/60 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
                            {data.company.description}
                        </p>

                        <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
                            {socialLinks.map(({ icon: Icon, label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-white/60 hover:text-white/80 transition"
                                    >
                                        <span className="sr-only">{label}</span>
                                        <Icon className="size-6" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">About Us</p>
                            <ul className="mt-8 space-y-4 text-sm">
                                {aboutLinks.map(({ text, href }) => (
                                    <li key={text}>
                                        <a
                                            className="text-white/60 transition"
                                            href={href}
                                        >
                                            {text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Our Services</p>
                            <ul className="mt-8 space-y-4 text-sm">
                                {serviceLinks.map(({ text, href }) => (
                                    <li key={text}>
                                        <a
                                            className="text-white/60 transition"
                                            href={href}
                                        >
                                            {text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Helpful Links</p>
                            <ul className="mt-8 space-y-4 text-sm">
                                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                                    <li key={text}>
                                        <a
                                            href={href}
                                            className={`${
                                                hasIndicator
                                                    ? 'group flex justify-center gap-1.5 sm:justify-start'
                                                    : 'text-white/60 transition'
                                            }`}
                                        >
                      <span className="text-white/60 transition">
                        {text}
                      </span>
                                            {hasIndicator && (
                                                <span className="relative flex size-2">
                          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-primary relative inline-flex size-2 rounded-full" />
                        </span>
                                            )}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Contact Us</p>
                            <ul className="mt-8 space-y-4 text-sm">
                                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                                    <li key={text}>
                                        <a
                                            className="flex items-center justify-center gap-1.5 sm:justify-start"
                                            href="#"
                                        >
                                            <Icon className="text-white/60 size-5 shrink-0 shadow-sm" />
                                            {isAddress ? (
                                                <address className="text-white/60 -mt-0.5 flex-1 not-italic transition">
                                                    {text}
                                                </address>
                                            ) : (
                                                <span className="text-white/60 flex-1 transition">
                          {text}
                        </span>
                                            )}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t pt-6">
                    <div className="text-center sm:flex sm:justify-between sm:text-left">
                        <p className="text-sm">
                            <span className="block sm:inline">All rights reserved.</span>
                        </p>

                        <p className="text-white/60 mt-4 text-sm transition sm:order-first sm:mt-0">
                            &copy; 2025 {data.company.name}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
