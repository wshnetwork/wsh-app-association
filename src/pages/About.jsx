import { useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PhoneOverrideProvider } from "./about/PhoneOverrideContext";
import PhoneStage from "./about/PhoneStage";
import HoverImageItem from "./about/HoverImageItem";
import CategoriesRing from "./about/CategoriesRing";
import useHeaderTheme from "./about/useHeaderTheme";

import "../styles/main.css";
import "../styles/about.css";
import "../styles/categories.css";
import "../styles/phone.css";

const NAV_LINKS = [
  { label: "The Problem", href: "#problem" },
  { label: "Our Solution", href: "#solution" },
  { label: "Identity", href: "#identity" },
  { label: "Categories", href: "#categories" },
  { label: "Moderation", href: "#moderation" },
  { label: "Value", href: "#value" },
  { label: "Legal", href: "/docs/" },
  { label: "Download ↗", href: "/download/", external: true },
];

function AboutContent() {
  const headerRef = useRef(null);
  const dark = useHeaderTheme(headerRef);

  // Smooth scroll for in-page anchor links, ported from the original
  // inline script at the bottom of about/index.html.
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <Header ref={headerRef} navLinks={NAV_LINKS} dark={dark} />

      <section className="hero">
        <div className="container disable-select">
          <img src="/assets/img/wsh-white-2.svg" alt="WSH Logo" />
          <h1>WSH</h1>
          <p className="tagline">The First Student Social Network</p>
          <p className="subtitle">Your uni, your thoughts, your voice. Unfiltered.</p>
          <a href="#problem" className="btn">Learn More</a>
        </div>
      </section>

      <div id="sections-wrapper">
        <PhoneStage />

        {/* Problem Section */}
        <section id="problem" className="problem section-black disable-select">
          <div className="container">
            <div className="problem-grid">
              <div>
                <h2>The Problem</h2>
                <h3>No Way to Connect</h3>
                <p>
                  Currently, there is no easy or centralized way for students to
                  reach their fellow students within a university. Students rely on
                  scattered, unofficial channels like WhatsApp groups, Instagram
                  stories, or mass emails.
                </p>
                <p>These channels are fragmented, hard to navigate, and limited to small circles.</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <img src="/assets/img/screenshots/welcome.jpeg" alt="WSH Welcome Screen" />
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="solution section-white disable-select">
          <div className="container">
            <h2>Our Solution</h2>
            <h3>WSH - Where Stuff Happens</h3>
            <div className="solution-grid">
              <div>
                <p>
                  WSH is a private, <strong>school-centered</strong> social media
                  platform designed <strong>exclusively for university students</strong>.
                  It offers a secure environment where students can engage in
                  discussions, share content, and connect with peers within their
                  university community.
                </p>
                <div className="feature-boxes">
                  <HoverImageItem
                    className="feature-box action-item solution-item"
                    image="/assets/img/screenshots/school-select.PNG"
                  >
                    University-specific networks
                  </HoverImageItem>
                  <HoverImageItem
                    className="feature-box action-item solution-item"
                    image="/assets/img/screenshots/feed.jpg"
                  >
                    Real-time student connections
                  </HoverImageItem>
                  <HoverImageItem
                    className="feature-box action-item solution-item"
                    image="/assets/img/screenshots/report.PNG"
                  >
                    Safe and moderated environment
                  </HoverImageItem>
                </div>
              </div>
              <div className="screenshots">
                <div className="screenshot-container">
                  <img src="/assets/img/screenshots/feed.jpg" alt="WSH Main Feed" />
                </div>
                <div className="screenshot-container">
                  <img src="/assets/img/screenshots/feed2.PNG" alt="WSH Categories" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Identity Section */}
        <section id="identity" className="section section-black disable-select">
          <div className="container">
            <div className="identity-layout">
              <div className="identity-image-wrap">
                <img
                  src="/assets/img/screenshots/id-select.PNG"
                  alt="WSH Identity Options"
                  className="identity-phone"
                />
              </div>
              <div>
                <h2>You Choose How You Show Up</h2>
                <div className="identity-options">
                  <HoverImageItem
                    className="identity-item action-item border-red"
                    image="/assets/img/screenshots/id-handle.PNG"
                  >
                    <h3>Handle</h3>
                    <p>Your unique username. Build your reputation over time.</p>
                  </HoverImageItem>
                  <HoverImageItem
                    className="identity-item action-item border-purple"
                    image="/assets/img/screenshots/id-alias.PNG"
                  >
                    <h3>Alias</h3>
                    <p>A reusable temporary name for contextual posting.</p>
                  </HoverImageItem>
                  <HoverImageItem
                    className="identity-item action-item border-gray"
                    image="/assets/img/screenshots/id-anon.PNG"
                  >
                    <h3>Anonymous</h3>
                    <p>
                      Post without your name. Pure freedom of expression, taking
                      away social pressure.
                    </p>
                  </HoverImageItem>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="categories section section-white">
          <div className="container">
            <h2>Post Categories</h2>
            <h3>Organized Content</h3>
            <p style={{ textAlign: "center", marginBottom: "2rem", color: "rgba(0, 0, 0, 0.6)" }}>
              Posts can be organized into categories by users, and users can browse
              these specific categories to find relevant content.
            </p>
            <CategoriesRing />
          </div>
        </section>

        {/* Moderation Section */}
        <section id="moderation" className="moderation section section-black">
          <div className="container">
            <div className="text-center mb-md">
              <h2>Moderation System</h2>
              <h3 className="section-sub">Safety First</h3>
              <p className="lead">
                Our moderation approach is built on two complementary layers:
                AI-powered moderation as the first line of defense, and Student
                Moderators for community-driven oversight.
              </p>
            </div>
            <div className="mod-grid">
              <HoverImageItem className="action-item mod-card" image="/assets/img/screenshots/mod-view.PNG">
                OpenAI content filtering + WebPurify AI image moderation
              </HoverImageItem>
              <HoverImageItem className="action-item mod-card" image="/assets/img/screenshots/mod-vote.PNG">
                Student moderator community with local context
              </HoverImageItem>
              <HoverImageItem className="action-item mod-card" image="/assets/img/screenshots/mod-history.PNG">
                Real-time content review
              </HoverImageItem>
              <HoverImageItem className="action-item mod-card" image="/assets/img/screenshots/report.PNG">
                One-email-per-student security system
              </HoverImageItem>
            </div>
            <p className="mod-note">
              Each student holds only one school email address. If a user is
              permanently banned, they cannot rejoin the platform.
            </p>
          </div>
        </section>

        {/* Value Section */}
        <section id="value" className="value section section-white">
          <div className="container">
            <div className="text-center mb-lg">
              <h2>The Value</h2>
              <h3 className="section-sub">Building Community</h3>
              <p className="lead">
                The core value is providing an online space where students can
                freely express themselves in a space designed for them, without the
                pressures of traditional social media.
              </p>
            </div>
            <div className="value-grid">
              <HoverImageItem className="feature-card action-item" image="/assets/img/screenshots/cat-advice.PNG">
                Connect with peers from your university
              </HoverImageItem>
              <HoverImageItem className="feature-card action-item" image="/assets/img/screenshots/cat-announce.PNG">
                Stay updated with school news and events
              </HoverImageItem>
              <HoverImageItem className="feature-card action-item" image="/assets/img/screenshots/cat-conf.PNG">
                Reach students across all years and campuses
              </HoverImageItem>
              <HoverImageItem className="feature-card action-item" image="/assets/img/screenshots/cat-event.PNG">
                Foster authentic community engagement
              </HoverImageItem>
              <HoverImageItem className="feature-card action-item" image="/assets/img/screenshots/cat-quest.PNG">
                Exchange ideas and academic help
              </HoverImageItem>
              <HoverImageItem className="feature-card action-item" image="/assets/img/screenshots/cat-life.PNG">
                Share social experiences without pressure
              </HoverImageItem>
            </div>
          </div>
        </section>

        {/* Independence Section */}
        <section id="independence" className="section section-black">
          <div className="container text-center">
            <h2>Platform Independence</h2>
            <h3 className="section-sub">Not Affiliated with Schools</h3>
            <p className="lead">
              WSH is NOT affiliated with any school and operates as its own
              platform, just like any other social media. The platform is still in
              its early days, and students are lucky to witness it early on and have
              a chance to make it great.
            </p>
            <p className="lead mt-md">
              We expect feedback from users early on to make the app better through
              new features and improvements.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default function About() {
  return (
    <PhoneOverrideProvider>
      <AboutContent />
    </PhoneOverrideProvider>
  );
}
