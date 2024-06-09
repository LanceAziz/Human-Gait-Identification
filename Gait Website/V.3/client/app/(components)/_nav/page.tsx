'use client';
import Image from "next/image";
import logo from "@/public/Pictures/logo-01.png"
import styles from "./Nav.module.css"
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'


function Nav() {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Predict', href: '/predict' },
        { name: 'Logs', href: '/logs' },
        { name: 'Guide', href: '/guide' }
    ];
    const pathname = usePathname();
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);
    return (
        <>
            <nav className={`navbar navbar-expand-lg g-0 fixed-top bg-black rounded rounded-top-0 rounded-bottom-5 py-2 px-5 ${styles.gaitShadow}`}>
                <div className="col-lg-2 d-flex justify-content-center align-items-center py-3">
                    <Link href="./"><Image src={logo} width="150" alt="Gait Logo" /></Link>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <input type="checkbox" id="checkbox" className={styles.checkbox} />
                    <label htmlFor="checkbox" className={`${styles.toggle}`}>
                        <div className={`${styles.bars}`} id="bar1"></div>
                        <div className={`${styles.bars}`} id="bar2"></div>
                        <div className={`${styles.bars}`} id="bar3"></div>
                    </label>
                </button>
                <div className="collapse navbar-collapse row g-0 col-lg-10 py-2" id="navbarSupportedContent">
                    {navLinks.map((link) => {
                        const isActive = pathname.endsWith(link.href)
                        return (
                            <div className="col-lg-3 px-3 py-1">
                                <Link className={`gait-btn fs-3 text-center py-3 ${isActive ? 'gait-btn-selected' : ''}`} href={link.href}>{link.name}</Link>
                            </div>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

export default Nav