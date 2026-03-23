import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import {
  RiDashboardLine, RiAddCircleLine, RiBookOpenLine,
  RiBarChartLine, RiHistoryLine, RiUserLine, RiMenuLine, RiCloseLine
} from 'react-icons/ri';

const navLinks = [
  { path: '/',         label: 'Dashboard',  icon: RiDashboardLine },
  { path: '/tracker',  label: 'Log Workout', icon: RiAddCircleLine },
  { path: '/library',  label: 'Exercises',  icon: RiBookOpenLine },
  { path: '/progress', label: 'Progress',   icon: RiBarChartLine },
  { path: '/history',  label: 'History',    icon: RiHistoryLine },
  { path: '/profile',  label: 'Profile',    icon: RiUserLine },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useWorkout();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(15,15,15,0.96)' : 'rgba(15,15,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(93,214,44,0.15)' : '#1e1e1e'}`,
        transition: 'all 0.3s ease',
        height: '70px',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="container-ft" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 800, color: '#000',
              fontFamily: 'var(--font-display)', letterSpacing: '0.05em',
            }}>FT</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)', letterSpacing: '0.1em' }}>
              FIT<span style={{ color: 'var(--primary)' }}>TRACK</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const active = pathname === path;
              return (
                <Link key={path} to={path} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '8px',
                  textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                  color: active ? '#000' : 'var(--text2)',
                  background: active ? 'var(--primary)' : 'transparent',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-body)',
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* User Avatar */}
          <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-nav">
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--primary-glow)',
              border: '2px solid var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)',
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </Link>

          {/* Mobile Hamburger */}
          <button onClick={() => setOpen(!open)} className="mobile-menu-btn btn-icon-ft" style={{ display: 'none' }}>
            {open ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div style={{
          position: 'fixed', top: '70px', left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', zIndex: 999,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }} onClick={() => setOpen(false)}>
          <div style={{
            background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
            padding: '16px',
            animation: 'fadeInUp 0.25s ease',
          }} onClick={e => e.stopPropagation()}>
            {navLinks.map(({ path, label, icon: Icon }) => {
              const active = pathname === path;
              return (
                <Link key={path} to={path} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px', borderRadius: '10px',
                  textDecoration: 'none', fontSize: '1rem', fontWeight: 600,
                  color: active ? '#000' : 'var(--text)',
                  background: active ? 'var(--primary)' : 'transparent',
                  marginBottom: '4px',
                  fontFamily: 'var(--font-body)',
                }}>
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}