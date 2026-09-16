'use client';

import styles from './Topbar.module.css';

const pageTitles = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/active-projects': 'Active Projects',
  '/high-risk': 'High Risk Projects',
  '/gis-map': 'GIS Map',
  '/reports': 'Reports',
};

export default function Topbar({ pathname, onMenuToggle }) {
  const title = pageTitles[pathname] || 'Dashboard';

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.right}>
        {/* TODO: Connect global search to FastAPI backend — add onChange handler to
            filter projects/parcels across all pages, and display results in a
            dropdown overlay. Currently this input is purely visual. */}
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#94a3b8" strokeWidth="1.8" />
            <path d="M11 11l3.5 3.5" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search projects, parcels..."
            className={styles.searchInput}
          />
        </div>

        {/* TODO: Add onClick handler to open a notifications dropdown/panel.
            Fetch unread alerts from FastAPI backend and display count on the
            badge. Mark alerts as read when the panel is opened. */}
        <button className={styles.iconBtn} aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2a5 5 0 00-5 5v3l-1.5 2.5a.5.5 0 00.43.75h12.14a.5.5 0 00.43-.75L15 10V7a5 5 0 00-5-5z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path d="M8 14a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className={styles.badge} />
        </button>

        {/* TODO: Add onClick handler to open a user profile dropdown with
            options: Profile Settings, Account, Logout. Fetch the logged-in
            user's name/initials from auth context or FastAPI backend. */}
        <div className={styles.avatar}>
          <span>AS</span>
        </div>
      </div>
    </header>
  );
}
