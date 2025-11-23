import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Top Bar */}
            <div className="landing-topbar">
                <div className="landing-logo">
                    <span className="logo-emoji">💼</span>
                    <span className="logo-text">PORTAL EMPLEO</span>
                </div>
                <div className="landing-auth-buttons">
                    <button
                        className="btn-topbar-login"
                        onClick={() => navigate('/login')}
                    >
                        Log In
                    </button>
                    <button
                        className="btn-topbar-signup"
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="landing-hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-emoji">🚀</span>
                        <span className="badge-text">Find Your Dream Job</span>
                    </div>

                    <h1 className="hero-title">
                        Your Next
                        <span className="hero-title-highlight"> Career Move </span>
                        Starts Here
                    </h1>

                    <p className="hero-description">
                        Discover thousands of opportunities from top companies.
                        Bold design, bold careers. Let's make it happen! 💪
                    </p>

                    <div className="hero-cta">
                        <button
                            className="btn-start-browsing"
                            onClick={() => navigate('/browse')}
                        >
                            <span className="btn-icon">🔍</span>
                            Start Browsing Jobs
                        </button>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">1000+</span>
                                <span className="stat-label">Active Jobs</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Companies</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">5000+</span>
                                <span className="stat-label">Happy Hires</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="hero-decorations">
                    <div className="deco-card deco-card-1">
                        <span className="deco-emoji">💻</span>
                        <span className="deco-text">Tech Jobs</span>
                    </div>
                    <div className="deco-card deco-card-2">
                        <span className="deco-emoji">🎨</span>
                        <span className="deco-text">Creative</span>
                    </div>
                    <div className="deco-card deco-card-3">
                        <span className="deco-emoji">📊</span>
                        <span className="deco-text">Business</span>
                    </div>
                    <div className="deco-card deco-card-4">
                        <span className="deco-emoji">🔬</span>
                        <span className="deco-text">Science</span>
                    </div>

                    {/* Floating shapes */}
                    <div className="floating-shape shape-1"></div>
                    <div className="floating-shape shape-2"></div>
                    <div className="floating-shape shape-3"></div>
                    <div className="floating-shape shape-4"></div>
                </div>
            </div>

            {/* Features Section */}
            <div className="landing-features">
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3 className="feature-title">Lightning Fast</h3>
                    <p className="feature-description">Apply to jobs in seconds with our streamlined process</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3 className="feature-title">Perfect Match</h3>
                    <p className="feature-description">Smart algorithms find jobs that fit your skills</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🌟</div>
                    <h3 className="feature-title">Top Companies</h3>
                    <p className="feature-description">Connect with leading employers worldwide</p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
