
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from './Logo';

const Navbar = () => {
  const navItems = [
    { label: 'ABOUT', path: '/about' },
    { label: 'CURRICULUM', path: '/curriculum' },
    { label: 'PEOPLE', path: '/people' },
    { label: 'RECRUIT', path: '/recruit' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Logo className="h-8 w-auto" />
          <span className="text-lg font-bold tracking-tighter text-brand-charcoal">
            E.Phinance
          </span>
        </Link>
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-[9px] font-bold tracking-[0.2em] transition-all duration-300 ${
                  isActive ? 'text-brand-orange' : 'text-neutral-400 hover:text-brand-charcoal'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-brand-charcoal text-neutral-400 py-20 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h3 className="text-white text-lg font-bold tracking-tighter mb-4">E.Phinance</h3>
        <p className="text-xs leading-relaxed max-w-sm opacity-60 font-light">
          Biotech & Finance Structure Research Group.<br />
          Ewha Womans University College of Pharmacy.
        </p>
      </div>
      <div className="text-right flex flex-col justify-end space-y-2">
        <p className="text-[10px] tracking-[0.3em] uppercase text-white font-medium opacity-80">Decoding Biotech Value</p>
        <p className="text-[9px] opacity-30 tracking-widest font-mono">EST. 2025 | EWHA WOMANS UNIVERSITY</p>
        <Link to="/admin" className="text-[8px] opacity-20 hover:opacity-100 transition-opacity tracking-widest uppercase mt-4">Admin Access</Link>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};
