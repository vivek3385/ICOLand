'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  LogOut,
  LayoutDashboard,
  Wallet,
  Gift,
  History,
  Coins,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Copy,
  Check,
  User as UserIcon,
  TrendingUp,
  ArrowUpRight,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  Lock,
  Layers,
  Menu,
  X
} from 'lucide-react';

interface UserObj {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<UserObj | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'rewards' | 'earnings' | 'presale' | 'ico'>('overview');
  const [isWalletCreated, setIsWalletCreated] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string>('0x71C4892A9F1B3E005421839201A49A2');
  const [copiedContract, setCopiedContract] = useState<boolean>(false);
  const [claimedReward, setClaimedReward] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: 'overview' | 'wallet' | 'rewards' | 'earnings' | 'presale' | 'ico') => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setLoggedInUser(JSON.parse(savedUser));
      } else {
        // Fallback for demo if no logged in user
        setLoggedInUser({ name: 'Alex Johnson', email: 'alex.johnson@example.com' });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="dash-fullpage-container">
      {/* Background Ambient Glows */}
      <div className="glow-spot glow-blue"></div>
      <div className="glow-spot glow-purple"></div>

      {/* Top Header Navbar */}
      <header className="dash-top-nav">
        <div className="dash-logo-area">
          <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
            <span className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" fill="url(#dash-logo-grad)" stroke="#ff2c8c" strokeWidth="2" />
                <circle cx="16" cy="16" r="6" fill="#ffffff" />
                <defs>
                  <linearGradient id="dash-logo-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3283ff" />
                    <stop offset="1" stopColor="#ff2c8c" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="logo-text">ICOLand</span>
          </Link>
        </div>

        <div className="dash-top-actions">
          <Link href="/" className="dash-home-link">
            <ArrowLeft size={16} />
            <span className="hide-mobile">Back to Site</span>
          </Link>

          <div className="dash-user-profile">
            <div className="user-avatar-circle">
              {loggedInUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-meta hide-mobile">
              <span className="u-name">{loggedInUser?.name || 'User'}</span>
              <span className="u-status">KYC Verified</span>
            </div>
            <button
              className="dash-logout-icon-btn"
              onClick={() => setIsLogoutModalOpen(true)}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>

          <button
            className={`dash-mobile-toggle ${isMobileSidebarOpen ? 'active' : ''}`}
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div className="dash-sidebar-overlay" onClick={() => setIsMobileSidebarOpen(false)}></div>
      )}

      {/* Main Dashboard Layout */}
      <div className="dash-main-layout">
        {/* Sidebar Navigation */}
        <aside className={`dash-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-section-lbl">MENU</div>
          <nav className="dash-nav-menu">
            <button
              className={`dash-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>
            <button
              className={`dash-nav-item ${activeTab === 'wallet' ? 'active' : ''}`}
              onClick={() => handleTabChange('wallet')}
            >
              <Wallet size={18} />
              <span>Create Vault</span>
            </button>
            <button
              className={`dash-nav-item ${activeTab === 'rewards' ? 'active' : ''}`}
              onClick={() => handleTabChange('rewards')}
            >
              <Gift size={18} />
              <span>Your Rewards</span>
              <span className="badge-count">450 PTG</span>
            </button>
            <button
              className={`dash-nav-item ${activeTab === 'earnings' ? 'active' : ''}`}
              onClick={() => handleTabChange('earnings')}
            >
              <History size={18} />
              <span>Earning History</span>
            </button>
            <button
              className={`dash-nav-item ${activeTab === 'presale' ? 'active' : ''}`}
              onClick={() => handleTabChange('presale')}
            >
              <Sparkles size={18} />
              <span>Presale Token</span>
              <span className="badge-live">LIVE</span>
            </button>
            <button
              className={`dash-nav-item ${activeTab === 'ico' ? 'active' : ''}`}
              onClick={() => handleTabChange('ico')}
            >
              <Coins size={18} />
              <span>ICO Tokens</span>
            </button>
          </nav>

          <div className="dash-sidebar-banner">
            <div className="banner-icon">🚀</div>
            <h4>Staking APY Boost</h4>
            <p>Earn +20% annual yield on your PTG tokens today.</p>
            <button className="banner-btn" onClick={() => handleTabChange('rewards')}>View Rewards</button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="dash-content-body" ref={mainContentRef}>
          {/* Welcome Banner */}
          <div className="dash-welcome-hero">
            <div>
              <h1>Welcome back, {loggedInUser?.name}! 👋</h1>
              <p>Manage your crypto vault, track your rewards, and monitor your ICO token investments.</p>
            </div>
            <div className="hero-quick-stats">
              <div className="h-stat-box">
                <span className="lbl">Total Portfolio</span>
                <span className="val">$2,450.00 USD</span>
              </div>
              <div className="h-stat-box">
                <span className="lbl">PTG Holdings</span>
                <span className="val" style={{ color: '#ff2c8c' }}>2,450 PTG</span>
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              {/* Stat Cards Grid */}
              <div className="dash-overview-stats">
                <div className="ov-card">
                  <div className="ov-icon" style={{ background: 'rgba(50, 131, 255, 0.15)', color: '#3283ff' }}>
                    <Wallet size={22} />
                  </div>
                  <div className="ov-info">
                    <span className="lbl">Crypto Vault Balance</span>
                    <span className="val">2,450 PTG</span>
                    <span className="sub">≈ $2,450.00 USD</span>
                  </div>
                </div>

                <div className="ov-card">
                  <div className="ov-icon" style={{ background: 'rgba(255, 44, 140, 0.15)', color: '#ff2c8c' }}>
                    <Gift size={22} />
                  </div>
                  <div className="ov-info">
                    <span className="lbl">Total Earned Rewards</span>
                    <span className="val" style={{ color: '#00dc82' }}>450 PTG</span>
                    <span className="sub">Staking & Referral yield</span>
                  </div>
                </div>

                <div className="ov-card">
                  <div className="ov-icon" style={{ background: 'rgba(139, 43, 255, 0.15)', color: '#8b2bff' }}>
                    <TrendingUp size={22} />
                  </div>
                  <div className="ov-info">
                    <span className="lbl">Current Staking APY</span>
                    <span className="val" style={{ color: '#8b2bff' }}>+20.0%</span>
                    <span className="sub">Auto-compounding active</span>
                  </div>
                </div>

                <div className="ov-card">
                  <div className="ov-icon" style={{ background: 'rgba(0, 220, 130, 0.15)', color: '#00dc82' }}>
                    <Sparkles size={22} />
                  </div>
                  <div className="ov-info">
                    <span className="lbl">Presale Stage</span>
                    <span className="val">Stage 2 (75%)</span>
                    <span className="sub">$0.05 / PTG</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity Grid */}
              <div className="dash-grid-2col">
                <div className="dash-box">
                  <div className="box-title">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="quick-actions-list">
                    <button className="q-action-item" onClick={() => handleTabChange('wallet')}>
                      <div className="q-icon"><PlusCircle size={20} /></div>
                      <div className="q-text">
                        <strong>Manage Web3 Vault</strong>
                        <span>View seed backup & wallet keys</span>
                      </div>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </button>

                    <button className="q-action-item" onClick={() => handleTabChange('rewards')}>
                      <div className="q-icon" style={{ background: 'rgba(0,220,130,0.15)', color: '#00dc82' }}><Gift size={20} /></div>
                      <div className="q-text">
                        <strong>Claim Rewards</strong>
                        <span>450 PTG pending withdrawal</span>
                      </div>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </button>

                    <button className="q-action-item" onClick={() => handleTabChange('presale')}>
                      <div className="q-icon" style={{ background: 'rgba(255,44,140,0.15)', color: '#ff2c8c' }}><Sparkles size={20} /></div>
                      <div className="q-text">
                        <strong>Buy Presale Tokens</strong>
                        <span>Stage 2 token price: $0.05</span>
                      </div>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </button>
                  </div>
                </div>

                <div className="dash-box">
                  <div className="box-title">
                    <h3>Recent Earning Activity</h3>
                    <button className="view-all-btn" onClick={() => handleTabChange('earnings')}>View All</button>
                  </div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-dot" style={{ background: '#00dc82' }}></div>
                      <div className="activity-info">
                        <span className="activity-text">Staking Yield Payout</span>
                        <span className="activity-time">Today, 10:30 AM</span>
                      </div>
                      <span className="activity-amount" style={{ color: '#00dc82' }}>+20 PTG</span>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot" style={{ background: '#ff2c8c' }}></div>
                      <div className="activity-info">
                        <span className="activity-text">Referral Commission (@user_dev)</span>
                        <span className="activity-time">Yesterday</span>
                      </div>
                      <span className="activity-amount" style={{ color: '#ff2c8c' }}>+50 PTG</span>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot" style={{ background: '#3283ff' }}></div>
                      <div className="activity-info">
                        <span className="activity-text">Presale Token Purchase</span>
                        <span className="activity-time">3 days ago</span>
                      </div>
                      <span className="activity-amount" style={{ color: '#3283ff' }}>+1,000 PTG</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE VAULT & WALLET */}
          {activeTab === 'wallet' && (
            <div className="tab-pane">
              <div className="dash-box">
                <div className="box-header-row">
                  <div>
                    <h2><Wallet size={22} style={{ color: '#3283ff' }} /> Crypto Vault & Web3 Wallet</h2>
                    <p>Secure multi-signature vault to store your PTG tokens, stake rewards, and manage digital assets.</p>
                  </div>
                  <span className="status-badge active">
                    <ShieldCheck size={14} /> ACTIVE VAULT
                  </span>
                </div>

                {isWalletCreated ? (
                  <div className="vault-full-details">
                    <div className="vault-address-card">
                      <div className="v-header">
                        <span>CONNECTED VAULT ADDRESS</span>
                        <span className="net-tag">Ethereum / BEP-20 Mainnet</span>
                      </div>
                      <div className="v-address-bar">
                        <code>{walletAddress}</code>
                        <button
                          className="copy-btn-large"
                          onClick={() => {
                            navigator.clipboard.writeText(walletAddress);
                            setCopiedContract(true);
                            setTimeout(() => setCopiedContract(false), 2000);
                          }}
                        >
                          {copiedContract ? <Check size={16} color="#00dc82" /> : <Copy size={16} />}
                          <span>{copiedContract ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="assets-breakdown">
                      <h3>Vault Asset Holdings</h3>
                      <div className="asset-rows-list">
                        <div className="asset-row">
                          <div className="asset-name">
                            <div className="coin-icon" style={{ background: 'linear-gradient(135deg, #3283ff, #ff2c8c)' }}>PTG</div>
                            <div>
                              <strong>ICOLand Token (PTG)</strong>
                              <span>Native Ecosystem Token</span>
                            </div>
                          </div>
                          <div className="asset-val">
                            <strong>2,450 PTG</strong>
                            <span>≈ $2,450.00 USD</span>
                          </div>
                        </div>

                        <div className="asset-row">
                          <div className="asset-name">
                            <div className="coin-icon" style={{ background: '#627eea' }}>ETH</div>
                            <div>
                              <strong>Ethereum (ETH)</strong>
                              <span>Gas Fee Reserve</span>
                            </div>
                          </div>
                          <div className="asset-val">
                            <strong>0.45 ETH</strong>
                            <span>≈ $1,575.00 USD</span>
                          </div>
                        </div>

                        <div className="asset-row">
                          <div className="asset-name">
                            <div className="coin-icon" style={{ background: '#26a17b' }}>USDT</div>
                            <div>
                              <strong>Tether (USDT)</strong>
                              <span>Stablecoin Reserve</span>
                            </div>
                          </div>
                          <div className="asset-val">
                            <strong>120.00 USDT</strong>
                            <span>≈ $120.00 USD</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="security-guarantee-box">
                      <ShieldCheck size={20} color="#00dc82" />
                      <div>
                        <strong>Bank-Grade AES-256 Multi-Sig Encryption</strong>
                        <p>Your private keys remain stored strictly inside your browser session and encrypted hardware enclave.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="create-vault-hero-card">
                    <div className="c-vault-icon">🔐</div>
                    <h3>Create Your Web3 Crypto Vault</h3>
                    <p>Generate a non-custodial cryptographic vault to receive presale tokens and automate your daily staking rewards.</p>
                    <button
                      className="primary-gradient-btn"
                      onClick={() => {
                        setIsWalletCreated(true);
                        setWalletAddress('0x71C4' + Math.random().toString(16).substring(2, 10).toUpperCase() + 'A9F1B3E005421839201A49A2');
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

          {/* TAB 3: YOUR REWARDS */}
          {activeTab === 'rewards' && (
            <div className="tab-pane">
              <div className="dash-box">
                <div className="rewards-hero-header">
                  <div>
                    <span className="lbl">TOTAL ACCUMULATED REWARDS</span>
                    <h2>450 PTG <small>($450.00 USD)</small></h2>
                    <p>Earned from staking pools, referral commissions, and community bounties.</p>
                  </div>
                  <button
                    className={`claim-all-large-btn ${claimedReward ? 'claimed' : ''}`}
                    onClick={() => {
                      setClaimedReward(true);
                      setTimeout(() => setClaimedReward(false), 3000);
                    }}
                  >
                    {claimedReward ? '✓ Rewards Claimed to Vault!' : '🎁 Claim All 450 PTG Rewards'}
                  </button>
                </div>

                <div className="rewards-detail-grid">
                  <div className="r-detail-card">
                    <div className="r-card-head">
                      <div className="r-badge-icon" style={{ background: 'rgba(50, 131, 255, 0.15)', color: '#3283ff' }}>🔒</div>
                      <span className="r-tag">STAKING POOL</span>
                    </div>
                    <h3>Staking APY Yield (20%)</h3>
                    <div className="r-amount-large">+200 PTG</div>
                    <p>Earned by locking 1,000 PTG in 90-day auto-compounding pool.</p>
                    <div className="r-footer">
                      <span>Status: Claimable</span>
                      <button className="r-action-btn" onClick={() => alert('Staking details')}>Manage Pool</button>
                    </div>
                  </div>

                  <div className="r-detail-card">
                    <div className="r-card-head">
                      <div className="r-badge-icon" style={{ background: 'rgba(255, 44, 140, 0.15)', color: '#ff2c8c' }}>👥</div>
                      <span className="r-tag">REFERRAL TIER 1</span>
                    </div>
                    <h3>Referral Bonuses</h3>
                    <div className="r-amount-large">+200 PTG</div>
                    <p>4 Active users registered and purchased presale tokens using your link.</p>
                    <div className="r-footer">
                      <span>Status: Claimable</span>
                      <button className="r-action-btn" onClick={() => alert('Referral link copied')}>Copy Link</button>
                    </div>
                  </div>

                  <div className="r-detail-card">
                    <div className="r-card-head">
                      <div className="r-badge-icon" style={{ background: 'rgba(0, 220, 130, 0.15)', color: '#00dc82' }}>🎯</div>
                      <span className="r-tag">BOUNTY QUESTS</span>
                    </div>
                    <h3>Community Quests</h3>
                    <div className="r-amount-large">+50 PTG</div>
                    <p>Awarded for participating in Telegram AMA & Twitter token launch.</p>
                    <div className="r-footer">
                      <span>Status: Completed</span>
                      <button className="r-action-btn" onClick={() => alert('Quests list')}>View Quests</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EARNING HISTORY */}
          {activeTab === 'earnings' && (
            <div className="tab-pane">
              <div className="dash-box">
                <div className="box-header-row">
                  <div>
                    <h2><History size={22} style={{ color: '#8b2bff' }} /> Earning & Transaction History</h2>
                    <p>Detailed breakdown of all your incoming rewards, token purchases, and staking yields.</p>
                  </div>
                  <div className="history-filter-pills">
                    <button className="filter-pill active">All Records</button>
                    <button className="filter-pill">Staking</button>
                    <button className="filter-pill">Referrals</button>
                    <button className="filter-pill">Purchases</button>
                  </div>
                </div>

                <div className="history-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Transaction Type</th>
                        <th>Source / Category</th>
                        <th>Timestamp</th>
                        <th>Amount (PTG)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="tx-type">
                            <span className="dot" style={{ background: '#00dc82' }}></span>
                            <strong>Staking Reward</strong>
                          </div>
                        </td>
                        <td>90-Day Compounding Pool</td>
                        <td>Today, 10:30 AM</td>
                        <td className="tx-val positive">+20.00 PTG</td>
                        <td><span className="st-badge success">Completed</span></td>
                      </tr>

                      <tr>
                        <td>
                          <div className="tx-type">
                            <span className="dot" style={{ background: '#ff2c8c' }}></span>
                            <strong>Referral Bonus</strong>
                          </div>
                        </td>
                        <td>Referral Signup (@user_dev)</td>
                        <td>Yesterday, 04:15 PM</td>
                        <td className="tx-val positive">+50.00 PTG</td>
                        <td><span className="st-badge success">Completed</span></td>
                      </tr>

                      <tr>
                        <td>
                          <div className="tx-type">
                            <span className="dot" style={{ background: '#3283ff' }}></span>
                            <strong>Presale Token Purchase</strong>
                          </div>
                        </td>
                        <td>Stage 2 Presale Direct Swap</td>
                        <td>3 Days ago</td>
                        <td className="tx-val positive">+1,000.00 PTG</td>
                        <td><span className="st-badge success">Completed</span></td>
                      </tr>

                      <tr>
                        <td>
                          <div className="tx-type">
                            <span className="dot" style={{ background: '#8b2bff' }}></span>
                            <strong>Airdrop Distribution</strong>
                          </div>
                        </td>
                        <td>Early Supporter Allocation</td>
                        <td>1 Week ago</td>
                        <td className="tx-val positive">+200.00 PTG</td>
                        <td><span className="st-badge success">Completed</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRESALE TOKEN */}
          {activeTab === 'presale' && (
            <div className="tab-pane">
              <div className="dash-box">
                <div className="box-header-row">
                  <div>
                    <h2><Sparkles size={22} style={{ color: '#ff2c8c' }} /> Presale Token Allocations</h2>
                    <p>Track live presale rounds, monitor price increments, and purchase additional tokens.</p>
                  </div>
                  <span className="status-badge presale-live">🔥 STAGE 2 LIVE</span>
                </div>

                <div className="presale-dashboard-grid">
                  <div className="p-stat-card">
                    <span className="p-lbl">Current Stage Price</span>
                    <span className="p-val">$0.05 / PTG</span>
                    <span className="p-sub">Listing Price: $0.20</span>
                  </div>

                  <div className="p-stat-card">
                    <span className="p-lbl">Next Stage Price</span>
                    <span className="p-val" style={{ color: '#ff2c8c' }}>$0.10 / PTG</span>
                    <span className="p-sub">Price increases in Stage 3</span>
                  </div>

                  <div className="p-stat-card">
                    <span className="p-lbl">Your Presale Holdings</span>
                    <span className="p-val" style={{ color: '#3283ff' }}>1,500 PTG</span>
                    <span className="p-sub">≈ $1,500.00 USD</span>
                  </div>
                </div>

                <div className="presale-progress-box">
                  <div className="progress-top">
                    <div>
                      <strong>Presale Stage 2 Supply</strong>
                      <p>375,000,000 / 500,000,000 PTG Tokens Allocated</p>
                    </div>
                    <span className="perc">75% Sold</span>
                  </div>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="buy-presale-cta-banner" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h3>Want to buy more PTG tokens before Stage 3 price increase?</h3>
                    <p>Secure your tokens now at $0.05 per PTG to maximize your ROI upon exchange listing.</p>
                  </div>
                  <Link href="/#sales" className="primary-gradient-btn" style={{ textDecoration: 'none', margin: '0.8rem auto 0 auto' }}>
                    JOIN TGT ICO - BUY NOW
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ICO TOKENS */}
          {activeTab === 'ico' && (
            <div className="tab-pane">
              <div className="dash-box">
                <div className="box-header-row">
                  <div>
                    <h2><Coins size={22} style={{ color: '#00dc82' }} /> ICO Token Specifications & Contract</h2>
                    <p>Official smart contract details, tokenomics distribution, and holdings metrics.</p>
                  </div>
                  <span className="status-badge active">VERIFIED SMART CONTRACT</span>
                </div>

                <div className="ico-specs-grid">
                  <div className="spec-item">
                    <span className="lbl">Token Name</span>
                    <span className="val">ICOLand Governance Token</span>
                  </div>

                  <div className="spec-item">
                    <span className="lbl">Ticker Symbol</span>
                    <span className="val" style={{ color: '#ff2c8c', fontWeight: 800 }}>PTG</span>
                  </div>

                  <div className="spec-item">
                    <span className="lbl">Token Standard</span>
                    <span className="val">ERC-20 & BEP-20 Dual Chain</span>
                  </div>

                  <div className="spec-item">
                    <span className="lbl">Total Supply</span>
                    <span className="val">500,000,000 PTG</span>
                  </div>

                  <div className="spec-item">
                    <span className="lbl">Unlocked Transferable</span>
                    <span className="val" style={{ color: '#00dc82' }}>1,450 PTG</span>
                  </div>

                  <div className="spec-item">
                    <span className="lbl">Staked Locked Pool</span>
                    <span className="val" style={{ color: '#3283ff' }}>1,000 PTG</span>
                  </div>
                </div>

                <div className="contract-address-box">
                  <h3>Verified Smart Contract Address</h3>
                  <div className="c-addr-row">
                    <code>0x3283ff2c8c991a27e02941b8b2bfe9941ac89914</code>
                    <button
                      className="copy-btn-large"
                      onClick={() => {
                        navigator.clipboard.writeText('0x3283ff2c8c991a27e02941b8b2bfe9941ac89914');
                        setCopiedContract(true);
                        setTimeout(() => setCopiedContract(false), 2000);
                      }}
                    >
                      {copiedContract ? <Check size={16} color="#00dc82" /> : <Copy size={16} />}
                      <span>{copiedContract ? 'Copied' : 'Copy Address'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLogoutModalOpen(false)}>
          <div className="confirm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="logout-warning-icon"><LogOut size={28} /></div>
            <h3>Logout Account</h3>
            <p>Are you sure you want to log out from your ICOLand Portfolio Dashboard?</p>
            <div className="confirm-modal-actions">
              <button className="cancel-btn" onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
              <button className="confirm-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
