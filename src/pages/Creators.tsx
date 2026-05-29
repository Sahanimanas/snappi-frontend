import { useEffect, useRef, useState } from "react";
import { creatorSubmissionsAPI } from "@/lib/api";
import "./Creators.css";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cabinet+Grotesk:wght@700;800;900&display=swap";

const PHRASES = [
  "momfluencer in London",
  "Cape Town fitness creator",
  "foodie with 20K followers",
  "travel creator in Dubai",
  "SA beauty influencer",
  "health influencer in Johannesburg",
];

const NICHE_OPTIONS = [
  "Fashion & Style",
  "Beauty & Skincare",
  "Health & Fitness",
  "Food & Lifestyle",
  "Travel",
  "Tech & Gaming",
  "Business & Finance",
  "Parenting & Family",
  "Entertainment",
  "Education",
  "Sports",
  "Other",
];

const FOLLOWER_OPTIONS = [
  "1K – 10K (Nano)",
  "10K – 50K (Micro)",
  "50K – 200K (Mid-tier)",
  "200K – 1M (Macro)",
  "1M+ (Mega)",
];

const PERKS: Array<{ emoji: string; title: string; body: string }> = [
  {
    emoji: "🔍",
    title: "You get found without lifting a finger",
    body: "Sign up once. Sit in Snappi's AI search permanently. Every time a brand searches your niche and city, your profile comes up. Completely passive.",
  },
  {
    emoji: "💸",
    title: "Real paid campaigns, not just gifting",
    body: "Snappi connects you to brands with real budgets running structured campaigns — not just \"we'll send you a product.\" Your work gets valued properly.",
  },
  {
    emoji: "📄",
    title: "Contracts & briefs handled in-platform",
    body: "No awkward email chains. Brands send professional briefs and contracts through Snappi so every deal is clear, fast and protected — for both sides.",
  },
  {
    emoji: "📊",
    title: "Your niche beats follower count",
    body: "Snappi's AI matches on niche, location and content type — not just numbers. A nano-creator in the right niche will appear ahead of big accounts in the wrong one.",
  },
  {
    emoji: "🌍",
    title: "Local & international brand access",
    body: "Whether you're in Cape Town, Lagos or London — Snappi's brand base spans SMBs worldwide actively looking for authentic creators in specific markets.",
  },
  {
    emoji: "✅",
    title: "Free forever. Zero hidden costs.",
    body: "Listing on Snappi is permanently free for creators. We charge the brands — never creators. Your profile stays live as long as you want it to.",
  },
];

const LOGO_PATH =
  "M13 2L4.09 12.6c-.36.43-.54.65-.55.84a.5.5 0 00.19.41c.15.15.43.15.99.15H12l-1 8.4L20.91 11.4c.36-.43.54-.65.55-.84a.5.5 0 00-.19-.41C21.12 10 20.84 10 20.28 10H13l1-8z";

interface FormState {
  fname: string;
  lname: string;
  email: string;
  location: string;
  handleIg: string;
  handleTt: string;
  handleYt: string;
  handleX: string;
  niche: string;
  followers: string;
}

type FieldKey = keyof FormState;

const initialForm: FormState = {
  fname: "",
  lname: "",
  email: "",
  location: "",
  handleIg: "",
  handleTt: "",
  handleYt: "",
  handleX: "",
  niche: "",
  followers: "",
};

const HANDLE_FIELDS: FieldKey[] = ["handleIg", "handleTt", "handleYt", "handleX"];

const Logo = () => (
  <div className="logo-icon">
    <svg viewBox="0 0 24 24">
      <path d={LOGO_PATH} />
    </svg>
  </div>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const Creators = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [flashing, setFlashing] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const flashTimers = useRef<Partial<Record<FieldKey, ReturnType<typeof setTimeout>>>>({});

  // Toggle body class and load the page-specific font
  useEffect(() => {
    document.body.classList.add("creators-page");
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = FONT_HREF;
    document.head.appendChild(fontLink);
    return () => {
      document.body.classList.remove("creators-page");
      fontLink.remove();
    };
  }, []);

  // Typing animation for the hero AI demo
  useEffect(() => {
    let pi = 0;
    let ci = 0;
    let del = false;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      if (cancelled) return;
      const phrase = PHRASES[pi];
      if (!del) {
        ci++;
        setTypingText(phrase.slice(0, ci));
        if (ci === phrase.length) {
          setShowResults(true);
          timer = setTimeout(() => {
            del = true;
            tick();
          }, 3400);
          return;
        }
      } else {
        ci--;
        setTypingText(phrase.slice(0, ci));
        if (ci === 0) {
          del = false;
          setShowResults(false);
          pi = (pi + 1) % PHRASES.length;
          timer = setTimeout(tick, 350);
          return;
        }
      }
      timer = setTimeout(tick, del ? 36 : 66);
    };

    timer = setTimeout(tick, 1000);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Reveal-on-scroll for .reveal elements within this page
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const parent = entry.target.parentElement;
          const idx = parent
            ? Array.from(parent.children).indexOf(entry.target)
            : 0;
          setTimeout(() => entry.target.classList.add("visible"), idx * 75);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );
    root.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Clean up any pending flash timers on unmount
  useEffect(
    () => () => {
      Object.values(flashTimers.current).forEach((t) => t && clearTimeout(t));
    },
    []
  );

  const set = (field: FieldKey) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const flashField = (field: FieldKey) => {
    setFlashing((p) => ({ ...p, [field]: true }));
    const existing = flashTimers.current[field];
    if (existing) clearTimeout(existing);
    flashTimers.current[field] = setTimeout(() => {
      setFlashing((p) => ({ ...p, [field]: false }));
      flashTimers.current[field] = undefined;
    }, 2500);
  };

  const fieldClass = (field: FieldKey): string | undefined =>
    flashing[field] ? "field-error" : undefined;

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    let valid = true;
    const required: FieldKey[] = ["fname", "email", "niche", "followers"];
    required.forEach((field) => {
      if (!form[field].trim()) {
        flashField(field);
        valid = false;
      }
    });

    const anyHandle = HANDLE_FIELDS.some((field) => form[field].trim() !== "");
    if (!anyHandle) {
      HANDLE_FIELDS.forEach(flashField);
      valid = false;
    }

    if (!valid) return;

    setSubmitting(true);
    try {
      const result = await creatorSubmissionsAPI.create({
        firstName: form.fname.trim(),
        lastName: form.lname.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        handles: {
          instagram: form.handleIg.trim(),
          tiktok: form.handleTt.trim(),
          youtube: form.handleYt.trim(),
          twitter: form.handleX.trim(),
        },
        niche: form.niche.trim(),
        followerCount: form.followers.trim(),
      });
      if (!result.success) {
        throw new Error(result.message || "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      flashField("email");
      const message =
        err instanceof Error ? err.message : "Could not submit. Please try again.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="creators-root" className="creators-root" ref={rootRef}>
      <div className="blob-wrap">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <nav>
        <a className="logo" href="https://www.snappi.vip">
          <Logo />
          <span className="logo-text">Snappi</span>
        </a>
        <span className="nav-badge">✦ For Creators</span>
      </nav>

      <div className="page">
        <div className="top-cta-bar">
          <span className="top-cta-text">
            🚀 Brands are searching Snappi right now —{" "}
            <strong>list your profile free and get found</strong>
          </span>
          <a
            href="#form-card"
            className="top-cta-btn"
            onClick={scrollTo("form-card")}
          >
            Sign Up Free →
          </a>
        </div>

        <section>
          <div className="hero">
            <div className="hero-left">
              <div className="pill-tag">
                <span className="pill-dot" />
                Brands are searching for you right now
              </div>

              <h1>
                Be the creator
                <br />
                brands find <span className="blue">first.</span>
              </h1>

              <p className="hero-sub">
                Snappi's AI search lets brands type exactly who they need —
                and instantly surfaces matching creators. Sign up free and
                make sure <strong>you're</strong> the one they find.
              </p>

              <div className="ai-demo">
                <div className="demo-lbl">
                  ⚡ Live AI search — happening right now
                </div>
                <div className="search-bar">
                  <SearchIcon />
                  <span className="typing-text">{typingText}</span>
                  <span className="cursor" />
                </div>
                {showResults && (
                  <>
                    <div className="demo-results">
                      <div className="result-row">
                        <div className="r-av ra1">SJ</div>
                        <div className="r-info">
                          <div className="r-name">@sarah.fits</div>
                          <div className="r-meta">London · 42K · Fitness</div>
                        </div>
                        <div className="r-badge">98% match</div>
                      </div>
                      <div className="result-row">
                        <div className="r-av ra2">MK</div>
                        <div className="r-info">
                          <div className="r-name">@mum.with.maya</div>
                          <div className="r-meta">
                            London · 28K · Parenting
                          </div>
                        </div>
                        <div className="r-badge">95% match</div>
                      </div>
                      <div className="result-row">
                        <div className="r-av ra3">TL</div>
                        <div className="r-info">
                          <div className="r-name">@tanyalifts</div>
                          <div className="r-meta">London · 61K · Health</div>
                        </div>
                        <div className="r-badge">91% match</div>
                      </div>
                    </div>
                    <div className="demo-cta-note">
                      <span>👆</span>
                      <span>
                        This could be <strong>you</strong>. Every creator who
                        signs up is listed in Snappi's AI search — making you
                        findable by brands actively running campaigns.
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="chips">
                <div className="chip">🎯 Inbound brand deals</div>
                <div className="chip">💸 Real paid campaigns</div>
                <div className="chip">⚡ Free forever</div>
                <div className="chip">📄 Contracts in-platform</div>
                <div className="chip">🌍 Local & global brands</div>
              </div>

              <p className="plat-label">Works across your platforms</p>
              <div className="plat-row">
                <div className="p-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                  Instagram
                </div>
                <div className="p-chip">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z" />
                  </svg>
                  TikTok
                </div>
                <div className="p-chip">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </div>
                <div className="p-chip">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </div>
              </div>
            </div>

            <div className="form-card" id="form-card">
              {submitted ? (
                <div className="success-state">
                  <span className="s-emoji">🎉</span>
                  <p className="s-body">
                    Check your inbox — we've sent you next steps.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="form-hl">List your profile — free</div>
                  <p className="form-sub">
                    2 minutes. No credit card. Get found by brands today.
                  </p>
                  <div className="fgroup">
                    <div className="frow">
                      <div className="field">
                        <label htmlFor="fname">First Name</label>
                        <input
                          type="text"
                          id="fname"
                          placeholder="Alex"
                          autoComplete="given-name"
                          value={form.fname}
                          onChange={set("fname")}
                          className={fieldClass("fname")}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="lname">Last Name</label>
                        <input
                          type="text"
                          id="lname"
                          placeholder="Smith"
                          autoComplete="family-name"
                          value={form.lname}
                          onChange={set("lname")}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={form.email}
                        onChange={set("email")}
                        className={fieldClass("email")}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="location">Your Location</label>
                      <input
                        type="text"
                        id="location"
                        placeholder="e.g. Cape Town, South Africa"
                        value={form.location}
                        onChange={set("location")}
                      />
                    </div>
                    <div className="divider" />
                    <span className="toggle-label toggle-label--tight">
                      Your handles — enter the ones that apply
                    </span>
                    <div className="field">
                      <label htmlFor="handle-ig">Instagram Handle</label>
                      <input
                        type="text"
                        id="handle-ig"
                        placeholder="@yourhandle"
                        autoComplete="off"
                        value={form.handleIg}
                        onChange={set("handleIg")}
                        className={fieldClass("handleIg")}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="handle-tt">TikTok Handle</label>
                      <input
                        type="text"
                        id="handle-tt"
                        placeholder="@yourhandle"
                        autoComplete="off"
                        value={form.handleTt}
                        onChange={set("handleTt")}
                        className={fieldClass("handleTt")}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="handle-yt">YouTube Channel</label>
                      <input
                        type="text"
                        id="handle-yt"
                        placeholder="@yourchannel or channel name"
                        autoComplete="off"
                        value={form.handleYt}
                        onChange={set("handleYt")}
                        className={fieldClass("handleYt")}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="handle-x">X (Twitter) Handle</label>
                      <input
                        type="text"
                        id="handle-x"
                        placeholder="@yourhandle"
                        autoComplete="off"
                        value={form.handleX}
                        onChange={set("handleX")}
                        className={fieldClass("handleX")}
                      />
                    </div>
                    <div className="divider divider--tight" />
                    <div className="frow">
                      <div className="field">
                        <label htmlFor="niche">Your Niche</label>
                        <select
                          id="niche"
                          value={form.niche}
                          onChange={set("niche")}
                          className={fieldClass("niche")}
                        >
                          <option value="" disabled>
                            Select niche
                          </option>
                          {NICHE_OPTIONS.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="followers">Follower Count</label>
                        <select
                          id="followers"
                          value={form.followers}
                          onChange={set("followers")}
                          className={fieldClass("followers")}
                        >
                          <option value="" disabled>
                            Select range
                          </option>
                          {FOLLOWER_OPTIONS.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-cta"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting..."
                      : "Get Listed in AI Search — Free →"}
                  </button>
                  <p className="form-note">
                    Free for creators, always. Only shared with verified
                    brands.
                    <br />
                    By signing up you agree to our <a href="#">Terms</a> &{" "}
                    <a href="#">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="ai-section">
          <div className="ai-inner">
            <div>
              <p className="eyebrow reveal">How the AI search works</p>
              <h2 className="section-hl reveal">
                Brands type.
                <br />
                <span className="blue">You appear.</span>
              </h2>
              <p className="section-body reveal">
                Snappi's AI doesn't work like a filter system. Brands type
                natural phrases — "momfluencer in London", "Cape Town fitness
                creator", "foodie with 20K followers" — and the AI instantly
                surfaces matching creators. The more complete your profile,
                the higher you rank.
              </p>
              <div className="ai-steps">
                <div className="ai-step reveal">
                  <div className="ai-step-num">1</div>
                  <div>
                    <div className="ai-step-title">
                      A brand types what they're looking for
                    </div>
                    <div className="ai-step-body">
                      Natural language. No filters, no dropdowns. They just
                      describe the creator they need in plain words.
                    </div>
                  </div>
                </div>
                <div className="ai-step reveal">
                  <div className="ai-step-num">2</div>
                  <div>
                    <div className="ai-step-title">
                      The AI matches against your profile
                    </div>
                    <div className="ai-step-body">
                      Your niche, location, platform and follower count all
                      determine how you rank. A complete profile = more
                      visibility.
                    </div>
                  </div>
                </div>
                <div className="ai-step reveal">
                  <div className="ai-step-num">3</div>
                  <div>
                    <div className="ai-step-title">
                      The brand reaches out directly
                    </div>
                    <div className="ai-step-body">
                      They send a brief and contract through Snappi. You
                      review, accept, post, get paid. Simple.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="big-demo reveal">
              <div className="big-demo-top">
                <span>⚡</span>
                <span>Snappi AI Search — Brand View</span>
              </div>
              <div className="big-demo-body">
                <div className="demo-search-bar">
                  <SearchIcon />
                  <div className="demo-query">
                    <span className="tag">momfluencer</span> in{" "}
                    <span className="tag">London</span>
                  </div>
                </div>
                <div className="demo-cards">
                  <div className="demo-card">
                    <div className="demo-av da1">SJ</div>
                    <div className="demo-info">
                      <div className="demo-name">
                        @sarah_mumlife · London
                      </div>
                      <div className="demo-meta">
                        Instagram · 38K followers · Parenting
                      </div>
                    </div>
                    <div className="demo-tag">98% match</div>
                  </div>
                  <div className="demo-card">
                    <div className="demo-av da2">PK</div>
                    <div className="demo-info">
                      <div className="demo-name">
                        @mumof3_priya · London
                      </div>
                      <div className="demo-meta">
                        TikTok + Instagram · 22K followers
                      </div>
                    </div>
                    <div className="demo-tag">94% match</div>
                  </div>
                  <div className="demo-card">
                    <div className="demo-av da3">RL</div>
                    <div className="demo-info">
                      <div className="demo-name">
                        @realmumlondon · London
                      </div>
                      <div className="demo-meta">
                        YouTube · 55K followers · Family
                      </div>
                    </div>
                    <div className="demo-tag">91% match</div>
                  </div>
                </div>
                <div className="demo-caption">
                  ← Exactly what a brand sees. Will your profile be here?
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="perks">
          <div className="perks-inner">
            <p className="eyebrow reveal">Why creators choose Snappi</p>
            <h2 className="section-hl reveal">
              Everything working
              <br />
              in your favour
            </h2>
            <div className="perks-grid">
              {PERKS.map((perk) => (
                <div key={perk.title} className="perk-card reveal">
                  <span className="perk-emoji">{perk.emoji}</span>
                  <div className="perk-title">{perk.title}</div>
                  <p className="perk-body">{perk.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-inner">
            <div className="banner reveal">
              <div className="banner-hl">
                Brands are searching.
                <br />
                Make sure they find you.
              </div>
              <p className="banner-body">
                Join Snappi's creator index for free. 2 minutes to sign up.
                The next brand deal could come from a search happening right
                now.
              </p>
              <a
                href="#form-card"
                className="btn-white"
                onClick={scrollTo("form-card")}
              >
                Get Listed in AI Search — Free →
              </a>
            </div>
          </div>
        </section>

        <footer>
          <a className="logo" href="https://www.snappi.vip">
            <Logo />
            <span className="logo-text">Snappi</span>
          </a>
          <span className="footer-copy">
            © 2026 Snappi. All rights reserved. ·{" "}
            <a href="https://www.snappi.vip">snappi.vip</a>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default Creators;
