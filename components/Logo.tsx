
import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';

export const Logo = ({ className = "h-10" }: { className?: string }) => {
  // Try to get cached logo URL from localStorage for immediate first render
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ephinance_cached_logo_url');
    }
    return null;
  });

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const settings = await dataService.getSettings();
        if (settings.logoUrl) {
          setLogoUrl(settings.logoUrl);
          // Update cache for next time
          localStorage.setItem('ephinance_cached_logo_url', settings.logoUrl);
        } else {
          setLogoUrl(null);
          localStorage.removeItem('ephinance_cached_logo_url');
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt="Logo" 
        className={`${className} transition-opacity duration-300`} 
        // We can add a simple fade-in if it's still too jarring, 
        // but localStorage should solve the "wrong logo" or "empty space" flicker on refresh.
      />
    );
  }

  // Return a placeholder div with the same dimensions to prevent layout shift if possible
  // or just null if the user wants it blank by default.
  return <div className={className} />;
};
