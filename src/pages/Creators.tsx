import { useEffect } from "react";
import { creatorSubmissionsAPI } from "@/lib/api";

const STYLES = `
  :root {
    --blue:        #3b6ff0;
    --blue-dark:   #2a54c8;
    --blue-light:  #dce8ff;
    --blue-xlight: #eef3ff;
    --bg:          #f0f2f8;
    --white:       #ffffff;
    --black:       #0f1117;
    --gray-1:      #374151;
    --gray-2:      #6b7280;
    --gray-3:      #9ca3af;
    --gray-border: #e2e8f0;
  }

  body.creators-page, body.creators-page *, body.creators-page *::before, body.creators-page *::after { box-sizing: border-box; }
  body.creators-page { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--black); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  body.creators-page { scroll-behavior: smooth; }

  .creators-root .blob-wrap { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .creators-root .blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.18; animation: creators-drift 20s ease-in-out infinite alternate; }
  .creators-root .blob-1 { width: 560px; height: 560px; background: #3b6ff0; top: -200px; left: -150px; }
  .creators-root .blob-2 { width: 420px; height: 420px; background: #60a5fa; bottom: -80px; right: -100px; animation-delay: -8s; }
  .creators-root .blob-3 { width: 280px; height: 280px; background: #93c5fd; top: 45%; left: 38%; animation-delay: -14s; }
  @keyframes creators-drift { from{transform:translate(0,0) scale(1)} to{transform:translate(28px,36px) scale(1.07)} }

  .creators-root nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 60px;
    background: rgba(240,242,248,0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.8);
  }
  .creators-root .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .creators-root .logo-icon {
    width: 30px; height: 30px; border-radius: 7px; background: var(--blue);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .creators-root .logo-icon svg { width: 15px; height: 15px; fill: white; }
  .creators-root .logo-text { font-family: 'Inter',sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--blue); letter-spacing: -0.02em; }
  .creators-root .nav-badge {
    background: var(--blue-xlight); color: var(--blue);
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 100px; border: 1px solid var(--blue-light); white-space: nowrap;
  }

  .creators-root .page { position: relative; z-index: 1; }

  .creators-root .top-cta-bar {
    background: var(--blue); position: relative; z-index: 1;
    margin-top: 60px;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: center;
    gap: 16px; flex-wrap: wrap;
    box-shadow: 0 4px 20px rgba(59,111,240,0.3);
  }
  .creators-root .top-cta-text { font-size: 0.88rem; color: rgba(255,255,255,0.92); line-height: 1.4; }
  .creators-root .top-cta-text strong { color: white; }
  .creators-root .top-cta-btn {
    display: inline-flex; align-items: center;
    padding: 9px 22px; background: white; color: var(--blue);
    border-radius: 100px; font-family: 'Cabinet Grotesk','Inter',sans-serif;
    font-size: 0.85rem; font-weight: 900; text-decoration: none; white-space: nowrap;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    flex-shrink: 0;
  }
  .creators-root .top-cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }

  .creators-root .hero {
    max-width: 1200px; margin: 0 auto;
    padding: 52px 24px 56px;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 48px; align-items: start;
  }
  .creators-root .hero-left { padding-top: 8px; }

  .creators-root .pill-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: white; border: 1px solid var(--gray-border);
    border-radius: 100px; padding: 7px 16px;
    font-size: 0.77rem; font-weight: 600; color: var(--blue);
    margin-bottom: 22px; box-shadow: 0 1px 4px rgba(59,111,240,0.1);
    opacity: 0; animation: creators-fadeUp 0.6s 0.1s ease forwards;
  }
  .creators-root .pill-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,0.25); animation: creators-blink 2s ease infinite; }
  @keyframes creators-blink { 0%,100%{opacity:1} 50%{opacity:0.35} }

  .creators-root h1 {
    font-family: 'Cabinet Grotesk','Inter',sans-serif;
    font-size: clamp(2.2rem, 4vw, 3.6rem);
    font-weight: 900; line-height: 1.06; letter-spacing: -0.03em;
    color: var(--black); margin-bottom: 18px;
    opacity: 0; animation: creators-fadeUp 0.6s 0.22s ease forwards;
  }
  .creators-root h1 .blue { color: var(--blue); }

  .creators-root .hero-sub {
    font-size: 1rem; line-height: 1.75; color: var(--gray-2);
    margin-bottom: 28px; max-width: 460px;
    opacity: 0; animation: creators-fadeUp 0.6s 0.35s ease forwards;
  }

  .creators-root .ai-demo {
    background: white; border: 1.5px solid var(--gray-border);
    border-radius: 20px; padding: 20px 22px; margin-bottom: 26px;
    box-shadow: 0 8px 28px rgba(59,111,240,0.1);
    position: relative; overflow: hidden;
    opacity: 0; animation: creators-fadeUp 0.6s 0.48s ease forwards;
  }
  .creators-root .ai-demo::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg,var(--blue),#60a5fa,#818cf8,var(--blue));
    background-size: 200%; animation: creators-shimmer 3s linear infinite;
  }
  @keyframes creators-shimmer { from{background-position:0%} to{background-position:200%} }

  .creators-root .demo-lbl {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--blue); margin-bottom: 12px;
  }
  .creators-root .search-bar {
    display: flex; align-items: center; gap: 10px;
    background: var(--bg); border: 1.5px solid var(--blue-light);
    border-radius: 11px; padding: 10px 14px; margin-bottom: 14px;
  }
  .creators-root .search-bar svg { width: 15px; height: 15px; color: var(--blue); flex-shrink: 0; }
  .creators-root .typing-text { font-size: 0.86rem; font-weight: 500; color: var(--gray-1); flex: 1; overflow: hidden; white-space: nowrap; }
  .creators-root .cursor { display: inline-block; width: 2px; height: 13px; background: var(--blue); border-radius: 1px; animation: creators-cur 0.8s ease infinite; vertical-align: middle; margin-left: 1px; }
  @keyframes creators-cur { 0%,100%{opacity:1} 50%{opacity:0} }

  .creators-root .demo-results { display: flex; flex-direction: column; gap: 7px; }
  .creators-root .result-row {
    display: flex; align-items: center; gap: 10px;
    background: var(--blue-xlight); border-radius: 10px; padding: 8px 11px;
    opacity: 0; animation: creators-slideIn 0.4s ease forwards;
  }
  .creators-root .result-row:nth-child(1){animation-delay:1.3s}
  .creators-root .result-row:nth-child(2){animation-delay:1.65s}
  .creators-root .result-row:nth-child(3){animation-delay:2s}
  @keyframes creators-slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
  .creators-root .r-av { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; color: white; flex-shrink: 0; }
  .creators-root .ra1{background:linear-gradient(135deg,#f97316,#fb923c)}
  .creators-root .ra2{background:linear-gradient(135deg,#8b5cf6,#a78bfa)}
  .creators-root .ra3{background:linear-gradient(135deg,#06b6d4,#22d3ee)}
  .creators-root .r-info { flex: 1; }
  .creators-root .r-name { font-size: 0.78rem; font-weight: 700; color: var(--black); line-height: 1.2; }
  .creators-root .r-meta { font-size: 0.68rem; color: var(--gray-2); }
  .creators-root .r-badge { font-size: 0.63rem; font-weight: 700; color: var(--blue); background: var(--blue-light); border-radius: 5px; padding: 3px 7px; white-space: nowrap; }
  .creators-root .demo-cta-note {
    margin-top: 12px; font-size: 0.77rem; font-weight: 600; color: var(--blue);
    display: none; align-items: flex-start; gap: 6px; line-height: 1.5;
  }

  .creators-root .chips {
    display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;
    opacity: 0; animation: creators-fadeUp 0.6s 0.6s ease forwards;
  }
  .creators-root .chip {
    display: flex; align-items: center; gap: 6px;
    background: white; border: 1.5px solid var(--gray-border);
    border-radius: 100px; padding: 7px 13px;
    font-size: 0.78rem; font-weight: 600; color: var(--gray-1);
    transition: border-color 0.2s, transform 0.2s;
  }
  .creators-root .chip:hover { border-color: var(--blue); transform: translateY(-2px); }

  .creators-root .plat-label { font-size: 0.67rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-3); margin-bottom: 10px; opacity: 0; animation: creators-fadeUp 0.6s 0.72s ease forwards; }
  .creators-root .plat-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; opacity: 0; animation: creators-fadeUp 0.6s 0.82s ease forwards; }
  .creators-root .p-chip { display: flex; align-items: center; gap: 6px; background: white; border: 1.5px solid var(--gray-border); border-radius: 10px; padding: 7px 12px; font-size: 0.77rem; font-weight: 600; color: var(--gray-1); transition: all 0.2s; }
  .creators-root .p-chip:hover { border-color: var(--blue); color: var(--blue); }
  .creators-root .p-chip svg { width: 13px; height: 13px; }

  .creators-root .form-card {
    background: white; border-radius: 24px; padding: 38px 34px;
    box-shadow: 0 20px 60px rgba(59,111,240,0.15);
    border: 1px solid rgba(255,255,255,0.9);
    position: relative; overflow: hidden;
    opacity: 0; animation: creators-fadeIn 0.8s 0.25s ease forwards;
  }
  .creators-root .form-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg,var(--blue),#60a5fa,#818cf8,var(--blue));
    background-size: 200%; animation: creators-shimmer 3s linear infinite;
  }
  .creators-root .form-hl { font-family:'Cabinet Grotesk','Inter',sans-serif; font-size: 1.4rem; font-weight: 900; letter-spacing: -0.02em; color: var(--black); margin-bottom: 4px; }
  .creators-root .form-sub { font-size: 0.83rem; color: var(--gray-2); margin-bottom: 24px; }

  .creators-root .fgroup { display: flex; flex-direction: column; gap: 12px; }
  .creators-root .frow { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .creators-root .field { display: flex; flex-direction: column; gap: 5px; }
  .creators-root label { font-size: 0.67rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--gray-2); }

  .creators-root input, .creators-root select {
    background: var(--bg); border: 1.5px solid var(--gray-border);
    border-radius: 10px; padding: 11px 13px;
    font-family: 'Inter',sans-serif; font-size: 0.87rem; font-weight: 500;
    color: var(--black); width: 100%; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
  }
  .creators-root input::placeholder { color: var(--gray-3); font-weight: 400; }
  .creators-root input:focus, .creators-root select:focus { border-color: var(--blue); background: white; box-shadow: 0 0 0 3px rgba(59,111,240,0.1); }
  .creators-root select { cursor: pointer; }
  .creators-root select option { background: white; }

  .creators-root .divider { height: 1px; background: var(--gray-border); margin: 16px 0; }

  .creators-root .toggle-label { font-size: 0.67rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--gray-2); display: block; margin-bottom: 9px; }

  .creators-root .btn-cta {
    width: 100%; padding: 16px 24px; background: var(--blue);
    border: none; border-radius: 13px;
    font-family: 'Cabinet Grotesk','Inter',sans-serif;
    font-size: 1.02rem; font-weight: 900; letter-spacing: -0.01em;
    color: white; cursor: pointer; margin-top: 8px;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 6px 20px rgba(59,111,240,0.38);
    position: relative; overflow: hidden;
  }
  .creators-root .btn-cta::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(255,255,255,0.14),transparent); pointer-events: none; }
  .creators-root .btn-cta:hover { background: var(--blue-dark); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(59,111,240,0.44); }
  .creators-root .btn-cta:active { transform: translateY(0); }

  .creators-root .form-note { font-size: 0.69rem; color: var(--gray-3); text-align: center; margin-top: 12px; line-height: 1.6; }
  .creators-root .form-note a { color: var(--blue); text-decoration: none; }

  .creators-root .success-state { display: none; text-align: center; padding: 28px 0; }
  .creators-root .s-emoji { font-size: 3rem; margin-bottom: 14px; animation: creators-pop 0.5s ease; display: block; }
  @keyframes creators-pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
  .creators-root .s-title { font-family:'Cabinet Grotesk','Inter',sans-serif; font-size: 1.5rem; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 10px; }
  .creators-root .s-body { font-size: 1.25rem; color: var(--blue); line-height: 1.5; font-weight: 700; }
  .creators-root .s-body strong { color: var(--blue); }

  .creators-root .ai-section { position: relative; z-index: 1; padding: 86px 24px; max-width: 1200px; margin: 0 auto; }
  .creators-root .ai-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }

  .creators-root .eyebrow { font-size: 0.69rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); display: flex; align-items: center; gap: 8px; margin-bottom: 11px; }
  .creators-root .eyebrow::before { content:''; width: 18px; height: 2px; background: var(--blue); border-radius: 2px; }

  .creators-root .section-hl { font-family:'Cabinet Grotesk','Inter',sans-serif; font-size: clamp(1.8rem,3vw,2.6rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; color: var(--black); margin-bottom: 14px; }
  .creators-root .section-hl .blue { color: var(--blue); }
  .creators-root .section-body { font-size: 0.93rem; color: var(--gray-2); line-height: 1.75; margin-bottom: 26px; }

  .creators-root .ai-steps { display: flex; flex-direction: column; gap: 14px; }
  .creators-root .ai-step { display: flex; gap: 13px; align-items: flex-start; background: white; border: 1.5px solid var(--gray-border); border-radius: 13px; padding: 15px 17px; transition: border-color 0.2s, box-shadow 0.2s; }
  .creators-root .ai-step:hover { border-color: var(--blue); box-shadow: 0 4px 14px rgba(59,111,240,0.1); }
  .creators-root .ai-step-num { width: 30px; height: 30px; border-radius: 50%; background: var(--blue); display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; color: white; flex-shrink: 0; }
  .creators-root .ai-step-title { font-size: 0.86rem; font-weight: 700; color: var(--black); margin-bottom: 2px; }
  .creators-root .ai-step-body { font-size: 0.78rem; color: var(--gray-2); line-height: 1.55; }

  .creators-root .big-demo { background: white; border-radius: 22px; border: 1.5px solid var(--gray-border); box-shadow: 0 16px 48px rgba(59,111,240,0.12); overflow: hidden; }
  .creators-root .big-demo-top { background: var(--blue); padding: 16px 22px; display: flex; align-items: center; gap: 7px; }
  .creators-root .big-demo-top span { font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.85); }
  .creators-root .big-demo-body { padding: 18px 22px; }
  .creators-root .demo-search-bar { display: flex; align-items: center; gap: 10px; background: var(--bg); border: 1.5px solid var(--blue-light); border-radius: 11px; padding: 11px 14px; margin-bottom: 18px; }
  .creators-root .demo-search-bar svg { width: 15px; height: 15px; color: var(--blue); flex-shrink: 0; }
  .creators-root .demo-query { font-size: 0.87rem; font-weight: 600; color: var(--black); flex: 1; }
  .creators-root .demo-query .tag { color: var(--blue); background: var(--blue-xlight); border-radius: 4px; padding: 1px 5px; }
  .creators-root .demo-cards { display: flex; flex-direction: column; gap: 9px; }
  .creators-root .demo-card { display: flex; align-items: center; gap: 11px; border: 1.5px solid var(--gray-border); border-radius: 11px; padding: 11px 13px; transition: border-color 0.2s; }
  .creators-root .demo-card:hover { border-color: var(--blue); }
  .creators-root .demo-av { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 800; color: white; flex-shrink: 0; }
  .creators-root .da1{background:linear-gradient(135deg,#f97316,#fb923c)}
  .creators-root .da2{background:linear-gradient(135deg,#8b5cf6,#a78bfa)}
  .creators-root .da3{background:linear-gradient(135deg,#06b6d4,#22d3ee)}
  .creators-root .demo-info { flex: 1; }
  .creators-root .demo-name { font-size: 0.82rem; font-weight: 700; color: var(--black); margin-bottom: 2px; }
  .creators-root .demo-meta { font-size: 0.7rem; color: var(--gray-2); }
  .creators-root .demo-tag { font-size: 0.65rem; font-weight: 700; color: var(--blue); background: var(--blue-xlight); border-radius: 6px; padding: 4px 8px; }
  .creators-root .demo-caption { margin-top: 13px; font-size: 0.73rem; color: var(--gray-3); text-align: center; font-style: italic; }

  .creators-root .perks { background: white; border-top: 1px solid var(--gray-border); border-bottom: 1px solid var(--gray-border); padding: 86px 24px; position: relative; z-index: 1; }
  .creators-root .perks-inner { max-width: 1200px; margin: 0 auto; }
  .creators-root .perks-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-top: 48px; }
  .creators-root .perk-card { background: var(--bg); border: 1.5px solid var(--gray-border); border-radius: 18px; padding: 26px; transition: all 0.25s; }
  .creators-root .perk-card:hover { border-color: var(--blue); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(59,111,240,0.1); }
  .creators-root .perk-emoji { font-size: 1.75rem; margin-bottom: 13px; display: block; }
  .creators-root .perk-title { font-size: 0.91rem; font-weight: 700; color: var(--black); margin-bottom: 7px; letter-spacing: -0.01em; }
  .creators-root .perk-body { font-size: 0.81rem; color: var(--gray-2); line-height: 1.7; }

  .creators-root .final-cta { position: relative; z-index: 1; padding: 86px 24px; }
  .creators-root .final-inner { max-width: 1200px; margin: 0 auto; }
  .creators-root .banner { background: var(--blue); border-radius: 26px; padding: 60px 44px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 24px 64px rgba(59,111,240,0.25); }
  .creators-root .banner::before { content:''; position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse 50% 70% at 5% 50%,rgba(255,255,255,0.1),transparent), radial-gradient(ellipse 40% 60% at 95% 10%,rgba(255,255,255,0.07),transparent); }
  .creators-root .banner::after { content:''; position:absolute; width:340px; height:340px; border-radius:50%; border:1px solid rgba(255,255,255,0.1); bottom:-140px; right:-70px; pointer-events:none; }
  .creators-root .banner-hl { font-family:'Cabinet Grotesk','Inter',sans-serif; font-size: clamp(1.7rem,3.5vw,2.7rem); font-weight: 900; letter-spacing: -0.03em; color: white; margin-bottom: 13px; line-height: 1.1; position: relative; z-index: 1; }
  .creators-root .banner-body { font-size: 0.95rem; color: rgba(255,255,255,0.75); line-height: 1.75; max-width: 440px; margin: 0 auto 30px; position: relative; z-index: 1; }
  .creators-root .btn-white { display: inline-flex; align-items: center; gap: 8px; padding: 15px 34px; background: white; color: var(--blue); border: none; border-radius: 13px; font-family:'Cabinet Grotesk','Inter',sans-serif; font-size: 0.98rem; font-weight: 900; cursor: pointer; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 6px 20px rgba(0,0,0,0.15); position: relative; z-index: 1; }
  .creators-root .btn-white:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(0,0,0,0.2); }

  .creators-root footer { position: relative; z-index: 1; border-top: 1px solid var(--gray-border); padding: 26px 24px; display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; }
  .creators-root .footer-copy { font-size: 0.73rem; color: var(--gray-3); }
  .creators-root .footer-copy a { color: var(--blue); text-decoration: none; }

  @keyframes creators-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes creators-fadeIn { from{opacity:0} to{opacity:1} }
  .creators-root .reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.55s ease, transform 0.55s ease; }
  .creators-root .reveal.visible { opacity: 1; transform: none; }

  @media (max-width: 880px) {
    .creators-root .top-cta-bar { flex-direction: column; gap: 10px; text-align: center; padding: 14px 16px; }
    .creators-root .hero { grid-template-columns: 1fr; padding: 32px 16px 44px; gap: 32px; }
    .creators-root .hero-left { padding-top: 0; }
    .creators-root .ai-inner { grid-template-columns: 1fr; gap: 32px; }
    .creators-root .big-demo { order: -1; }
    .creators-root .perks-grid { grid-template-columns: 1fr 1fr; }
    .creators-root .banner { padding: 44px 22px; }
    .creators-root footer { flex-direction: column; gap: 10px; text-align: center; }
  }

  @media (max-width: 580px) {
    .creators-root h1 { font-size: 2.1rem; }
    .creators-root .perks-grid { grid-template-columns: 1fr; }
    .creators-root .frow { grid-template-columns: 1fr; }
    .creators-root .form-card { padding: 26px 18px; }
    .creators-root .banner { padding: 36px 18px; }
    .creators-root .final-cta, .creators-root .perks, .creators-root .ai-section { padding: 56px 16px; }
    .creators-root .ai-demo { padding: 16px; }
    .creators-root nav { padding: 0 14px; }
    .creators-root .nav-badge { font-size: 0.62rem; padding: 4px 10px; }
  }
`;

const BODY_HTML = `
<div class="blob-wrap">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>
</div>

<nav>
  <a class="logo" href="https://www.snappi.vip">
    <div class="logo-icon">
      <svg viewBox="0 0 24 24"><path d="M13 2L4.09 12.6c-.36.43-.54.65-.55.84a.5.5 0 00.19.41c.15.15.43.15.99.15H12l-1 8.4L20.91 11.4c.36-.43.54-.65.55-.84a.5.5 0 00-.19-.41C21.12 10 20.84 10 20.28 10H13l1-8z"/></svg>
    </div>
    <span class="logo-text">Snappi</span>
  </a>
  <span class="nav-badge">✦ For Creators</span>
</nav>

<div class="page">

<div class="top-cta-bar">
    <span class="top-cta-text">🚀 Brands are searching Snappi right now — <strong>list your profile free and get found</strong></span>
    <a href="#form-card" class="top-cta-btn" data-scroll-to="form-card">Sign Up Free →</a>
  </div>

  <section>
    <div class="hero">
      <div class="hero-left">

        <div class="pill-tag">
          <span class="pill-dot"></span>
          Brands are searching for you right now
        </div>

        <h1>Be the creator<br>brands find <span class="blue">first.</span></h1>

        <p class="hero-sub">
          Snappi's AI search lets brands type exactly who they need — and instantly surfaces matching creators. Sign up free and make sure <strong>you're</strong> the one they find.
        </p>

        <div class="ai-demo">
          <div class="demo-lbl">⚡ Live AI search — happening right now</div>
          <div class="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span class="typing-text" id="typing-text"></span><span class="cursor"></span>
          </div>
          <div class="demo-results" id="demo-results" style="display:none">
            <div class="result-row">
              <div class="r-av ra1">SJ</div>
              <div class="r-info"><div class="r-name">@sarah.fits</div><div class="r-meta">London · 42K · Fitness</div></div>
              <div class="r-badge">98% match</div>
            </div>
            <div class="result-row">
              <div class="r-av ra2">MK</div>
              <div class="r-info"><div class="r-name">@mum.with.maya</div><div class="r-meta">London · 28K · Parenting</div></div>
              <div class="r-badge">95% match</div>
            </div>
            <div class="result-row">
              <div class="r-av ra3">TL</div>
              <div class="r-info"><div class="r-name">@tanyalifts</div><div class="r-meta">London · 61K · Health</div></div>
              <div class="r-badge">91% match</div>
            </div>
          </div>
          <div class="demo-cta-note" id="demo-cta">
            <span>👆</span>
            <span>This could be <strong>you</strong>. Every creator who signs up is listed in Snappi's AI search — making you findable by brands actively running campaigns.</span>
          </div>
        </div>

        <div class="chips">
          <div class="chip">🎯 Inbound brand deals</div>
          <div class="chip">💸 Real paid campaigns</div>
          <div class="chip">⚡ Free forever</div>
          <div class="chip">📄 Contracts in-platform</div>
          <div class="chip">🌍 Local & global brands</div>
        </div>

        <p class="plat-label">Works across your platforms</p>
        <div class="plat-row">
          <div class="p-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>Instagram
          </div>
          <div class="p-chip">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/></svg>TikTok
          </div>
          <div class="p-chip">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>YouTube
          </div>
          <div class="p-chip">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>X
          </div>
        </div>
      </div>

      <div class="form-card" id="form-card">
        <div id="form-content">
          <div class="form-hl">List your profile — free</div>
          <p class="form-sub">2 minutes. No credit card. Get found by brands today.</p>
          <div class="fgroup">
            <div class="frow">
              <div class="field"><label for="fname">First Name</label><input type="text" id="fname" placeholder="Alex" autocomplete="given-name"></div>
              <div class="field"><label for="lname">Last Name</label><input type="text" id="lname" placeholder="Smith" autocomplete="family-name"></div>
            </div>
            <div class="field"><label for="email">Email Address</label><input type="email" id="email" placeholder="you@example.com" autocomplete="email"></div>
            <div class="field"><label for="location">Your Location</label><input type="text" id="location" placeholder="e.g. Cape Town, South Africa"></div>
            <div class="divider"></div>
            <span class="toggle-label" style="margin-bottom:4px">Your handles — enter the ones that apply</span>
            <div class="field"><label for="handle-ig">Instagram Handle</label><input type="text" id="handle-ig" placeholder="@yourhandle" autocomplete="off"></div>
            <div class="field"><label for="handle-tt">TikTok Handle</label><input type="text" id="handle-tt" placeholder="@yourhandle" autocomplete="off"></div>
            <div class="field"><label for="handle-yt">YouTube Channel</label><input type="text" id="handle-yt" placeholder="@yourchannel or channel name" autocomplete="off"></div>
            <div class="field"><label for="handle-x">X (Twitter) Handle</label><input type="text" id="handle-x" placeholder="@yourhandle" autocomplete="off"></div>
            <div class="divider" style="margin-top:4px"></div>
            <div class="frow">
              <div class="field">
                <label for="niche">Your Niche</label>
                <select id="niche">
                  <option value="" disabled selected>Select niche</option>
                  <option>Fashion & Style</option><option>Beauty & Skincare</option>
                  <option>Health & Fitness</option><option>Food & Lifestyle</option>
                  <option>Travel</option><option>Tech & Gaming</option>
                  <option>Business & Finance</option><option>Parenting & Family</option>
                  <option>Entertainment</option><option>Education</option>
                  <option>Sports</option><option>Other</option>
                </select>
              </div>
              <div class="field">
                <label for="followers">Follower Count</label>
                <select id="followers">
                  <option value="" disabled selected>Select range</option>
                  <option>1K – 10K (Nano)</option><option>10K – 50K (Micro)</option>
                  <option>50K – 200K (Mid-tier)</option><option>200K – 1M (Macro)</option>
                  <option>1M+ (Mega)</option>
                </select>
              </div>
            </div>
          </div>
          <button class="btn-cta" id="creators-submit-btn">Get Listed in AI Search — Free →</button>
          <p class="form-note">Free for creators, always. Only shared with verified brands.<br>By signing up you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.</p>
        </div>
        <div class="success-state" id="success-state">
          <span class="s-emoji">🎉</span>
          <p class="s-body">Check your inbox — we've sent you next steps.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="ai-section">
    <div class="ai-inner">
      <div>
        <p class="eyebrow reveal">How the AI search works</p>
        <h2 class="section-hl reveal">Brands type.<br><span class="blue">You appear.</span></h2>
        <p class="section-body reveal">Snappi's AI doesn't work like a filter system. Brands type natural phrases — "momfluencer in London", "Cape Town fitness creator", "foodie with 20K followers" — and the AI instantly surfaces matching creators. The more complete your profile, the higher you rank.</p>
        <div class="ai-steps">
          <div class="ai-step reveal">
            <div class="ai-step-num">1</div>
            <div><div class="ai-step-title">A brand types what they're looking for</div><div class="ai-step-body">Natural language. No filters, no dropdowns. They just describe the creator they need in plain words.</div></div>
          </div>
          <div class="ai-step reveal">
            <div class="ai-step-num">2</div>
            <div><div class="ai-step-title">The AI matches against your profile</div><div class="ai-step-body">Your niche, location, platform and follower count all determine how you rank. A complete profile = more visibility.</div></div>
          </div>
          <div class="ai-step reveal">
            <div class="ai-step-num">3</div>
            <div><div class="ai-step-title">The brand reaches out directly</div><div class="ai-step-body">They send a brief and contract through Snappi. You review, accept, post, get paid. Simple.</div></div>
          </div>
        </div>
      </div>
      <div class="big-demo reveal">
        <div class="big-demo-top"><span>⚡</span><span>Snappi AI Search — Brand View</span></div>
        <div class="big-demo-body">
          <div class="demo-search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <div class="demo-query"><span class="tag">momfluencer</span> in <span class="tag">London</span></div>
          </div>
          <div class="demo-cards">
            <div class="demo-card"><div class="demo-av da1">SJ</div><div class="demo-info"><div class="demo-name">@sarah_mumlife · London</div><div class="demo-meta">Instagram · 38K followers · Parenting</div></div><div class="demo-tag">98% match</div></div>
            <div class="demo-card"><div class="demo-av da2">PK</div><div class="demo-info"><div class="demo-name">@mumof3_priya · London</div><div class="demo-meta">TikTok + Instagram · 22K followers</div></div><div class="demo-tag">94% match</div></div>
            <div class="demo-card"><div class="demo-av da3">RL</div><div class="demo-info"><div class="demo-name">@realmumlondon · London</div><div class="demo-meta">YouTube · 55K followers · Family</div></div><div class="demo-tag">91% match</div></div>
          </div>
          <div class="demo-caption">← Exactly what a brand sees. Will your profile be here?</div>
        </div>
      </div>
    </div>
  </section>

  <section class="perks">
    <div class="perks-inner">
      <p class="eyebrow reveal">Why creators choose Snappi</p>
      <h2 class="section-hl reveal">Everything working<br>in your favour</h2>
      <div class="perks-grid">
        <div class="perk-card reveal"><span class="perk-emoji">🔍</span><div class="perk-title">You get found without lifting a finger</div><p class="perk-body">Sign up once. Sit in Snappi's AI search permanently. Every time a brand searches your niche and city, your profile comes up. Completely passive.</p></div>
        <div class="perk-card reveal"><span class="perk-emoji">💸</span><div class="perk-title">Real paid campaigns, not just gifting</div><p class="perk-body">Snappi connects you to brands with real budgets running structured campaigns — not just "we'll send you a product." Your work gets valued properly.</p></div>
        <div class="perk-card reveal"><span class="perk-emoji">📄</span><div class="perk-title">Contracts & briefs handled in-platform</div><p class="perk-body">No awkward email chains. Brands send professional briefs and contracts through Snappi so every deal is clear, fast and protected — for both sides.</p></div>
        <div class="perk-card reveal"><span class="perk-emoji">📊</span><div class="perk-title">Your niche beats follower count</div><p class="perk-body">Snappi's AI matches on niche, location and content type — not just numbers. A nano-creator in the right niche will appear ahead of big accounts in the wrong one.</p></div>
        <div class="perk-card reveal"><span class="perk-emoji">🌍</span><div class="perk-title">Local & international brand access</div><p class="perk-body">Whether you're in Cape Town, Lagos or London — Snappi's brand base spans SMBs worldwide actively looking for authentic creators in specific markets.</p></div>
        <div class="perk-card reveal"><span class="perk-emoji">✅</span><div class="perk-title">Free forever. Zero hidden costs.</div><p class="perk-body">Listing on Snappi is permanently free for creators. We charge the brands — never creators. Your profile stays live as long as you want it to.</p></div>
      </div>
    </div>
  </section>

  <section class="final-cta">
    <div class="final-inner">
      <div class="banner reveal">
        <div class="banner-hl">Brands are searching.<br>Make sure they find you.</div>
        <p class="banner-body">Join Snappi's creator index for free. 2 minutes to sign up. The next brand deal could come from a search happening right now.</p>
        <a href="#form-card" class="btn-white" data-scroll-to="form-card">Get Listed in AI Search — Free →</a>
      </div>
    </div>
  </section>

  <footer>
    <a class="logo" href="https://www.snappi.vip">
      <div class="logo-icon"><svg viewBox="0 0 24 24"><path d="M13 2L4.09 12.6c-.36.43-.54.65-.55.84a.5.5 0 00.19.41c.15.15.43.15.99.15H12l-1 8.4L20.91 11.4c.36-.43.54-.65.55-.84a.5.5 0 00-.19-.41C21.12 10 20.84 10 20.28 10H13l1-8z"/></svg></div>
      <span class="logo-text">Snappi</span>
    </a>
    <span class="footer-copy">© 2026 Snappi. All rights reserved. · <a href="https://www.snappi.vip">snappi.vip</a></span>
  </footer>

</div>
`;

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cabinet+Grotesk:wght@700;800;900&display=swap";

const TAG = "data-creators-page";

export const Creators = () => {
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute(TAG, "");
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = FONT_HREF;
    fontLink.setAttribute(TAG, "");
    document.head.appendChild(fontLink);

    document.body.classList.add("creators-page");

    const root = document.getElementById("creators-root");
    if (!root) return;

    const phrases = [
      "momfluencer in London",
      "Cape Town fitness creator",
      "foodie with 20K followers",
      "travel creator in Dubai",
      "SA beauty influencer",
      "health influencer in Johannesburg",
    ];
    let pi = 0;
    let ci = 0;
    let del = false;
    let typingTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const tEl = root.querySelector<HTMLElement>("#typing-text");
    const rEl = root.querySelector<HTMLElement>("#demo-results");
    const cEl = root.querySelector<HTMLElement>("#demo-cta");

    const type = () => {
      if (cancelled || !tEl || !rEl || !cEl) return;
      const phrase = phrases[pi];
      if (!del) {
        tEl.textContent = phrase.slice(0, ci + 1);
        ci++;
        if (ci === phrase.length) {
          rEl.style.display = "flex";
          rEl.style.flexDirection = "column";
          cEl.style.display = "flex";
          rEl.querySelectorAll<HTMLElement>(".result-row").forEach((r) => {
            r.style.animation = "none";
            void r.offsetHeight;
            r.style.animation = "";
          });
          typingTimer = setTimeout(() => {
            del = true;
            type();
          }, 3400);
          return;
        }
      } else {
        tEl.textContent = phrase.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          del = false;
          rEl.style.display = "none";
          cEl.style.display = "none";
          pi = (pi + 1) % phrases.length;
          typingTimer = setTimeout(type, 350);
          return;
        }
      }
      typingTimer = setTimeout(type, del ? 36 : 66);
    };
    typingTimer = setTimeout(type, 1000);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const parent = e.target.parentElement;
            const idx = parent
              ? Array.from(parent.children).indexOf(e.target)
              : 0;
            setTimeout(() => e.target.classList.add("visible"), idx * 75);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    root.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    const scrollHandler = (ev: Event) => {
      const el = ev.target as HTMLElement | null;
      const trigger = el?.closest?.<HTMLElement>("[data-scroll-to]");
      if (!trigger) return;
      ev.preventDefault();
      const id = trigger.getAttribute("data-scroll-to");
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
    root.addEventListener("click", scrollHandler);

    const submitBtn = root.querySelector<HTMLButtonElement>(
      "#creators-submit-btn"
    );
    const onSubmit = async () => {
      const required = ["fname", "email", "niche", "followers"];
      let valid = true;
      const flag = (el: HTMLElement) => {
        el.style.borderColor = "#ef4444";
        el.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.12)";
        setTimeout(() => {
          el.style.borderColor = "";
          el.style.boxShadow = "";
        }, 2500);
      };
      const getVal = (id: string) =>
        (root.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)?.value || "").trim();

      required.forEach((id) => {
        const el = root.querySelector<HTMLInputElement | HTMLSelectElement>(
          `#${id}`
        );
        if (el && !el.value.trim()) {
          flag(el);
          valid = false;
        }
      });
      const handles = ["handle-ig", "handle-tt", "handle-yt", "handle-x"];
      const anyHandle = handles.some((id) => !!getVal(id));
      if (!anyHandle) {
        handles.forEach((id) => {
          const el = root.querySelector<HTMLInputElement>(`#${id}`);
          if (el) flag(el);
        });
        valid = false;
      }
      if (!valid) return;

      const payload = {
        firstName: getVal("fname"),
        lastName: getVal("lname"),
        email: getVal("email"),
        location: getVal("location"),
        handles: {
          instagram: getVal("handle-ig"),
          tiktok: getVal("handle-tt"),
          youtube: getVal("handle-yt"),
          twitter: getVal("handle-x"),
        },
        niche: getVal("niche"),
        followerCount: getVal("followers"),
      };

      submitBtn?.setAttribute("disabled", "true");
      const originalLabel = submitBtn?.textContent;
      if (submitBtn) submitBtn.textContent = "Submitting...";

      try {
        const result = await creatorSubmissionsAPI.create(payload);
        if (!result.success) {
          throw new Error(result.message || "Submission failed");
        }
        const formContent = root.querySelector<HTMLElement>("#form-content");
        const successState = root.querySelector<HTMLElement>("#success-state");
        if (formContent) formContent.style.display = "none";
        if (successState) successState.style.display = "block";
      } catch (err: any) {
        const emailEl = root.querySelector<HTMLInputElement>("#email");
        if (emailEl) flag(emailEl);
        alert(err?.message || "Could not submit. Please try again.");
      } finally {
        submitBtn?.removeAttribute("disabled");
        if (submitBtn && originalLabel) submitBtn.textContent = originalLabel;
      }
    };
    submitBtn?.addEventListener("click", onSubmit);

    return () => {
      cancelled = true;
      if (typingTimer) clearTimeout(typingTimer);
      obs.disconnect();
      root.removeEventListener("click", scrollHandler);
      submitBtn?.removeEventListener("click", onSubmit);
      document.body.classList.remove("creators-page");
      document.head.querySelectorAll(`[${TAG}]`).forEach((el) => el.remove());
    };
  }, []);

  return (
    <div
      id="creators-root"
      className="creators-root"
      dangerouslySetInnerHTML={{ __html: BODY_HTML }}
    />
  );
};

export default Creators;
