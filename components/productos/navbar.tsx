"use client"

import { Book, Menu, ShoppingCart, Search, Palette, GraduationCap, History, Users, LayoutDashboard, Sparkles, Boxes } from "lucide-react";
import * as React from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import { CategoryParent, ServerResponse } from "@/app/productos/page";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: JSX.Element;
    items?: MenuItem[];
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
    mobileExtraLinks?: {
        name: string;
        url: string;
    }[];
    auth?: {
        login: {
            text: string;
            url: string;
        };
        signup: {
            text: string;
            url: string;
        };
    };
}

export default function Navbar({
                                   logo = {
                                       url: "https://ruixenui.com",
                                       src: "https://images.unsplash.com/photo-1706426629246-2a3c3e3e3ff2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // replace with your actual logo path
                                       alt: "Ruixen UI logo",
                                       title: "Ruixen UI",
                                   },

                                   menu = [
                                       { title: "Home", url: "/" },
                                       {
                                           title: "",
                                           url: "#",
                                           items: [
                                               {
                                                   title: "Zapatillas",
                                                   description: "Reusable UI components to build your app faster",
                                                   icon: <Boxes className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                               {
                                                   title: "Ropa",
                                                   description: "Prebuilt layouts for dashboards and landing pages",
                                                   icon: <LayoutDashboard className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                               {
                                                   title: "Accesorios",
                                                   description: "Beautiful lucide-react icons ready to use",
                                                   icon: <Sparkles className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                               {
                                                   title: "Perfumes",
                                                   description: "Customizable design system with dark mode support",
                                                   icon: <Palette className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                           ],
                                       },
                                       {
                                           title: "Man",
                                           url: "#",
                                           items: [
                                               {
                                                   title: "Zapatillas",
                                                   description: "Get started with guides, API references & examples",
                                                   icon: <Book className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                               {
                                                   title: "Ropa",
                                                   description: "Join our discussions and connect with other devs",
                                                   icon: <Users className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                               {
                                                   title: "Accesorios",
                                                   description: "Step-by-step guides to learn Ruixen UI quickly",
                                                   icon: <GraduationCap className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                               {
                                                   title: "Perfumes",
                                                   description: "See what's new and improved in every release",
                                                   icon: <History className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                           ],
                                       },
                                       {
                                           title: "Technology",
                                           url: "#",
                                           items: [
                                               {
                                                   title: "Moviles",
                                                   description: "Get started with guides, API references & examples",
                                                   icon: <Book className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                               {
                                                   title: "Portalites",
                                                   description: "Join our discussions and connect with other devs",
                                                   icon: <Users className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                               {
                                                   title: "Auriculares",
                                                   description: "Step-by-step guides to learn Ruixen UI quickly",
                                                   icon: <GraduationCap className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                               {
                                                   title: "Pantallas",
                                                   description: "See what's new and improved in every release",
                                                   icon: <History className="size-5 shrink-0" />,
                                                   url: "#",
                                               },
                                           ],
                                       },
                                       {
                                           title: "Forms",
                                           url: "#",
                                       },
                                       {
                                           title: "Blog",
                                           url: "#",
                                       },
                                   ],

                                   mobileExtraLinks = [
                                       { name: "Press", url: "#" },
                                       { name: "Contact", url: "#" },
                                       { name: "Community", url: "#" },
                                       { name: "Changelog", url: "#" },
                                   ],

                                   auth = {
                                       login: { text: "Sign in", url: "#" },
                                       signup: { text: "Get Started", url: "#" },
                                   },
                               }: NavbarProps) {
    const [openSearch, setOpenSearch] = React.useState(false);

    const [categories, setCategories] = useState<CategoryParent[]>([]);
    useEffect(() => {
        const getCategories = async () => {
            const response = await fetch("/api/categorias");
            const data = (await response.json()) as ServerResponse;
            setCategories(data.message as CategoryParent[]);
        }

        getCategories()
    },[])
    return (
        <section className="py-4">
            <div className="container">
                {/* Desktop Navbar */}
                <nav className="hidden items-center justify-between lg:flex">
                    <div className="flex items-center gap-2">
                        {/* Logo */}
                        <Link href={logo.url} className="flex items-center gap-2">
                            <Image width={100} height={100} src={logo.src} className="w-8" alt={logo.alt} />
                        </Link>

                        {/* Auth Buttons - Left side */}
                        <Button asChild variant="outline" size="sm" className="ml-4">
                            <Link href={auth.login.url}>{auth.login.text}</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href={auth.signup.url}>{auth.signup.text}</Link>
                        </Button>
                    </div>

                    {/* Centered Navigation Menu */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center">
                            <NavigationMenu className="**:data-radix-navigation-menu-viewport:rounded-3xl">
                                <NavigationMenuList className="rounded-3xl">
                                    {categories.map((item) => renderMenuItem(item))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpenSearch(true)}
                        >
                            <Search className="size-4" />
                        </Button>

                        {/* Cart Button */}
                        <Button variant="ghost" size="icon">
                            <ShoppingCart className="size-4" />
                        </Button>
                    </div>
                </nav>

                {/* Mobile Navbar */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        <Link href={logo.url} className="flex items-center gap-2">
                            <Image src={logo.src} className="w-8" width={100} height={100} alt={logo.alt} />
                        </Link>
                        <div className="flex items-center gap-2">
                            {/* Search button mobile */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpenSearch(true)}
                            >
                                <Search className="size-4" />
                            </Button>

                            {/* Cart button mobile */}
                            <Button variant="ghost" size="icon">
                                <ShoppingCart className="size-4" />
                            </Button>

                            {/* Menu Sheet */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="size-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="overflow-y-auto">
                                    <SheetHeader>
                                        <SheetTitle>
                                            <Link href={logo.url} className="flex items-center gap-2">
                                                <Image src={logo.src} className="w-8" alt={logo.alt} width={10} height={10}/>
                                            </Link>
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="my-6 flex flex-col gap-6">
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="flex w-full flex-col gap-4"
                                        >
                                            {menu.map((item) => renderMobileMenuItem(item))}
                                        </Accordion>
                                        <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                                            <div className="grid grid-cols-2 justify-start">
                                                {mobileExtraLinks.map((link, idx) => (
                                                    <Link
                                                        key={idx}
                                                        className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                                                        href={link.url}
                                                    >
                                                        {link.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button asChild variant="outline">
                                                <Link href={auth.login.url}>{auth.login.text}</Link>
                                            </Button>
                                            <Button asChild>
                                                <Link href={auth.signup.url}>{auth.signup.text}</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Popup */}
            <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
                <CommandInput placeholder="Search products, blogs, resources..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup className="text-gray-500" heading="Suggestions">
                        <CommandItem className="text-gray-800 dark:text-gray-200">Latest Blog</CommandItem>
                        <CommandItem className="text-gray-800 dark:text-gray-200">Pricing Plans</CommandItem>
                        <CommandItem className="text-gray-800 dark:text-gray-200">Support</CommandItem>
                        <CommandItem className="text-gray-800 dark:text-gray-200">Careers</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </section>
    );
}

const renderMenuItem = (item: CategoryParent) => {
    if (item.children) {
        return (
            <NavigationMenuItem key={item.parent_nombre} className="text-muted-foreground rounded-3xl!">
                <NavigationMenuTrigger className="rounded-3xl!">{item.parent_nombre}</NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-3xl!">
                    <ul className="w-80 p-3">
                        <NavigationMenuLink className="rounded-3xl!">
                            {item.children.map((subItem) => (
                                <li key={subItem.nombre}>
                                    <Link
                                        className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                                        href={`/productos?categorias=${subItem.id_categoria}`}
                                    >

                                        <div>
                                            <div className="text-sm font-semibold">
                                                {subItem.nombre}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </NavigationMenuLink>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <a
            key={item.parent_nombre}
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
            href={`/productos?categorias=${item.parent_id}`}
        >
            {item.parent_nombre}
        </a>
    );
};

const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem) => (
                        <Link
                            key={subItem.title}
                            className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                            href={subItem.url}
                        >
                            {subItem.icon}
                            <div>
                                <div className="text-sm font-semibold">{subItem.title}</div>
                                {subItem.description && (
                                    <p className="text-sm leading-snug text-muted-foreground">
                                        {subItem.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <a key={item.title} href={item.url} className="font-semibold">
            {item.title}
        </a>
    );
};
