'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, LogOut, LayoutDashboard, Wallet, Gift, History, Coins, Sparkles, ShieldCheck, PlusCircle, Copy, Check } from 'lucide-react';

interface CountUpProps {
  target: string;
  suffix: string;
  duration?: number;
  decimals?: boolean;
}

function CountUp({ target, suffix, duration = 2000, decimals = false }: CountUpProps) {
  const [count, setCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const end = parseFloat(target);
    const steps = decimals ? 50 : end;
    const stepValue = end / steps;
    let currentStep = 0;

    const incrementTime = Math.max(Math.floor(duration / steps), 15);

    const timer = setInterval(() => {
      currentStep += 1;
      const nextValue = currentStep * stepValue;

      if (currentStep >= steps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(nextValue);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isVisible, target, duration, decimals]);

  return (
    <span ref={elementRef}>
      {decimals ? count.toFixed(1) : Math.round(count)}
      {suffix}
    </span>
  );
}

interface UserObj {
  name: string;
  email: string;
}

export default function IcoLand() {
  // Setup target date (e.g., 12 days, 7 hours, 21 minutes, 55 seconds from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 7,
    minutes: 21,
    seconds: 55,
  });

  // Music platform section timer (30 days, 5 hours, 11 minutes, 4 seconds from now)
  const [musicTimeLeft, setMusicTimeLeft] = useState({
    days: 30,
    hours: 5,
    minutes: 11,
    seconds: 4,
  });

  useEffect(() => {
    let totalSeconds =
      timeLeft.days * 24 * 60 * 60 +
      timeLeft.hours * 60 * 60 +
      timeLeft.minutes * 60 +
      timeLeft.seconds;

    const interval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds -= 1;

        const d = Math.floor(totalSeconds / (24 * 60 * 60));
        const h = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const m = Math.floor((totalSeconds % (60 * 60)) / 60);
        const s = totalSeconds % 60;

        setTimeLeft({
          days: d,
          hours: h,
          minutes: m,
          seconds: s,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let totalMusicSecs =
      musicTimeLeft.days * 24 * 60 * 60 +
      musicTimeLeft.hours * 60 * 60 +
      musicTimeLeft.minutes * 60 +
      musicTimeLeft.seconds;

    const musicInterval = setInterval(() => {
      if (totalMusicSecs > 0) {
        totalMusicSecs -= 1;

        const d = Math.floor(totalMusicSecs / (24 * 60 * 60));
        const h = Math.floor((totalMusicSecs % (24 * 60 * 60)) / (60 * 60));
        const m = Math.floor((totalMusicSecs % (60 * 60)) / 60);
        const s = totalMusicSecs % 60;

        setMusicTimeLeft({
          days: d,
          hours: h,
          minutes: m,
          seconds: s,
        });
      }
    }, 1000);

    return () => clearInterval(musicInterval);
  }, []);

  const [activeSection, setActiveSection] = useState<string>('why-ico');
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<string>('login');
  const [loggedInUser, setLoggedInUser] = useState<UserObj | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [dashTab, setDashTab] = useState<'wallet' | 'rewards' | 'earnings' | 'presale' | 'ico'>('wallet');
  const [isWalletCreated, setIsWalletCreated] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('0x71C4...49A2');
  const [copiedContract, setCopiedContract] = useState<boolean>(false);
  const [claimedReward, setClaimedReward] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('dashboard') === 'true' || urlParams.get('login') === 'success') {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setLoggedInUser(JSON.parse(savedUser));
          setIsDashboardOpen(true);
        }
      }
    }
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let key = id.replace('modal-', '');
    // Convert kebab-case to camelCase (e.g., "confirm-password" → "confirmPassword")
    key = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!isLoginOpen) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [isLoginOpen]);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsLoginOpen(true);
  };
  const approvals = [
    "WHAT IS APPROVING",
    "DECENTRALIZED RIGHTS",
    "SECURED CONTRACTS",
    "CREATOR INCENTIVES"
  ];
  const [approvalIndex, setApprovalIndex] = useState<number>(0);
  const isScrollingRef = useRef<boolean>(false);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    isScrollingRef.current = true;

    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    const sections = document.querySelectorAll('section, main');

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      const scrollPosition = window.scrollY + 180; // offset for sticky header height

      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        const sectionTop = htmlSection.offsetTop;
        const sectionHeight = htmlSection.offsetHeight;
        const sectionId = htmlSection.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format number to have leading zero
  const formatNum = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="app-container">
      {/* Visual Ambient Glows */}
      <div className="glow-spot glow-blue"></div>
      <div className="glow-spot glow-purple"></div>
      <div className="glow-spot glow-pink"></div>

      {/* Animated Network Wave */}
      <div className="network-wave"></div>

      {/* Mobile Menu Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Header */}
      <header className={`header ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
        <a href="#why-ico" className="logo" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
          {/* Hexagonal glowing logo icon */}
          <span className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" fill="url(#logo-grad)" stroke="#ff2c8c" strokeWidth="2" />
              <circle cx="16" cy="16" r="6" fill="#ffffff" />
              <defs>
                <linearGradient id="logo-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3283ff" />
                  <stop offset="1" stopColor="#ff2c8c" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="logo-text">ICOLand</span>
        </a>

        <nav className={`nav-container ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li><a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={() => handleNavClick('about')}>About</a></li>
            {/* <li><a href="#why-ico" className={activeSection === 'why-ico' ? 'active' : ''} onClick={() => handleNavClick('why-ico')}>Why ICO</a></li> */}
            <li><a href="#how-it-works" className={activeSection === 'how-it-works' ? 'active' : ''} onClick={() => handleNavClick('how-it-works')}>How It Works</a></li>
            <li><a href="#sales" className={activeSection === 'sales' ? 'active' : ''} onClick={() => handleNavClick('sales')}>Sales</a></li>
            <li><a href="#roadmap" className={activeSection === 'roadmap' ? 'active' : ''} onClick={() => handleNavClick('roadmap')}>Roadmap</a></li>
            <li><a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={() => handleNavClick('contact')}>Contact</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          {loggedInUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                href="/dashboard"
                className="header-dashboard-btn"
                style={{ textDecoration: 'none' }}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <Link href="/dashboard" className="user-pill" style={{ textDecoration: 'none' }}>
                <div className="user-avatar">
                  {loggedInUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{loggedInUser.name}</span>
                <button
                  className="logout-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsLogoutModalOpen(true);
                  }}
                  title="Logout"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </Link>
            </div>
          ) : (
            <Link href="/login" className="login-btn" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>LOGIN</Link>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Page content wrapper */}
      <div className={`page-content-wrapper ${isLoginOpen ? 'auth-open' : ''}`}>

        {/* Hero Section */}
        <main id="why-ico" className="hero-section">

          {/* Left Side Info */}
          <div className="hero-left">
            <div className="badge">
              <span className="badge-tag">ICO LIVE</span>
              <span className="badge-text">$1 = 1 PTG · 500M Total Supply</span>
            </div>

            <h1 className="hero-title">
              PTG Coin — The Future Of<br />
              Decentralized Investment.
            </h1>

            <p className="hero-desc">
              Buy PTG with USDT on BNB Chain. Stake for 13 months. Earn 20% staking bonus, 5% referral bonus, and advisory rewards for your sponsor.
            </p>

            <button className="cta-btn" onClick={() => openAuthModal('register')}>
              JOIN TGT ICO - BUY NOW
              <span className="arrow-circle">
                <Play size={12} fill="#ff2c8c" stroke="#ff2c8c" style={{ marginLeft: '2px', transform: 'rotate(0deg)' }} />
              </span>
            </button>
          </div>

          {/* Right Side Card (Sale Ends In / Stats) */}
          <div className="sale-card">
            <h2 className="card-title">Token Sale End In</h2>

            {/* Countdown Clock */}
            <div className="countdown-container">
              <div className="countdown-box">
                <span className="countdown-num">{formatNum(timeLeft.days)}</span>
                <span className="countdown-label">Days</span>
              </div>
              <span className="countdown-separator">:</span>

              <div className="countdown-box">
                <span className="countdown-num">{formatNum(timeLeft.hours)}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <span className="countdown-separator">:</span>

              <div className="countdown-box">
                <span className="countdown-num">{formatNum(timeLeft.minutes)}</span>
                <span className="countdown-label">Mins</span>
              </div>
              <span className="countdown-separator">:</span>

              <div className="countdown-box">
                <span className="countdown-num">{formatNum(timeLeft.seconds)}</span>
                <span className="countdown-label">Secs</span>
              </div>
            </div>

            {/* Raised Details */}
            <div className="info-row">
              <span className="raised-txt">Raised - <span>1,450 Tokens</span></span>
              <span className="target-txt">Target - <span>150,000 Tokens</span></span>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-bar-fill" style={{ width: '40%' }}>
                <span className="progress-badge">60,490</span>
              </div>
            </div>

            {/* Progress Caps */}
            <div className="caps-row">
              <span>Soft cap</span>
              <span>Crowdsale</span>
              <span>Hard cap</span>
            </div>

            {/* Centered BUY NOW Action */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1.2rem 0 0.5rem 0' }}>
              <button
                className="cta-btn"
                onClick={() => openAuthModal('register')}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.95rem 1.5rem',
                  fontSize: '0.92rem'
                }}
              >
                JOIN TGT ICO - BUY NOW
                <span className="arrow-circle">
                  <Play size={12} fill="#ff2c8c" stroke="#ff2c8c" style={{ marginLeft: '2px' }} />
                </span>
              </button>
            </div>

            {/* Payment Icons */}
            <div className="card-footer">
              {/* Bitcoin */}
              <svg className="crypto-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.638 14.904c-1.032 4.145-5.248 6.69-9.392 5.658L13.14 24l-2.022-.505.772-3.094c-.53-.135-1.077-.27-1.616-.407l-.775 3.102-2.023-.505.823-3.298c-.44-.132-.872-.262-1.297-.4l-.004.015-2.788-.696.535-2.147s1.5.115 1.468.106c.82.204 1.218-.18 1.402-.622l1.637-6.564c.058-.02.135-.05.218-.08l-.219.082c-.145.053-.338.163-.443.435L6.377 15.22c.033.023-1.467-.366-1.467-.366l-.282-2.28 1.848.46c.343.086.68-.027.818-.282l1.196-4.792c.112-.284-.007-.514-.265-.607l-.022-.008-1.85-.462L9.088 4.34l.775-3.104 2.022.505-.75 3.013c.55.14.108.27.653.402l.758-3.037 2.022.505-.776 3.11c3.153.6 5.3 2.146 4.757 5.437-.436 2.652-2.023 3.65-3.957 3.864.877.375 1.54 1.05 1.69 2.274zM12.9 8.276c.456-.114.738.21.848.513l1.118-4.48c-.11-.3-.393-.637-.85-.523l-1.692.423 1.058 4.244c.484-.122 1.4-.3 1.956-.443zm1.61 6.452c.504-.126.892.25.993.578l1.23-4.93c-.1-.328-.484-.664-.99-.538l-1.955.488.994 3.987 1.996-.5c.506-.127 1-.25 1.767-.442z" />
              </svg>
              {/* Binance */}
              <svg className="crypto-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.624 13.9202l2.7175 2.7154-7.34 7.34-7.34-7.34 2.7175-2.7154 4.6225 4.6225zm5.405-3.9212l1.97 1.97-1.97 1.97-1.97-1.97zm-10.027-9.999l7.34 7.34-2.7175 2.7154-4.6225-4.6225-4.6225 4.6225-2.7175-2.7154zm-10.029 9.999l1.97-1.97 1.97 1.97-1.97 1.97zM12.002 8.6602l3.34 3.34-3.34 3.34-3.34-3.34z" />
              </svg>
              {/* Paypal */}
              <svg className="crypto-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.09 6.85c-.45 3.56-2.79 5.56-5.87 5.56h-2.12c-.52 0-.96.38-1.04.9l-1.39 8.82c-.04.28.18.53.47.53h3.58c.47 0 .87-.34.95-.8l1.04-6.6c.07-.46.48-.8 1-.8h.74c3.06 0 5.45-1.24 6.14-4.88.33-1.7.13-3.08-.73-4.04-.67-.74-1.8-1.12-3.35-1.12h-.82c.44.83.6 1.76.4 2.93zM16.5 1.5H9.2c-.47 0-.87.34-.95.8L5.05 16.22c-.04.28.18.53.47.53h3.79l1.52-9.66c.07-.46.48-.8 1-.8h3.6c2.72 0 4.82-.98 5.48-4.2C21.43 1.75 19.38 1.5 16.5 1.5z" />
              </svg>
              {/* Ethereum / Cardano placeholder style */}
              <svg className="crypto-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

        </main>

        {/* Bottom Slider Nav Indicators */}
        <div className="slider-controls">
          <button className="nav-arrow" aria-label="Previous slide">
            <ChevronLeft size={20} />
          </button>
          <button className="nav-arrow" aria-label="Next slide">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="about-container">

            {/* Left Side: Businessman & charts illustration */}
            <div className="about-left">
              <div className="illustration-wrapper">
                <svg viewBox="0 0 500 400" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background grid dots */}
                  <circle cx="100" cy="100" r="2" fill="#ff2c8c" opacity="0.3" />
                  <circle cx="140" cy="100" r="2" fill="#ff2c8c" opacity="0.3" />
                  <circle cx="180" cy="100" r="2" fill="#ff2c8c" opacity="0.3" />
                  <circle cx="100" cy="140" r="2" fill="#ff2c8c" opacity="0.3" />
                  <circle cx="140" cy="140" r="2" fill="#ff2c8c" opacity="0.3" />
                  <circle cx="180" cy="140" r="2" fill="#ff2c8c" opacity="0.3" />
                  <circle cx="100" cy="180" r="2" fill="#ff2c8c" opacity="0.3" />
                  <circle cx="140" cy="180" r="2" fill="#ff2c8c" opacity="0.3" />
                  <circle cx="180" cy="180" r="2" fill="#ff2c8c" opacity="0.3" />

                  {/* Glowing neon shapes */}
                  <circle cx="315" cy="200" r="70" stroke="url(#circle-grad)" strokeWidth="1.5" strokeDasharray="10 8" opacity="0.4" />
                  <circle cx="315" cy="200" r="45" stroke="url(#circle-grad)" strokeWidth="3" strokeDasharray="5 5" />

                  {/* Abstract bars/graphs */}
                  <rect x="60" y="240" width="14" height="100" rx="3" fill="url(#bar-grad-1)" />
                  <rect x="85" y="190" width="14" height="150" rx="3" fill="url(#bar-grad-2)" />
                  <rect x="110" y="270" width="14" height="70" rx="3" fill="url(#bar-grad-1)" />
                  <rect x="135" y="150" width="14" height="190" rx="3" fill="url(#bar-grad-2)" />
                  <rect x="160" y="210" width="14" height="130" rx="3" fill="url(#bar-grad-1)" />

                  {/* Businessman representation */}
                  <g transform="translate(250, 110)">
                    {/* Body suit */}
                    <path d="M45 100 L15 240 L115 240 L85 100 Z" fill="url(#suit-grad)" />
                    {/* Shirt / Tie */}
                    <path d="M54 100 L76 100 L70 145 L60 145 Z" fill="#ffffff" />
                    <path d="M62 100 L68 100 L65 160 Z" fill="#ff2c8c" />
                    {/* Head */}
                    <circle cx="65" cy="65" r="20" fill="#e0d4f7" />
                    {/* Folded arms */}
                    <path d="M22 140 Q65 175 108 140" stroke="#3283ff" strokeWidth="14" strokeLinecap="round" fill="none" />
                    <path d="M28 145 Q65 180 102 145" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
                  </g>

                  <defs>
                    <linearGradient id="bar-grad-1" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#ff2c8c" stopOpacity="0.85" />
                      <stop offset="1" stopColor="#ff2c8c" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="bar-grad-2" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#3283ff" stopOpacity="0.85" />
                      <stop offset="1" stopColor="#3283ff" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="suit-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#1e0b4a" />
                      <stop offset="1" stopColor="#3d1e8c" />
                    </linearGradient>
                    <linearGradient id="circle-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#3283ff" />
                      <stop offset="1" stopColor="#ff2c8c" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Right Side: Text content */}
            <div className="about-right">
              <h2 className="about-title">What Is ICO?</h2>
              <p className="about-subtitle">
                The world first platform to reward investors and traders build on ICO
              </p>

              <div className="about-list">
                <div className="about-item">
                  <div className="about-icon-wrapper">
                    <div className="about-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="about-item-text">
                    <h3>Decentralized Platform</h3>
                    <p>The platform helps investors to make easy to purchase and sell their tokens</p>
                  </div>
                </div>

                <div className="about-item">
                  <div className="about-icon-wrapper">
                    <div className="about-icon pink-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="about-item-text">
                    <h3>Secure Investment</h3>
                    <p>Every transaction is locked within transparent blockchain ledger nodes</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PTG How It Works Section */}
        <section id="how-it-works" style={{
          background: 'linear-gradient(180deg, #0a0415 0%, #06020f 100%)',
          padding: '5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative glows */}
          <div style={{ position: 'absolute', top: '-100px', left: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(50,131,255,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-80px', right: '8%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,44,140,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Section Heading */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ background: 'linear-gradient(90deg,#3283ff,#ff2c8c)', borderRadius: '20px', padding: '6px 20px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', color: '#fff', textTransform: 'uppercase', display: 'inline-block', marginBottom: '1.2rem' }}>
                PTG COIN · ICO
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: '0 0 1rem' }}>
                How <span style={{ background: 'linear-gradient(90deg,#3283ff,#ff2c8c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PTG Coin</span> Works
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
                500 Million PTG total supply. Buy with USDT on BNB Chain, stake for 13 months, earn rewards and grow your network.
              </p>
            </div>

            {/* Step-by-step Flow */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>

              {/* Step 1 */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(50,131,255,0.2)', borderRadius: '20px', padding: '2rem 1.5rem', position: 'relative', backdropFilter: 'blur(10px)', transition: 'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#3283ff,#6a3bff)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', fontSize: '1.4rem' }}>💳</div>
                <span style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(50,131,255,0.15)', color: '#3283ff', borderRadius: '8px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>STEP 1</span>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Deposit USDT</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  Send USDT to the owner-provided cold wallet address on the <strong style={{ color: '#F0B90B' }}>BNB Chain</strong>. Only the official wallet address is accepted — no other chain or token.
                </p>
              </div>

              {/* Step 2 */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,44,140,0.2)', borderRadius: '20px', padding: '2rem 1.5rem', position: 'relative', backdropFilter: 'blur(10px)', transition: 'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#ff2c8c,#ff6b2c)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', fontSize: '1.4rem' }}>🔄</div>
                <span style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,44,140,0.15)', color: '#ff2c8c', borderRadius: '8px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>STEP 2</span>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Receive PTG Tokens</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  At a rate of <strong style={{ color: '#fff' }}>$1 = 1 PTG</strong>, your USDT is converted into PTG coins and credited to your account. Total supply is limited to <strong style={{ color: '#fff' }}>500,000,000 PTG</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,43,255,0.2)', borderRadius: '20px', padding: '2rem 1.5rem', position: 'relative', backdropFilter: 'blur(10px)', transition: 'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#8b2bff,#3283ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', fontSize: '1.4rem' }}>🔒</div>
                <span style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(139,43,255,0.15)', color: '#8b2bff', borderRadius: '8px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>STEP 3</span>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Stake / Hold for 13 Months</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  Users must <strong style={{ color: '#fff' }}>stake or hold their PTG for 13 months</strong>. During this period your tokens grow and generate advisory bonuses for your sponsor.
                </p>
              </div>

              {/* Step 4 */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,220,130,0.2)', borderRadius: '20px', padding: '2rem 1.5rem', position: 'relative', backdropFilter: 'blur(10px)', transition: 'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#00dc82,#00b4d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', fontSize: '1.4rem' }}>🎁</div>
                <span style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(0,220,130,0.12)', color: '#00dc82', borderRadius: '8px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>STEP 4</span>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Earn Bonuses & Rewards</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  After your staking period, your sponsor earns an <strong style={{ color: '#fff' }}>Advisory Bonus</strong>. You earn staking rewards automatically credited to your account.
                </p>
              </div>

            </div>

            {/* Bonus Structure */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2.5rem', marginBottom: '3rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>
                PTG Coin — <span style={{ background: 'linear-gradient(90deg,#FFD700,#ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bonus Structure</span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Earn multiple income streams as you grow your network</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>

                {/* Referral Bonus */}
                <div style={{ background: 'linear-gradient(135deg, rgba(50,131,255,0.12), rgba(50,131,255,0.04))', border: '1px solid rgba(50,131,255,0.25)', borderRadius: '18px', padding: '1.8rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>👥</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(90deg,#3283ff,#6a3bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>5%</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: '0.5rem 0 0.3rem' }}>Referral Bonus</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>Earn 5% when someone joins using your referral code and purchases PTG</div>
                </div>

                {/* Joining Bonus */}
                <div style={{ background: 'linear-gradient(135deg, rgba(255,44,140,0.12), rgba(255,44,140,0.04))', border: '1px solid rgba(255,44,140,0.25)', borderRadius: '18px', padding: '1.8rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>🎉</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(90deg,#ff2c8c,#ff6b2c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>5%</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: '0.5rem 0 0.3rem' }}>Joining Bonus</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>New members receive a 5% bonus on their first token purchase — instantly credited</div>
                </div>

                {/* Staking Bonus */}
                <div style={{ background: 'linear-gradient(135deg, rgba(0,220,130,0.12), rgba(0,220,130,0.04))', border: '1px solid rgba(0,220,130,0.25)', borderRadius: '18px', padding: '1.8rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>📈</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(90deg,#00dc82,#00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>20%</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: '0.5rem 0 0.3rem' }}>Staking Bonus</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>Stake PTG for 13 months and earn a 20% reward on your staked balance — advisory bonus included</div>
                </div>

              </div>
            </div>

            {/* Dashboard Features */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                📊 Your Personal Dashboard
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '2rem', fontSize: '0.88rem' }}>Everything you need to track your PTG portfolio in one place</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>

                {/* Sponsor Team */}
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', background: 'rgba(50,131,255,0.07)', borderRadius: '14px', padding: '1.2rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(50,131,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>👑</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Sponsor Team</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>View your full referral tree: SR No, Username, User ID, Staked PTG, Sponsor Bonus %, Date & Time</div>
                  </div>
                </div>

                {/* Staking History */}
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', background: 'rgba(139,43,255,0.07)', borderRadius: '14px', padding: '1.2rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139,43,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>🔒</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Staking History</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>Track all your PTG stakes — amounts, duration, status, and rewards earned on each stake</div>
                  </div>
                </div>

                {/* Deposit History */}
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', background: 'rgba(0,220,130,0.07)', borderRadius: '14px', padding: '1.2rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0,220,130,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>💰</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Deposit History</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>Complete log of all your USDT deposits: amounts, dates, transaction status and PTG received</div>
                  </div>
                </div>

                {/* Advisory Bonus */}
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', background: 'rgba(255,165,0,0.07)', borderRadius: '14px', padding: '1.2rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,165,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>⭐</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Advisory Bonus</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>After team members' staking period completes, sponsors receive their advisory commission automatically</div>
                  </div>
                </div>

              </div>

              {/* Token Info Strip */}
              <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                {[
                  { label: 'Token', value: 'PTG Coin', color: '#3283ff' },
                  { label: 'Total Supply', value: '500,000,000', color: '#ff2c8c' },
                  { label: 'Price', value: '$1 = 1 PTG', color: '#00dc82' },
                  { label: 'Network', value: 'BNB Chain', color: '#F0B90B' },
                  { label: 'Payment', value: 'USDT Only', color: '#8b2bff' },
                  { label: 'Lock Period', value: '13 Months', color: '#ff6b2c' },
                ].map(item => (
                  <div key={item.label} style={{ background: `rgba(${item.color === '#3283ff' ? '50,131,255' : item.color === '#ff2c8c' ? '255,44,140' : item.color === '#00dc82' ? '0,220,130' : item.color === '#F0B90B' ? '240,185,11' : item.color === '#8b2bff' ? '139,43,255' : '255,107,44'},0.1)`, border: `1px solid ${item.color}33`, borderRadius: '12px', padding: '0.7rem 1.2rem', textAlign: 'center', minWidth: '120px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ color: item.color, fontWeight: 800, fontSize: '0.95rem' }}>{item.value}</div>
                  </div>
                ))}
              </div>

            </div>


          </div>
        </section>

        {/* Sales Section */}
        <section id="sales" className="sales-section">
          <div className="sales-stars-bg"></div>

          <div className="sales-header">
            <h2 className="section-title-center">Trading Strategies</h2>
            <p className="section-desc-center">
              PTG Coin is a public blockchain protocol on BNB Chain. Buy USDT, convert to PTG, stake for 13 months and earn up to 20% staking bonus plus referral rewards.
            </p>
            <button className="buy-token-btn" onClick={() => openAuthModal('register')}>BUY PTG TOKEN NOW</button>
          </div>

          {/* Horizontal Banner Card */}
          <div className="token-info-banner">
            <div className="banner-left">
              <h3>500,000,000 PTG To Be Sold!</h3>
              <p>Rate: $1 = 1 PTG. Payment in USDT only on BNB Chain to the owner's cold wallet address. Stake for 13 months and earn 20% staking bonus.</p>
            </div>

            <div className="banner-right">
              <div className="timer-square">
                <span className="timer-sq-num">200</span>
                <span className="timer-sq-lbl">Days</span>
              </div>
              <div className="timer-square">
                <span className="timer-sq-num">16</span>
                <span className="timer-sq-lbl">Hours</span>
              </div>
              <div className="timer-square">
                <span className="timer-sq-num">24</span>
                <span className="timer-sq-lbl">Minutes</span>
              </div>
              <div className="timer-square">
                <span className="timer-sq-num">32</span>
                <span className="timer-sq-lbl">Seconds</span>
              </div>
            </div>
          </div>

          {/* Planet Horizon & Features Area */}
          <div className="planet-features-area">
            <div className="planet-curve"></div>

            <div className="floating-features">
              <div className="feat-circle blue-glow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2b87ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div className="feat-circle pink-glow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff2c8c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                  <path d="M1 20h22"></path>
                </svg>
              </div>
              <div className="feat-circle purple-glow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b2bff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Info Title */}
          <div className="sales-bottom">
            <h2 className="section-title-center">What Is ICO Crypto-Currencies?</h2>
            <p className="section-desc-center">The world first platform to reward investors and traders build on ICO.</p>
            <div className="slider-controls" style={{ marginTop: '2.5rem' }}>
              <button className="nav-arrow" aria-label="Previous slide">
                <ChevronLeft size={20} />
              </button>
              <button className="nav-arrow" aria-label="Next slide">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Approving/NFT mascot Section */}
        <section id="roadmap" className="approving-section">

          {/* Horizontal Stats Banner */}
          <div className="horizontal-stats-banner">
            {/* Timer portion */}
            <div className="stats-timer">
              <div className="stats-timer-sq">
                <span className="stats-timer-num">{formatNum(timeLeft.days)}</span>
                <span className="stats-timer-lbl">Days</span>
              </div>
              <div className="stats-timer-sq">
                <span className="stats-timer-num">{formatNum(timeLeft.hours)}</span>
                <span className="stats-timer-lbl">Hours</span>
              </div>
              <div className="stats-timer-sq">
                <span className="stats-timer-num">{formatNum(timeLeft.minutes)}</span>
                <span className="stats-timer-lbl">Minutes</span>
              </div>
              <div className="stats-timer-sq">
                <span className="stats-timer-num">{formatNum(timeLeft.seconds)}</span>
                <span className="stats-timer-lbl">Seconds</span>
              </div>
            </div>

            {/* Progress Portion */}
            <div className="stats-progress-container">
              <div className="stats-info-row">
                <span className="stats-raised">Raised - <span>1,450 Tokens</span></span>
                <span className="stats-target">Target - <span>150,000 Tokens</span></span>
              </div>
              <div className="stats-progress-bar">
                <div className="stats-progress-fill" style={{ width: '40%' }}>
                  <span className="stats-progress-badge">60,490</span>
                </div>
              </div>
              <div className="stats-caps-row">
                <span>Soft cap</span>
                <span>Crowdsale</span>
                <span>Hard cap</span>
              </div>
            </div>

            {/* Crypto Icons */}
            <div className="stats-crypto-icons">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.638 14.904c-1.032 4.145-5.248 6.69-9.392 5.658L13.14 24l-2.022-.505.772-3.094c-.53-.135-1.077-.27-1.616-.407l-.775 3.102-2.023-.505.823-3.298c-.44-.132-.872-.262-1.297-.4l-.004.015-2.788-.696.535-2.147s1.5.115 1.468.106c.82.204 1.218-.18 1.402-.622l1.637-6.564c.058-.02.135-.05.218-.08l-.219.082c-.145.053-.338.163-.443.435L6.377 15.22c.033.023-1.467-.366-1.467-.366l-.282-2.28 1.848.46c.343.086.68-.027.818-.282l1.196-4.792c.112-.284-.007-.514-.265-.607l-.022-.008-1.85-.462L9.088 4.34l.775-3.104 2.022.505-.75 3.013c.55.14.108.27.653.402l.758-3.037 2.022.505-.776 3.11c3.153.6 5.3 2.146 4.757 5.437-.436 2.652-2.023 3.65-3.957 3.864.877.375 1.54 1.05 1.69 2.274zM12.9 8.276c.456-.114.738.21.848.513l1.118-4.48c-.11-.3-.393-.637-.85-.523l-1.692.423 1.058 4.244c.484-.122 1.4-.3 1.956-.443zm1.61 6.452c.504-.126.892.25.993.578l1.23-4.93c-.1-.328-.484-.664-.99-.538l-1.955.488.994 3.987 1.996-.5c.506-.127 1-.25 1.767-.442z" />
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.624 13.9202l2.7175 2.7154-7.34 7.34-7.34-7.34 2.7175-2.7154 4.6225 4.6225zm5.405-3.9212l1.97 1.97-1.97 1.97-1.97-1.97zm-10.027-9.999l7.34 7.34-2.7175 2.7154-4.6225-4.6225-4.6225 4.6225-2.7175-2.7154zm-10.029 9.999l1.97-1.97 1.97 1.97-1.97 1.97zM12.002 8.6602l3.34 3.34-3.34 3.34-3.34-3.34z" />
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.09 6.85c-.45 3.56-2.79 5.56-5.87 5.56h-2.12c-.52 0-.96.38-1.04.9l-1.39 8.82c-.04.28.18.53.47.53h3.58c.47 0 .87-.34.95-.8l1.04-6.6c.07-.46.48-.8 1-.8h.74c3.06 0 5.45-1.24 6.14-4.88.33-1.7.13-3.08-.73-4.04-.67-.74-1.8-1.12-3.35-1.12h-.82c.44.83.6 1.76.4 2.93zM16.5 1.5H9.2c-.47 0-.87.34-.95.8L5.05 16.22c-.04.28.18.53.47.53h3.79l1.52-9.66c.07-.46.48-.8 1-.8h3.6c2.72 0 4.82-.98 5.48-4.2C21.43 1.75 19.38 1.5 16.5 1.5z" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Main Character Illustration & Moon Area */}
          <div className="mascot-illustration-area">
            <div className="pixel-moon"></div>
            <div className="pixel-skyline"></div>

            {/* Group of 3 Mascots */}
            <div className="mascot-group">

              {/* Left Mascot */}
              <div className="mascot-wrapper left-mascot">
                <svg viewBox="0 0 200 240" className="mascot-svg">
                  {/* Dog Head */}
                  <ellipse cx="100" cy="120" rx="60" ry="50" fill="#6B6E70" />
                  <polygon points="50,90 40,50 70,80" fill="#6B6E70" />
                  <polygon points="150,90 160,50 130,80" fill="#6B6E70" />
                  {/* Cap */}
                  <path d="M45 95 C 45 60, 155 60, 155 95 Z" fill="#4B6E8A" />
                  <rect x="75" y="70" width="30" height="20" fill="#FFC0CB" rx="3" />
                  <path d="M30 95 L110 90 L110 100 L30 100 Z" fill="#3A536B" /> {/* Visor */}
                  {/* Face details */}
                  <ellipse cx="80" cy="130" rx="8" ry="5" fill="#000" />
                  <ellipse cx="120" cy="130" rx="8" ry="5" fill="#000" />
                  <ellipse cx="100" cy="145" rx="10" ry="6" fill="#111" />
                  {/* Body / Clothes */}
                  <path d="M50 170 L150 170 L160 240 L40 240 Z" fill="#111" />
                  {/* Skeleton bones print */}
                  <line x1="100" y1="180" x2="100" y2="220" stroke="#FFF" strokeWidth="6" />
                  <line x1="80" y1="190" x2="120" y2="190" stroke="#FFF" strokeWidth="4" />
                  <line x1="85" y1="205" x2="115" y2="205" stroke="#FFF" strokeWidth="4" />
                  {/* Red necklace */}
                  <circle cx="70" cy="170" r="5" fill="#FF2C8C" />
                  <circle cx="85" cy="173" r="5" fill="#FF2C8C" />
                  <circle cx="100" cy="175" r="5" fill="#FF2C8C" />
                  <circle cx="115" cy="173" r="5" fill="#FF2C8C" />
                  <circle cx="130" cy="170" r="5" fill="#FF2C8C" />
                  {/* Tail Bone */}
                  <path d="M35 190 Q10 210 20 230" stroke="#E6E6E6" strokeWidth="10" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* Middle Mascot */}
              <div className="mascot-wrapper middle-mascot">
                <svg viewBox="0 0 200 240" className="mascot-svg">
                  {/* Dog Head */}
                  <ellipse cx="100" cy="120" rx="65" ry="55" fill="#4C4E52" />
                  {/* White Hair/Fur top */}
                  <path d="M45 90 Q100 65 155 90 Q100 80 45 90" fill="#FFFFFF" />
                  {/* Headphones */}
                  <path d="M40 120 A 70 70 0 0 1 160 120" stroke="#FF2C8C" strokeWidth="8" fill="none" />
                  <rect x="25" y="95" width="20" height="40" rx="8" fill="#111" />
                  <rect x="27" y="100" width="16" height="30" rx="6" fill="#FF2C8C" />
                  <rect x="155" y="95" width="20" height="40" rx="8" fill="#111" />
                  <rect x="157" y="100" width="16" height="30" rx="6" fill="#FF2C8C" />
                  {/* Sunglasses */}
                  <rect x="50" y="108" width="45" height="25" rx="5" fill="#111" stroke="#FFD700" strokeWidth="2" />
                  <rect x="105" y="108" width="45" height="25" rx="5" fill="#111" stroke="#FFD700" strokeWidth="2" />
                  <line x1="95" y1="115" x2="105" y2="115" stroke="#FFD700" strokeWidth="3" />
                  {/* Nose */}
                  <ellipse cx="100" cy="142" rx="11" ry="7" fill="#000" />
                  {/* Body / Clothes */}
                  <path d="M45 175 L155 175 L165 240 L35 240 Z" fill="#FFFFFF" />
                  {/* Gold Chain + Pendant */}
                  <path d="M70 175 Q100 205 130 175" stroke="#FFD700" strokeWidth="4" fill="none" />
                  <circle cx="100" cy="205" r="14" fill="#B57EDC" />
                  <path d="M96 205 L104 205 M100 197 L100 213" stroke="#FFF" strokeWidth="2" /> {/* Unicorn plus */}
                </svg>
              </div>

              {/* Right Mascot */}
              <div className="mascot-wrapper right-mascot">
                <svg viewBox="0 0 200 240" className="mascot-svg">
                  {/* Cybernetic Head */}
                  {/* Right organic half */}
                  <path d="M100 65 A 55 55 0 0 1 100 175 Z" fill="#585A5C" />
                  {/* Left cybernetic half */}
                  <path d="M100 65 A 55 55 0 0 0 100 175 Z" fill="#A0A5A8" />
                  {/* Cyber eye details */}
                  <circle cx="75" cy="120" r="12" fill="#222" stroke="#FFF" />
                  <circle cx="75" cy="120" r="5" fill="#00FF00" />
                  <line x1="60" y1="120" x2="90" y2="120" stroke="#00FF00" strokeWidth="1" />
                  {/* Organic eye details */}
                  <ellipse cx="125" cy="120" rx="8" ry="6" fill="#111" />
                  {/* Gears on cyber side */}
                  <circle cx="85" cy="150" r="8" fill="none" stroke="#666" strokeWidth="2" strokeDasharray="3 2" />
                  {/* Yellow Goggles */}
                  <path d="M50 90 L150 90 L145 105 L55 105 Z" fill="#FFA500" opacity="0.8" />
                  <rect x="40" y="88" width="12" height="15" fill="#222" />
                  <rect x="148" y="88" width="12" height="15" fill="#222" />
                  {/* Body / Jacket */}
                  <path d="M48 175 L152 175 L160 240 L40 240 Z" fill="#2B2B2B" />
                  <path d="M85 175 L100 220 L115 175" stroke="#111" strokeWidth="4" fill="none" />
                  {/* Bitcoin Chain */}
                  <path d="M75 175 Q100 200 125 175" stroke="#FFD700" strokeWidth="3" fill="none" />
                  <circle cx="100" cy="200" r="10" fill="#FFD700" />
                  <text x="96" y="204" fill="#111" fontSize="12" fontWeight="800">B</text>
                </svg>
              </div>

            </div>
          </div>

          {/* Footer Overlay of Approving Section */}
          <div className="approving-footer">
            <div className="approving-title-bar">
              <button className="nav-arrow outline-arrow" aria-label="Previous" onClick={() => setApprovalIndex(prev => (prev - 1 + approvals.length) % approvals.length)}>
                <ChevronLeft size={20} />
              </button>
              <h2 className="approving-heading">{approvals[approvalIndex]}</h2>
              <button className="nav-arrow outline-arrow" aria-label="Next" onClick={() => setApprovalIndex(prev => (prev + 1) % approvals.length)}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

        </section>

        {/* Music Platform Section */}
        <section id="pages" className="music-platform-section">
          <div className="music-container">

            {/* Left Side: Text and stats */}
            <div className="music-left">
              <h2 className="music-headline">
                DECENTRALIZED <br />
                <span className="music-neon-glow">MUSIC PLATFORM</span> <br />
                BUILT ON ETHEREUM
              </h2>
              <p className="music-desc">
                Discover songs, claim limited editions and support your favorite artists. Buy, sell or auction any audio file into a unique NFT with the power of blockchain.
              </p>

              <div className="music-btn-row">
                <button className="music-buy-btn" onClick={() => openAuthModal('register')}>BUY TOKEN</button>
                <button className="music-paper-btn" onClick={() => setIsWhitepaperOpen(true)}>WHITE PAPER</button>
              </div>

              <div className="music-stats-row">
                <div className="music-stat-box">
                  <h4>500M</h4>
                  <span>PTG Supply</span>
                </div>
                <div className="music-stat-box">
                  <h4>20%</h4>
                  <span>Staking Bonus</span>
                </div>
                <div className="music-stat-box">
                  <h4>$1=1PTG</h4>
                  <span>Token Price</span>
                </div>
              </div>
            </div>

            {/* Right Side: Image and countdown timer card */}
            <div className="music-right">
              <div className="musician-card">
                <img src="/musician.png" alt="Musician stage performance" className="musician-img" />

                {/* Overlay Glass Timer */}
                <div className="musician-timer-overlay">
                  <span className="musician-timer-title">TOKEN SALE END IN!</span>
                  <div className="musician-timer-clock">
                    <div className="musician-clock-box">
                      <span className="m-clock-num">{formatNum(musicTimeLeft.days)}</span>
                      <span className="m-clock-lbl">Days</span>
                    </div>
                    <span className="m-clock-sep">:</span>
                    <div className="musician-clock-box">
                      <span className="m-clock-num">{formatNum(musicTimeLeft.hours)}</span>
                      <span className="m-clock-lbl">Hours</span>
                    </div>
                    <span className="m-clock-sep">:</span>
                    <div className="musician-clock-box">
                      <span className="m-clock-num">{formatNum(musicTimeLeft.minutes)}</span>
                      <span className="m-clock-lbl">Minutes</span>
                    </div>
                    <span className="m-clock-sep">:</span>
                    <div className="musician-clock-box">
                      <span className="m-clock-num">{formatNum(musicTimeLeft.seconds)}</span>
                      <span className="m-clock-lbl">Seconds</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="team-section">
          <div className="glow-spot glow-blue" style={{ top: '20%', left: '50%', width: '400px', height: '400px' }}></div>
          <h2 className="section-title-center">Our Team Members</h2>
          <p className="section-desc-center">Meet the expert team driving the innovation of ICOLand blockchain solutions.</p>

          <div className="team-grid">
            {/* Member 1 */}
            <div className="team-card">
              <div className="team-avatar-frame">
                <svg viewBox="0 0 100 100" className="team-avatar-svg">
                  <circle cx="50" cy="50" r="45" fill="rgba(255, 255, 255, 0.05)" stroke="url(#avatar-grad)" strokeWidth="2" />
                  <circle cx="50" cy="40" r="18" fill="#ff2c8c" />
                  <path d="M25 75 C25 60, 75 60, 75 75 Z" fill="#3283ff" />
                  <defs>
                    <linearGradient id="avatar-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#3283ff" />
                      <stop offset="1" stopColor="#ff2c8c" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3>Alex Rivers</h3>
              <p>Founder & CEO</p>
            </div>

            {/* Member 2 */}
            <div className="team-card">
              <div className="team-avatar-frame">
                <svg viewBox="0 0 100 100" className="team-avatar-svg">
                  <circle cx="50" cy="50" r="45" fill="rgba(255, 255, 255, 0.05)" stroke="url(#avatar-grad)" strokeWidth="2" />
                  <circle cx="50" cy="40" r="18" fill="#8b2bff" />
                  <path d="M25 75 C25 60, 75 60, 75 75 Z" fill="#ff2c8c" />
                </svg>
              </div>
              <h3>Devon Lane</h3>
              <p>Blockchain Developer</p>
            </div>

            {/* Member 3 */}
            <div className="team-card">
              <div className="team-avatar-frame">
                <svg viewBox="0 0 100 100" className="team-avatar-svg">
                  <circle cx="50" cy="50" r="45" fill="rgba(255, 255, 255, 0.05)" stroke="url(#avatar-grad)" strokeWidth="2" />
                  <circle cx="50" cy="40" r="18" fill="#3283ff" />
                  <path d="M25 75 C25 60, 75 60, 75 75 Z" fill="#8b2bff" />
                </svg>
              </div>
              <h3>Sofia Chen</h3>
              <p>UX/UI Designer</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="glow-spot glow-pink" style={{ bottom: '-10%', left: '10%' }}></div>
          <div className="contact-card">
            <h2>Subscribe to Newsletter</h2>
            <p>Stay updated with our latest news, token releases, and project updates.</p>
            <div className="contact-form">
              <input type="email" placeholder="Enter your email address" aria-label="Email for Newsletter" />
              <button className="subscribe-btn">SUBSCRIBE NOW</button>
            </div>
          </div>
        </section>

      </div>
      {/* End page-content-wrapper */}

      {/* Authentication Section - page section below navbar */}
      {isLoginOpen && (
        <div className="auth-page-section" onClick={() => setIsLoginOpen(false)}>
          <div className="auth-page-card" onClick={(e) => e.stopPropagation()}>
            {/* Left side: Branding Info Panel (Only visible on larger screens) */}
            <div className="auth-brand-side">
              <div className="auth-brand-logo">
                <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" fill="url(#auth-logo-grad)" stroke="#ff2c8c" strokeWidth="2" />
                  <circle cx="16" cy="16" r="6" fill="#ffffff" />
                  <defs>
                    <linearGradient id="auth-logo-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3283ff" />
                      <stop offset="1" stopColor="#ff2c8c" />
                    </linearGradient>
                  </defs>
                </svg>
                <span>ICOLand</span>
              </div>
              <div className="auth-brand-info">
                <h2>Powering Data For The New Equity Blockchain.</h2>
                <p>Buy, sell, and track your cryptographic tokens in real-time. Join the decentralization movement with robust features and premium performance.</p>
              </div>
              <div className="auth-brand-stats">
                <div className="auth-stat-item">
                  <span className="auth-stat-num">75% OFF</span>
                  <span className="auth-stat-lbl">Crowdsale Discount</span>
                </div>
                <div className="auth-stat-item">
                  <span className="auth-stat-num">12 Days</span>
                  <span className="auth-stat-lbl">Time Remaining</span>
                </div>
              </div>
            </div>

            {/* Right side: Form Panel */}
            <div className="auth-form-side">
              <button className="auth-page-close" onClick={() => setIsLoginOpen(false)} aria-label="Close">&times;</button>

              {/* Auth Tab Switcher */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                >
                  Sign Up
                </button>
              </div>

              <h2 className="auth-page-title">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="auth-page-desc">
                {authMode === 'login'
                  ? 'Access your dashboard and manage your token investments.'
                  : 'Start purchasing and selling your tokens securely.'}
              </p>

              <form
                className="login-form"
                onSubmit={async (e) => {
                  e.preventDefault();

                  setAuthError('');
                  setAuthLoading(true);

                  const BACKEND = 'http://localhost:5000';

                  if (authMode === 'register') {
                    if (formData.password !== formData.confirmPassword) {
                      setAuthError('Passwords do not match');
                      setAuthLoading(false);
                      return;
                    }
                    if (formData.password.length < 6) {
                      setAuthError('Password must be at least 6 characters');
                      setAuthLoading(false);
                      return;
                    }

                    try {
                      const res = await fetch(`${BACKEND}/api/auth/signup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: formData.name,
                          email: formData.email,
                          password: formData.password
                        })
                      });

                      const data = await res.json();
                      if (res.ok) {
                        const userObj = { name: data.user?.name || formData.name, email: data.user?.email || formData.email };
                        setLoggedInUser(userObj);
                        localStorage.setItem('user', JSON.stringify(userObj));
                        if (data.token) localStorage.setItem('token', data.token);
                        setIsLoginOpen(false);
                      } else {
                        setAuthError(data.error || 'Registration failed. Please try again.');
                      }
                    } catch (err) {
                      console.error('Registration error:', err);
                      setAuthError('Cannot connect to server. Make sure the backend is running on port 5001.');
                    }
                  } else {
                    try {
                      const res = await fetch(`${BACKEND}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: formData.email,
                          password: formData.password
                        })
                      });

                      const data = await res.json();
                      if (res.ok) {
                        const userObj = { name: data.user.name, email: data.user.email };
                        setLoggedInUser(userObj);
                        localStorage.setItem('user', JSON.stringify(userObj));
                        if (data.token) localStorage.setItem('token', data.token);
                        setIsLoginOpen(false);
                      } else {
                        setAuthError(data.error || 'Invalid email or password.');
                      }
                    } catch (err) {
                      console.error('Login error:', err);
                      setAuthError('Cannot connect to server. Make sure the backend is running on port 5001.');
                    }
                  }
                  setAuthLoading(false);
                }}
              >
                {authMode === 'register' && (
                  <div className="input-group" style={{ marginBottom: '1.2rem' }}>
                    <label htmlFor="modal-name">Full Name</label>
                    <input
                      type="text"
                      id="modal-name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                <div className="input-group">
                  <label htmlFor="modal-email">Email Address</label>
                  <input
                    type="email"
                    id="modal-email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group" style={{ marginTop: '1.2rem' }}>
                  <label htmlFor="modal-password">Password</label>
                  <input
                    type="password"
                    id="modal-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {authMode === 'register' && (
                  <div className="input-group" style={{ marginTop: '1.2rem' }}>
                    <label htmlFor="modal-confirm-password">Confirm Password</label>
                    <input
                      type="password"
                      id="modal-confirm-password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                <div className="login-actions">
                  {authMode === 'login' ? (
                    <>
                      <label className="remember-me">
                        <input type="checkbox" /> Remember me
                      </label>
                      <a href="#forgot" className="forgot-pass">Forgot Password?</a>
                    </>
                  ) : (
                    <label className="remember-me">
                      <input type="checkbox" required /> I agree to Terms & Conditions
                    </label>
                  )}
                </div>

                {authError && (
                  <div className="auth-error">{authError}</div>
                )}

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={authLoading}
                >
                  {authLoading
                    ? (authMode === 'login' ? 'SIGNING IN...' : 'REGISTERING...')
                    : (authMode === 'login' ? 'SIGN IN' : 'REGISTER NOW')
                  }
                </button>
              </form>

              <div className="login-signup-prompt">
                {authMode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <a href="#register" onClick={(e) => { e.preventDefault(); setAuthMode('register'); }}>
                      Sign Up
                    </a>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <a href="#login" onClick={(e) => { e.preventDefault(); setAuthMode('login'); }}>
                      Sign In
                    </a>
                  </>
                )}
              </div>
            </div> {/* End auth-form-side */}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLogoutModalOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsLogoutModalOpen(false)} aria-label="Close">&times;</button>
            <div className="confirm-icon">
              <LogOut size={32} />
            </div>
            <h2>Logout</h2>
            <p>Are you sure you want to logout? You will need to sign in again to access your dashboard.</p>
            <div className="confirm-actions">
              <button
                className="confirm-cancel-btn"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-logout-btn"
                onClick={() => {
                  setLoggedInUser(null);
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                  }
                  setIsLogoutModalOpen(false);
                  setIsDashboardOpen(false);
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Modal */}
      {isDashboardOpen && (
        <div className="modal-overlay" onClick={() => setIsDashboardOpen(false)}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsDashboardOpen(false)} aria-label="Close dashboard">&times;</button>

            {/* User Profile Header */}
            <div className="dashboard-header">
              <div className="dashboard-avatar">
                {loggedInUser?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="dashboard-user-info">
                <h2>Welcome, {loggedInUser?.name}!</h2>
                <p className="dashboard-email">{loggedInUser?.email}</p>
                <div className="dashboard-badge-row">
                  <span className="dash-badge">KYC Verified</span>
                  <span className="dash-badge vip">VIP Tier 1</span>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs Navigation */}
            <div className="dash-tabs-nav">
              <button
                className={`dash-tab-btn ${dashTab === 'wallet' ? 'active' : ''}`}
                onClick={() => setDashTab('wallet')}
              >
                <Wallet size={15} />
                <span>Create Vault</span>
              </button>
              <button
                className={`dash-tab-btn ${dashTab === 'rewards' ? 'active' : ''}`}
                onClick={() => setDashTab('rewards')}
              >
                <Gift size={15} />
                <span>Your Rewards</span>
              </button>
              <button
                className={`dash-tab-btn ${dashTab === 'earnings' ? 'active' : ''}`}
                onClick={() => setDashTab('earnings')}
              >
                <History size={15} />
                <span>Earning History</span>
              </button>
              <button
                className={`dash-tab-btn ${dashTab === 'presale' ? 'active' : ''}`}
                onClick={() => setDashTab('presale')}
              >
                <Sparkles size={15} />
                <span>Presale Token</span>
              </button>
              <button
                className={`dash-tab-btn ${dashTab === 'ico' ? 'active' : ''}`}
                onClick={() => setDashTab('ico')}
              >
                <Coins size={15} />
                <span>ICO Tokens</span>
              </button>
            </div>

            {/* Tab 1: Create Vault / Wallet */}
            {dashTab === 'wallet' && (
              <div className="dash-tab-content">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3><Wallet size={18} style={{ color: '#3283ff' }} /> Crypto Vault & Web3 Wallet</h3>
                    <span className="dash-badge" style={{ background: isWalletCreated ? 'rgba(0, 220, 130, 0.15)' : 'rgba(255,255,255,0.05)', color: isWalletCreated ? '#00dc82' : '#fff' }}>
                      {isWalletCreated ? 'ACTIVE VAULT' : 'UNCONNECTED'}
                    </span>
                  </div>

                  {isWalletCreated ? (
                    <div className="wallet-details-box">
                      <div className="wallet-addr-row">
                        <span className="lbl">Vault Address:</span>
                        <code className="addr">{walletAddress}</code>
                        <button
                          className="copy-mini-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(walletAddress);
                            setCopiedContract(true);
                            setTimeout(() => setCopiedContract(false), 2000);
                          }}
                        >
                          {copiedContract ? <Check size={14} color="#00dc82" /> : <Copy size={14} />}
                        </button>
                      </div>

                      <div className="vault-balances-grid">
                        <div className="v-bal-item">
                          <span className="v-label">PTG Balance</span>
                          <span className="v-val" style={{ color: '#ff2c8c' }}>2,450 PTG</span>
                        </div>
                        <div className="v-bal-item">
                          <span className="v-label">Ethereum (ETH)</span>
                          <span className="v-val" style={{ color: '#3283ff' }}>0.45 ETH</span>
                        </div>
                        <div className="v-bal-item">
                          <span className="v-label">USDT Balance</span>
                          <span className="v-val" style={{ color: '#00dc82' }}>120.00 USDT</span>
                        </div>
                      </div>

                      <div className="security-notice">
                        <ShieldCheck size={16} color="#00dc82" />
                        <span>Vault protected with 256-bit AES encryption & Biometric Passkey.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="create-wallet-cta">
                      <p>Create a secure multi-sig crypto vault to store your PTG tokens, stake rewards, and earn yield seamlessly.</p>
                      <button
                        className="create-vault-btn"
                        onClick={() => {
                          setIsWalletCreated(true);
                          setWalletAddress('0x71C4' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...49A2');
                        }}
                      >
                        <PlusCircle size={18} />
                        <span>Create New Vault / Wallet</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Your Rewards */}
            {dashTab === 'rewards' && (
              <div className="dash-tab-content">
                <div className="dash-hero-card">
                  <div>
                    <div className="hero-balance-lbl">Total Accumulated Rewards</div>
                    <div className="hero-balance-val">450 PTG</div>
                  </div>
                  <button
                    className={`claim-btn ${claimedReward ? 'claimed' : ''}`}
                    onClick={() => {
                      setClaimedReward(true);
                      setTimeout(() => setClaimedReward(false), 3000);
                    }}
                  >
                    {claimedReward ? '✓ Rewards Claimed!' : '🎁 Claim All Rewards'}
                  </button>
                </div>

                <div className="rewards-grid">
                  <div className="reward-card">
                    <div className="r-icon" style={{ background: 'rgba(50, 131, 255, 0.15)', color: '#3283ff' }}>🔒</div>
                    <div className="r-info">
                      <h4>Staking Yield (20% APY)</h4>
                      <span className="r-val">+200 PTG</span>
                      <p>Earned from locking 1,000 PTG in 90-day pool.</p>
                    </div>
                  </div>
                  <div className="reward-card">
                    <div className="r-icon" style={{ background: 'rgba(255, 44, 140, 0.15)', color: '#ff2c8c' }}>👥</div>
                    <div className="r-info">
                      <h4>Referral Bonuses</h4>
                      <span className="r-val">+200 PTG</span>
                      <p>4 Active referrals registered with your link.</p>
                    </div>
                  </div>
                  <div className="reward-card">
                    <div className="r-icon" style={{ background: 'rgba(0, 220, 130, 0.15)', color: '#00dc82' }}>🎯</div>
                    <div className="r-info">
                      <h4>Community Quests</h4>
                      <span className="r-val">+50 PTG</span>
                      <p>Completed Twitter & Telegram launch tasks.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Your Earning History */}
            {dashTab === 'earnings' && (
              <div className="dash-tab-content">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3><History size={18} style={{ color: '#8b2bff' }} /> Earning & Transaction History</h3>
                  </div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-dot" style={{ background: '#00dc82' }}></div>
                      <div className="activity-info">
                        <span className="activity-text">Staking Daily Reward</span>
                        <span className="activity-time">Today, 10:30 AM</span>
                      </div>
                      <span className="activity-amount" style={{ color: '#00dc82' }}>+20 PTG</span>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot" style={{ background: '#ff2c8c' }}></div>
                      <div className="activity-info">
                        <span className="activity-text">Referral Commission</span>
                        <span className="activity-time">Yesterday</span>
                      </div>
                      <span className="activity-amount" style={{ color: '#ff2c8c' }}>+50 PTG</span>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot" style={{ background: '#3283ff' }}></div>
                      <div className="activity-info">
                        <span className="activity-text">Presale Round 2 Purchase</span>
                        <span className="activity-time">3 Days ago</span>
                      </div>
                      <span className="activity-amount" style={{ color: '#3283ff' }}>+1,000 PTG</span>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot" style={{ background: '#8b2bff' }}></div>
                      <div className="activity-info">
                        <span className="activity-text">Early Supporter Airdrop</span>
                        <span className="activity-time">1 Week ago</span>
                      </div>
                      <span className="activity-amount" style={{ color: '#8b2bff' }}>+200 PTG</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Presale Token */}
            {dashTab === 'presale' && (
              <div className="dash-tab-content">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3><Sparkles size={18} style={{ color: '#ff2c8c' }} /> Presale Token Allocations</h3>
                    <span className="dash-badge vip">STAGE 2 LIVE</span>
                  </div>

                  <div className="presale-info-grid">
                    <div className="p-info-box">
                      <span className="p-lbl">Token Price</span>
                      <span className="p-val">$0.05 / PTG</span>
                    </div>
                    <div className="p-info-box">
                      <span className="p-lbl">Next Stage Price</span>
                      <span className="p-val" style={{ color: '#ff2c8c' }}>$0.10 / PTG</span>
                    </div>
                    <div className="p-info-box">
                      <span className="p-lbl">Your Purchased Tokens</span>
                      <span className="p-val">1,500 PTG</span>
                    </div>
                  </div>

                  <div className="presale-progress-wrapper" style={{ marginTop: '1.2rem' }}>
                    <div className="progress-labels" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#fff', marginBottom: '0.4rem' }}>
                      <span>Stage 2 Progress</span>
                      <span>75% (375M / 500M)</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #3283ff, #ff2c8c)', borderRadius: '4px' }}></div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setIsDashboardOpen(false);
                        handleNavClick('sales');
                      }}
                      className="create-vault-btn"
                      style={{ background: 'linear-gradient(135deg, #3283ff, #ff2c8c)', boxShadow: '0 4px 15px rgba(255, 44, 140, 0.3)' }}
                    >
                      Buy More Presale Tokens
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: ICO Tokens */}
            {dashTab === 'ico' && (
              <div className="dash-tab-content">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3><Coins size={18} style={{ color: '#00dc82' }} /> ICO Token Specifications</h3>
                    <span className="dash-badge">ERC-20 / BEP-20</span>
                  </div>

                  <div className="ico-specs-list">
                    <div className="spec-row">
                      <span className="spec-label">Token Name:</span>
                      <span className="spec-value">ICOLand Token</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Ticker Symbol:</span>
                      <span className="spec-value" style={{ color: '#ff2c8c', fontWeight: 700 }}>PTG</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Total Supply:</span>
                      <span className="spec-value">500,000,000 PTG</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Smart Contract:</span>
                      <code className="spec-code">0x3283ff2c8c991a27e02941b8b2bfe...</code>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Your ICO Holding:</span>
                      <span className="spec-value" style={{ color: '#3283ff', fontWeight: 700 }}>2,450 PTG</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              className="dashboard-logout-btn"
              onClick={() => {
                setIsDashboardOpen(false);
                setIsLogoutModalOpen(true);
              }}
              style={{ marginTop: '1.5rem' }}
            >
              <LogOut size={16} />
              Logout Account
            </button>
          </div>
        </div>
      )}

      {/* Whitepaper Modal Overlay */}
      {isWhitepaperOpen && (
        <div className="modal-overlay" onClick={() => setIsWhitepaperOpen(false)}>
          <div className="login-modal-card whitepaper-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsWhitepaperOpen(false)} aria-label="Close modal">&times;</button>
            <h2>ICOLand Whitepaper</h2>
            <p>Read about the ICOLand blockchain architecture, distribution dynamics, and project scope.</p>

            <div className="whitepaper-tabs" style={{ textAlign: 'left', marginTop: '1rem', color: '#fff', fontSize: '0.9rem' }}>
              <div className="wp-tab-item" style={{ marginBottom: '1.2rem' }}>
                <strong style={{ color: '#ff2c8c' }}>1. Technology Stack</strong>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Built on top of sub-second Layer-2 state-channels leveraging zero-knowledge proofs for security.
                </p>
              </div>
              <div className="wp-tab-item" style={{ marginBottom: '1.2rem' }}>
                <strong style={{ color: '#3283ff' }}>2. Tokenomics</strong>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Total distribution of 50,000,000 HVR with a 10% liquidity lock, 40% public sale, and 20% ecosystem incentives.
                </p>
              </div>
              <div className="wp-tab-item">
                <strong style={{ color: '#8b2bfe' }}>3. Future Ecosystem</strong>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Integrating decentralised audio licensing protocols and NFT registries to secure royalty streams.
                </p>
              </div>
            </div>

            <button className="login-submit-btn" style={{ marginTop: '2rem', width: '100%' }} onClick={() => setIsWhitepaperOpen(false)}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}
