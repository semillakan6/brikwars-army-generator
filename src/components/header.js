"use client";

import * as React from "react";
import Link from "next/link";
import { Moon, Sun, Users, Map, Book, Settings, HelpCircle, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import "@fortawesome/fontawesome-free/js/all.js";

const ListItem = React.forwardRef(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          href={href}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const referenceItems = [
  {
    title: "Rules Reference",
    href: "https://brikwars.com/rules/2020/core-rules.htm",
    description: "Core rules and mechanics",
    target: "_blank"
  },
  {
    title: "Minifig Armor Guide",
    href: "https://brikwars.com/rules/2020/3.htm#3",
    description: "Armor, shields, and gear",
    target: "_blank"
  },
  {
    title: "Minifig Weapons Guide",
    href: "https://brikwars.com/rules/2020/3.htm",
    description: "Minifig Weapons Guide",
    target: "_blank"
  },
  {
    title: "Specialties",
    href: "https://brikwars.com/rules/2020/s.htm",
    description: "Minifig Specialties Guide",
    target: "_blank"
  },
  {
    title: "MOC Creation Guide",
    href: "https://brikwars.com/rules/2020/moc-combat.htm",
    description: "Weapon types and statistics",
    target: "_blank"
  },
  {
    title: "MOC Weapons Guide",
    href: "https://brikwars.com/rules/2020/8.htm",
    description: "Weapon types and statistics",
    target: "_blank"
  },
];

export function Header() {
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden mr-2 transition-colors ${mobileMenuOpen ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className={`h-5 w-5 transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} />
        </Button>
        
        {/* Logo - visible on all screens */}
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <span className="font-bold text-sm sm:text-base">
            <i className="fas fa-home mr-2"></i> BrikWars Army Generator
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">Army Builder</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Objective Card Generator</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/objective-generator" title="Objective Card Generator">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-cards-blank h-4 w-4" />
                        Generate custom objective cards for missions
                      </div>
                    </ListItem>
                    <ListItem href="/objective-dealer" title="Objective Card Dealer">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-random h-4 w-4" />
                        Deal random objective cards to players
                      </div>
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Reference</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {referenceItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                        target={item.target}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`absolute top-14 left-0 right-0 bg-background border-b md:hidden z-50 transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform -translate-y-4 pointer-events-none'
        }`}>
            <div className="container py-4 space-y-2">
              <Link 
                href="/" 
                className="block px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Army Builder
              </Link>
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">Objective Cards</div>
                <Link 
                  href="/objective-generator" 
                  className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-cards-blank mr-2"></i>
                  Objective Card Generator
                </Link>
                <Link 
                  href="/objective-dealer" 
                  className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-random mr-2"></i>
                  Objective Card Dealer
                </Link>
              </div>
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">Reference</div>
                {referenceItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.target}
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search bar here if needed */}
          </div>
          <nav className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
