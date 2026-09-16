'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Sidebar.module.css';

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8.5L10 3L17 8.5V17C17 17.55 16.55 18 16 18H4C3.45 18 3 17.55 3 17V8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 18V11H13V18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: 'Active Projects',
    href: '/active-projects',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4h14M3 8h14M3 12h10M3 16h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'High Risk Projects',
    href: '/high-risk',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 8v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="14.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'GIS Map',
    href: '/gis-map',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 5l5-2 6 3 5-2v12l-5 2-6-3-5 2V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 3v12M13 6v12" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 3L35 12V28L20 37L5 28V12L20 3Z"
                fill="#059669"
                fillOpacity="0.15"
                stroke="#059669"
                strokeWidth="2"
              />
              <path
                d="M20 10L28 15V25L20 30L12 25V15L20 10Z"
                fill="#059669"
                fillOpacity="0.3"
                stroke="#059669"
                strokeWidth="1.5"
              />
              <circle cx="20" cy="20" r="4" fill="#059669" />
              <path d="M20 16v-3M20 27v-3M24 20h3M13 20h3" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.brandName}>Dhara Sanket AI</h1>
            <p className={styles.tagline}>Protecting Land, Enabling Trust</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={onClose}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          {/* TODO: Add onClick handler to open an About/SIH project info modal
              or link to the Smart India Hackathon project page (SIH26017). */}
          <div className={styles.footerCard}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="#059669" strokeWidth="1.5" />
              <path d="M9 6v3l2 2" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>SIH 2026 Project</span>
          </div>
        </div>
      </aside>
    </>
  );
}
