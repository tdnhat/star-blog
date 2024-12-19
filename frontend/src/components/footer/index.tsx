import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="footer bottom-0 p-10 bg-base-200 text-base-content">
            <div>
                <h4 className="footer-title">Star Blog</h4>
                <Link href="/about" className="link link-hover">About</Link>
                <Link href="/contact" className="link link-hover">Contact</Link>
                <Link href="/guides" className="link link-hover">Guides</Link>
                <Link href="/software" className="link link-hover">Software comparisons</Link>
            </div>
            <div>
                <h4 className="footer-title">Support</h4>
                <Link href="/help" className="link link-hover">Help</Link>
                <Link href="/privacy" className="link link-hover">Privacy Policy</Link>
                <Link href="/terms" className="link link-hover">Terms of use</Link>
                <Link href="/code-of-conduct" className="link link-hover">Code of Conduct</Link>
            </div>
            <div>
                <h4 className="footer-title">Stay Connected</h4>
                <a href="https://twitter.com" className="link link-hover">Twitter</a>
                <a href="https://facebook.com" className="link link-hover">Facebook</a>
                <a href="https://github.com" className="link link-hover">GitHub</a>
                <a href="https://instagram.com" className="link link-hover">Instagram</a>
            </div>
            <div>
                <h4 className="footer-title">More</h4>
                <Link href="/sponsors" className="link link-hover">Sponsors</Link>
                <Link href="/faq" className="link link-hover">FAQ</Link>
                <Link href="/advertise" className="link link-hover">Advertise</Link>
                <Link href="/shop" className="link link-hover">DEV Shop</Link>
            </div>
            <div className="footer footer-center p-4 bg-base-300 text-base-content">
                <div>
                    <p>Star Blog © 2023 - All rights reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;