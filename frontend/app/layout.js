'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import SpinningGlobe from '../components/SpinningGlobe';
import styles from './layout.module.css';
import './globals.css';

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <html lang="en">
      <head>
        <title>Dhara Sanket AI — Protecting Land, Enabling Trust</title>
        <meta name="description" content="AI-powered land acquisition risk monitoring platform for Smart India Hackathon project SIH26017. Monitor land records, detect risks, and ensure transparent land governance across Madhya Pradesh." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {isLanding ? (
          <div className={styles.landingShell}>
            {children}
          </div>
        ) : (
          <div className={styles.shell}>
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <div className={styles.main}>
              <SpinningGlobe />
              <Topbar
                pathname={pathname}
                onMenuToggle={() => setSidebarOpen((v) => !v)}
              />
              <main className={styles.content}>
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
