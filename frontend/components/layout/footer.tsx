import { Send, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-black text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 py-10 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
                    {/* Brand & Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg md:text-xl font-bold">E-Mart</h3>
                        <p className="text-sm text-gray-400">Your one-stop shop for everything you need.</p>
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Subscribe to our newsletter</p>
                            <div className="flex items-center bg-white/10 rounded px-3 py-2 border border-gray-700">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
                                />
                                <Send size={16} className="cursor-pointer hover:opacity-70 text-secondarytwo" />
                            </div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-base md:text-lg">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-secondarytwo transition">New Arrivals</Link></li>
                            <li><Link href="/products" className="hover:text-secondarytwo transition">Best Sellers</Link></li>
                            <li><Link href="/products" className="hover:text-secondarytwo transition">Flash Sales</Link></li>
                            <li><Link href="/products" className="hover:text-secondarytwo transition">All Products</Link></li>
                            <li><Link href="/products" className="hover:text-secondarytwo transition">Deals</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-base md:text-lg">Account</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/account" className="hover:text-secondarytwo transition">My Account</Link></li>
                            <li><Link href="/auth/sign-in" className="hover:text-secondarytwo transition">Login / Register</Link></li>
                            <li><Link href="/cart" className="hover:text-secondarytwo transition">My Orders</Link></li>
                            <li><Link href="/wishlist" className="hover:text-secondarytwo transition">Wishlist</Link></li>
                            <li><Link href="/cart" className="hover:text-secondarytwo transition">Returns</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-base md:text-lg">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-secondarytwo" />
                                <span>123 Tech Street, Silicon Valley, CA 94025</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="flex-shrink-0 text-secondarytwo" />
                                <a href="mailto:support@emart.com" className="hover:text-secondarytwo transition">support@emart.com</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="flex-shrink-0 text-secondarytwo" />
                                <a href="tel:+1234567890" className="hover:text-secondarytwo transition">+1 (234) 567-890</a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-base md:text-lg">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-secondarytwo transition">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-secondarytwo transition">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-secondarytwo transition">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-secondarytwo transition">Press</Link></li>
                            <li><Link href="/about" className="hover:text-secondarytwo transition">Sustainability</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 my-8 md:my-10" />

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Copyright */}
                    <p className="text-sm text-gray-500">
                        © 2024 E-Mart. All rights reserved.
                    </p>

                    {/* Legal Links */}
                    <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-400">
                        <Link href="/contact" className="hover:text-secondarytwo transition">Privacy Policy</Link>
                        <Link href="/contact" className="hover:text-secondarytwo transition">Terms of Service</Link>
                        <Link href="/contact" className="hover:text-secondarytwo transition">Cookie Policy</Link>
                        <Link href="/contact" className="hover:text-secondarytwo transition">Contact Us</Link>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-400 hover:text-secondarytwo transition" aria-label="Facebook">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-secondarytwo transition" aria-label="Twitter">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-secondarytwo transition" aria-label="LinkedIn">
                            <Linkedin size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-secondarytwo transition" aria-label="YouTube">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
