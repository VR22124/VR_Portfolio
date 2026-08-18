import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CONTENT = [
  {
    num: '01',
    title: 'The Idea',
    content: (
      <>
        <h4 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] mb-4">The Problem</h4>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          ShepherEd started as an idea during my third year. I wanted to build a modern educational platform that wasn't limited by the design of traditional college ERPs. Due to time constraints and the project's scope, I decided to postpone it until I had enough time to approach it properly.
        </p>
      </>
    )
  },
  {
    num: '02',
    title: 'From Idea to Execution',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          A few months later, after exploring AI-assisted engineering workflows, I revisited the project.
        </p>
        <p className="text-[var(--text-primary)]/90 text-base sm:text-lg leading-relaxed mb-4 p-5 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/[0.02]">
          AI didn't replace the design process—it became a collaborative tool for brainstorming, validating ideas, exploring architectural alternatives, and planning implementation.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
          The vision and product direction remained my responsibility.
        </p>
      </>
    )
  },
  {
    num: '03',
    title: 'Version 1: A Single Next.js Application',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          The project began as a single Next.js application. Everything lived together:
        </p>
        <ul className="grid grid-cols-2 gap-3 mb-6">
          {['Frontend', 'Backend', 'Authentication', 'APIs', 'Server-side rendering'].map(item => (
            <li key={item} className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60" /> {item}
            </li>
          ))}
        </ul>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed italic border-l-2 border-[var(--text-primary)]/20 pl-4 py-1">
          The goal wasn't perfection—it was to validate ideas quickly.
        </p>
      </>
    )
  },
  {
    num: '04',
    title: 'Building the Dynamic Academic Engine',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          The original vision wasn't to build a traditional ERP with fixed academic entities. Instead, I wanted to create a dynamic academic engine capable of representing different institutional structures without changing the underlying application.
        </p>
        <p className="text-[var(--text-primary)]/90 text-base sm:text-lg leading-relaxed mb-6 font-medium">
          Every academic component was designed to be configurable. This included relationships between:
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {['Institutions', 'Departments', 'Programs', 'Regulations', 'Academic Years', 'Semesters', 'Courses', 'Subjects', 'Credits', 'Sections', 'Faculty', 'Students'].map(item => (
            <span key={item} className="px-3 py-1.5 text-xs font-display uppercase tracking-widest text-[var(--text-primary)]/70 bg-[var(--text-primary)]/[0.03] border border-[var(--text-primary)]/10 rounded">
              {item}
            </span>
          ))}
        </div>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          The objective was simple: If two institutions follow completely different academic models, the platform should adapt instead of forcing one predefined structure.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          At first, this approach appeared extremely flexible.
        </p>
        <p className="text-[var(--text-primary)]/80 text-base sm:text-lg leading-relaxed p-4 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-lg">
          However, flexibility introduced an entirely different class of engineering problems.
        </p>
      </>
    )
  },
  {
    num: '05',
    title: 'When Flexibility Became Complexity',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          The more configurable the academic engine became, the more interconnected every entity became. Relationships expanded rapidly.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          A small modification to one entity often affected several others. Eventually, the database itself became difficult to reason about.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6 border-l-2 border-[var(--accent)]/50 pl-4">
          Some entities accumulated a large number of relationships and configuration fields, resulting in increasingly complex queries and deeply nested data retrieval.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-10">
          As the platform grew, performance, maintainability, and developer experience all started to suffer. The system had become technically flexible but practically difficult to evolve.
        </p>

        <h4 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] mb-4">The Turning Point</h4>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          This became one of the biggest architectural lessons of the project. Instead of trying to make every academic rule configurable from the beginning, I decided to simplify the foundation.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          The first production version would prioritize a well-defined academic structure over unlimited flexibility. Core entities such as:
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {['Departments', 'Programs', 'Courses', 'Subjects', 'Credits', 'Academic Years', 'Semesters', 'Sections', 'Batches'].map(item => (
            <span key={item} className="px-3 py-1.5 text-xs font-display uppercase tracking-widest text-[var(--text-primary)]/70 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded">
              {item}
            </span>
          ))}
        </div>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-10">
          ...would exist as structured models. Only the institution-specific configuration would remain flexible.
        </p>

        <h4 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Introducing JSONB</h4>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          Rather than storing every possible variation as database columns, I shifted configurable institution-specific settings into JSONB-based configuration models.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          This approach provided a balance between structure and flexibility. The platform retained a consistent academic foundation while still allowing institutions to customize workflows where necessary.
        </p>
        <div className="p-6 rounded-xl bg-[var(--text-primary)]/[0.02] border border-[var(--text-primary)]/5">
          <p className="text-[var(--text-primary)] text-lg sm:text-xl leading-snug">
            The lesson wasn't that dynamic models were wrong. It was that not everything needs to be dynamic from day one.
          </p>
        </div>
      </>
    )
  },
  {
    num: '06',
    title: 'The Onboarding Problem',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          Another challenge appeared much earlier than expected. Initially, the ERP handled everything:
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {['Authentication', 'User management', 'Onboarding', 'Profiles', 'Departments', 'Academic data', 'Institution management'].map(item => (
            <li key={item} className="flex items-center gap-2 text-[var(--text-primary)]/70 text-sm bg-[var(--text-primary)]/[0.02] border border-[var(--text-primary)]/5 px-3 py-2 rounded">
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          As more features were added, onboarding alone became one of the largest modules in the application. Every new feature depended on user identity.
        </p>
        <p className="text-[var(--text-primary)]/90 text-base sm:text-lg leading-relaxed mb-10 p-4 border-l-2 border-red-500/50 bg-red-500/5">
          The ERP slowly became responsible for problems that weren't actually related to academic management.
        </p>

        <h4 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Redefining Responsibilities</h4>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          Instead of expanding the ERP further, I stepped back and asked: <span className="text-[var(--text-primary)] italic">What responsibilities actually belong inside an ERP?</span>
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-10">
          This question completely changed the project. Identity wasn't an ERP problem. It was a platform problem.
        </p>

        <h4 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Birth of SIP</h4>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          This realization led to one of the biggest architectural decisions in the project. The onboarding system evolved into an independent platform: <strong className="text-[var(--accent)] font-normal">ShepherEd Identity Platform (SIP)</strong>.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          Instead of treating authentication as a feature, SIP became responsible for:
        </p>
        <ul className="grid grid-cols-2 gap-3 mb-6">
          {['Authentication', 'Authorization', 'User lifecycle', 'Invitations', 'Tenant onboarding', 'Role management', 'Sessions', 'Account recovery', 'Identity verification'].map(item => (
            <li key={item} className="flex items-center gap-3 text-[var(--text-primary)]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
          This separation dramatically reduced the complexity of the ERP while making identity reusable across every future ShepherEd platform.
        </p>
      </>
    )
  },
  {
    num: '07',
    title: 'Evolving SIP: From Supabase to In-House Auth',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          When SIP was first created, it relied on Supabase as its core authentication provider to accelerate development. This worked well during the early stages.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          However, as the platform requirements became more sophisticated, several limitations emerged. The authentication system was no longer responsible only for signing users in. It also needed to deeply understand:
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {['Institutions', 'Tenants', 'Roles', 'Invitations', 'Academic onboarding', 'Faculty lifecycle', 'Student lifecycle', 'Cross-platform permissions'].map(item => (
            <span key={item} className="px-3 py-1.5 text-xs font-display uppercase tracking-widest text-[var(--text-primary)]/70 bg-[var(--accent)]/5 border border-[var(--accent)]/10 rounded">
              {item}
            </span>
          ))}
        </div>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          At this point, authentication had become a highly contextual part of the platform architecture.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          Instead of writing complex workarounds to extend a third-party solution indefinitely, I decided to build a custom, in-house authentication module directly inside SIP.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed border-l-2 border-[var(--accent)]/50 pl-4">
          Because SIP was already modular, swapping Supabase for the in-house system was seamless. This provided complete control over authentication while allowing identity to evolve perfectly alongside the rest of the ecosystem.
        </p>
      </>
    )
  },
  {
    num: '08',
    title: 'From Modular Monolith to Platform Ecosystem',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          The project didn't become multiple platforms because microservices were trendy. It became multiple platforms because responsibilities naturally separated over time.
        </p>
        <div className="text-2xl sm:text-3xl font-display text-[var(--text-primary)] mb-8 max-w-xl leading-tight border-l-4 border-[var(--accent)] pl-6 py-2 mt-6">
          "The biggest realization was this: Every platform should solve one problem well."
        </div>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          That led to three clear platform boundaries.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { code: 'SCP', desc: 'Campus management.' },
            { code: 'SIP', desc: 'Identity and security.' },
            { code: 'SOP', desc: 'Observability and platform health.' }
          ].map(plat => (
            <div key={plat.code} className="p-5 rounded-xl bg-[var(--text-primary)]/[0.02] border border-[var(--text-primary)]/5 hover:border-[var(--text-primary)]/10 transition-colors">
              <div className="text-[var(--accent)] font-display font-bold text-xl mb-2">{plat.code}</div>
              <div className="text-[var(--text-secondary)] text-sm">{plat.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          This wasn't a technical optimization. It was an organizational one.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
          Each platform could now evolve independently while remaining part of one ecosystem.
        </p>
      </>
    )
  },
  {
    num: '09',
    title: 'From a Modular Monolith to a Monorepo',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          As the platform ecosystem expanded into SCP, SIP, and SOP, anticipating how to manage them became critical. Instead of splitting them into multiple repositories, I moved directly from a modular monolith into a monorepo.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          This prevented the overhead of duplicating:
        </p>
        <ul className="grid grid-cols-2 gap-3 mb-6">
          {['Configurations', 'Tooling', 'Linting', 'Build processes', 'Shared types', 'Shared components'].map(item => (
            <li key={item} className="flex items-center gap-3 text-[var(--text-primary)]/60 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]/20" /> {item}
            </li>
          ))}
        </ul>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          Each platform remained completely independent while securely sharing:
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {['Development standards', 'Common libraries', 'Shared UI', 'Tooling', 'Engineering practices'].map(item => (
            <span key={item} className="px-3 py-1.5 text-xs font-display tracking-wide text-[var(--accent)]/90 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded">
              {item}
            </span>
          ))}
        </div>
        <p className="text-[var(--text-primary)]/90 text-base sm:text-lg leading-relaxed">
          This early architectural decision significantly improved consistency across the ecosystem from day one.
        </p>
      </>
    )
  },
  {
    num: '10',
    title: 'AI as an Engineering Partner',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          Rather than asking AI to build entire features, I use it throughout the engineering process. For example:
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            'Brainstorming ideas', 'Challenging architectural decisions',
            'Planning implementation phases', 'Reviewing trade-offs',
            'Generating automated tests', 'Improving documentation'
          ].map(item => (
            <div key={item} className="flex items-center gap-3 text-sm text-[var(--text-primary)]/80 bg-[var(--text-primary)]/[0.02] p-3 rounded-lg border border-[var(--text-primary)]/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/40" />
              {item}
            </div>
          ))}
        </div>
        <p className="text-[var(--text-primary)]/90 text-base sm:text-lg leading-relaxed border-l-2 border-[var(--accent)] pl-4">
          Every architectural decision, trade-off, and production standard remains my responsibility.
        </p>
      </>
    )
  },
  {
    num: '11',
    title: 'Iterative Development',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          Large features are never implemented in one step. Instead, development is broken into small iterations with:
        </p>
        <ul className="space-y-4 mb-8">
          {[
            'Clear objectives', 'Defined scope', 'File-level boundaries for AI agents',
            'Validation checkpoints', 'Automated testing'
          ].map(item => (
            <li key={item} className="flex items-center gap-3 text-sm text-[var(--text-primary)]/80">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed italic border-l-2 border-[var(--text-primary)]/20 pl-4 py-1">
          Each iteration must be stable before moving to the next.
        </p>
      </>
    )
  },
  {
    num: '12',
    title: 'Production Mindset',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          One of the biggest changes throughout the project was understanding that writing working code is only a small part of software engineering.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          Development now considers:
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            'Security', 'Authentication', 'Authorization', 'Testing', 'Documentation',
            'Deployment', 'Maintainability', 'Scalability', 'Observability'
          ].map(item => (
            <span key={item} className="px-3 py-1.5 text-xs font-display uppercase tracking-widest text-[var(--text-primary)]/90 bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/10 rounded">
              {item}
            </span>
          ))}
        </div>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed border-t border-[var(--text-primary)]/10 pt-6">
          ...from the beginning rather than treating them as final improvements.
        </p>
      </>
    )
  },
  {
    num: '13',
    title: 'Mistakes That Changed the Architecture',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          The best engineering decisions came from things that didn't work. These weren't failures—they were turning points that drove the architecture forward.
        </p>
        <div className="space-y-3 mb-8">
          {[
            'Trying to make the academic engine dynamic too early.',
            'Letting onboarding grow inside the ERP.',
            'Keeping frontend and backend together for too long.',
            'Depending on third-party authentication beyond its intended scope.'
          ].map(mistake => (
            <div key={mistake} className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <div className="mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <p className="text-[var(--text-primary)]/80 text-sm sm:text-base">{mistake}</p>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    num: '14',
    title: 'Decisions That Changed the Project',
    content: (
      <>
        <div className="space-y-8">
          <div className="pl-4 border-l-2 border-[var(--accent)]/60">
            <h5 className="text-[var(--text-primary)] font-display font-bold text-lg sm:text-xl mb-2">Choosing Evolution Over Perfection</h5>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              The architecture changed several times throughout development. Instead of treating those changes as failures, they became opportunities to improve the system before production.
            </p>
          </div>
          <div className="pl-4 border-l-2 border-[var(--accent)]/60">
            <h5 className="text-[var(--text-primary)] font-display font-bold text-lg sm:text-xl mb-2">Prioritizing Foundations</h5>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              Rather than implementing every ERP feature immediately, development shifted toward identity, onboarding, academic structure, testing, and documentation. A stable foundation proved more valuable than a large feature list.
            </p>
          </div>
          <div className="pl-4 border-l-2 border-[var(--accent)]/60">
            <h5 className="text-[var(--text-primary)] font-display font-bold text-lg sm:text-xl mb-2">Separating Identity from Business Logic</h5>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              Creating SIP was one of the biggest architectural improvements. It reduced complexity across the ecosystem while making identity reusable for future platforms.
            </p>
          </div>
          <div className="pl-4 border-l-2 border-[var(--accent)]/60">
            <h5 className="text-[var(--text-primary)] font-display font-bold text-lg sm:text-xl mb-2">Treating AI as an Engineering Partner</h5>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              AI accelerated planning, implementation, documentation, and testing, but architectural ownership remained a human responsibility throughout the project.
            </p>
          </div>
          <div className="pl-4 border-l-2 border-[var(--accent)]/60">
            <h5 className="text-[var(--text-primary)] font-display font-bold text-lg sm:text-xl mb-2">Building for Adaptability</h5>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              The long-term vision evolved from delivering one ERP into building a platform ecosystem that institutions can configure, extend, and deploy according to their own needs.
            </p>
          </div>
        </div>
      </>
    )
  },
  {
    num: '15',
    title: 'Current State',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          Today, ShepherEd has evolved into a modular platform ecosystem consisting of:
        </p>
        <ul className="space-y-2 mb-6">
          {['SCP — ShepherEd Campus Platform', 'SIP — ShepherEd Identity Platform', 'SOP — ShepherEd Observability Platform'].map(plat => (
            <li key={plat} className="text-[var(--text-primary)]/80 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/40" />
              {plat}
            </li>
          ))}
        </ul>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-10">
          Each platform has a clearly defined responsibility while sharing a common engineering foundation and development workflow.
        </p>

        <h4 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Current State</h4>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          ShepherEd is currently in an active stabilization phase.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          During development, repeated testing revealed inconsistencies across different workflows. Rather than continuing to build new features, I shifted the project's priority toward reliability, validation, and strengthening the engineering foundation.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          Current work focuses on:
        </p>
        <ul className="space-y-2 mb-8 ml-2">
          {[
            'Improving consistency across the platform',
            'Refining architecture and code quality',
            'Expanding automated testing',
            'Strengthening documentation',
            'Preparing the first stable production release'
          ].map(item => (
            <li key={item} className="text-[var(--text-secondary)] text-base sm:text-lg flex items-center gap-3">
              <span className="text-[var(--accent)]/60">-</span>
              {item}
            </li>
          ))}
        </ul>

        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          The immediate milestone is completing the core academic structure. This includes:
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'Institutions', 'Departments', 'Programs', 'Courses', 'Subjects', 'Credits', 
            'Regulations', 'Academic Years', 'Semesters', 'Sections', 'Batches', 'Faculty', 'Students'
          ].map(item => (
            <span key={item} className="px-3 py-1.5 text-xs font-display uppercase tracking-widest text-[var(--text-primary)]/70 bg-[var(--text-primary)]/[0.03] border border-[var(--text-primary)]/10 rounded">
              {item}
            </span>
          ))}
        </div>
        
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          Once these foundational entities are complete, the next phase is establishing the relationships between them to create a flexible academic model capable of representing different institutional structures.
        </p>
        <p className="text-[var(--text-primary)]/90 text-base sm:text-lg leading-relaxed border-l-2 border-[var(--accent)] pl-4 py-1 my-6">
          This milestone represents the first stable version of the ShepherEd platform ecosystem.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          Only after this foundation is complete will development move toward operational modules such as:
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'Attendance', 'Timetables', 'Internal Assessments', 'Marks', 
            'Placements', 'Student Services', 'Faculty Workflows', 'Administrative Operations'
          ].map(item => (
            <span key={item} className="px-3 py-1.5 text-xs font-display uppercase tracking-widest text-[var(--accent)]/70 bg-[var(--accent)]/[0.03] border border-[var(--accent)]/20 rounded">
              {item}
            </span>
          ))}
        </div>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-10">
          Rather than hardcoding these features, the goal is to build them on top of the academic foundation so they can adapt to the workflows and regulations of different institutions.
        </p>

        <h4 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Looking Ahead</h4>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          One of the ideas currently under consideration is evolving ShepherEd beyond a traditional ERP into a platform framework.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          Instead of prescribing how institutions should operate, the platform would provide a strong foundation that institutions can extend, configure, and deploy according to their own academic and administrative models.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
          This direction would allow:
        </p>
        <ul className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            'Self-hosted deployments', 'Managed cloud deployments', 'Institution-specific customizations',
            'Modular platform extensions', 'Shared platform improvements', 'Flexible academic models'
          ].map(item => (
            <li key={item} className="flex items-center gap-3 text-[var(--text-primary)]/80 bg-[var(--text-primary)]/[0.02] p-3 rounded-lg border border-[var(--text-primary)]/5 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-10">
          The long-term objective is not simply to deliver software, but to build a platform that institutions can adopt, extend, and evolve without being locked into a single predefined workflow.
        </p>

        <h4 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] mb-4">What ShepherEd Is Becoming</h4>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-2">
          When the project began, the goal was to build an ERP.
        </p>
        <p className="text-[var(--text-primary)] font-display font-bold text-lg mb-6">
          Today, the goal is different.
        </p>
        <p className="text-[var(--text-primary)] text-lg sm:text-2xl leading-snug p-6 sm:p-8 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 shadow-[0_0_30px_color-mix(in srgb, var(--accent) 5%, transparent)]">
          The vision is to build a modular platform ecosystem where educational institutions are free to shape the system around their own processes instead of changing their processes to fit the software.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mt-6">
          That shift in thinking has influenced every architectural decision made throughout the project and continues to guide its evolution.
        </p>
      </>
    )
  },
  {
    num: '16',
    title: 'Reliability and Database Integrity',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          With the core architecture established, the next priority was ensuring the system could withstand production workloads without silent failures. I conducted a comprehensive reliability check across the ecosystem, specifically targeting idempotency, state leakage, and concurrency issues.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          A major shift during this phase was moving away from direct Prisma database writes. I transitioned the data layer to strict database transactions. This eliminated the risk of orphan datasets and ensured that complex, multi-step operations either fully succeeded or safely rolled back. 
        </p>
      </>
    )
  },
  {
    num: '17',
    title: 'Environments and Testing at Scale',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          To ensure deployment stability, I established strict environment boundaries—creating isolated Development, Test, and Production environments. This provided clean transitions and prevented cross-environment pollution during deployments.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          As the platform grew, so did the End-to-End testing suite. A single test suite consists of a sequential flow of nearly 580 tests and 1,740 assertions. However, running 3 to 5 of these heavy suites in parallel locally began burning through system CPU resources, severely hindering development. 
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          To solve this bottleneck, I implemented GitHub Actions to offload the execution, leveraging GitHub's free Ubuntu VMs (providing 2 cores and 7GB of RAM). However, this heavy parallelization exposed new challenges: the free-tier database struggled with slow writes, resulting in "Connection Refused" errors under load. I redesigned the connection pooling and system procession handling to withstand running multiple parallel suites simultaneously, ensuring the testing pipelines remain robust despite resource-constrained database tiers.
        </p>
      </>
    )
  },
  {
    num: '18',
    title: 'Open-Sourcing the Observability Platform',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          The ShepherEd Observability Platform (SOP) was already deeply integrated into the ecosystem to handle logging and analytics. However, I realized that keeping it tightly coupled to ShepherEd limited its potential. There is currently an ongoing plan to untether SOP completely and release it as an independent, open-source platform.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          While there are several open-source observability options available, most are incredibly heavyweight. Building SOP as a lightweight, open ecosystem ensures that integrating my other independent projects remains smooth and frictionless.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          Beyond architecture, this transition provides a completely new perspective on development. When a system is no longer provisioned just by me, but by other developers globally, it forces a shift in how the software is written. It demands a level of modularity, clarity, and generalized design that ultimately creates a much stronger technical foundation for the platform.
        </p>
      </>
    )
  },
  {
    num: '19',
    title: 'The Open Source Horizon',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          This open-source philosophy naturally extended back to the core of the ecosystem. I realized that the current Academic Module inside the ShepherEd Campus Platform (SCP) had grown too rigid and unreliable to support long-term flexibility. Educational structures—terms, grading scales, subjects, and enrollments—are incredibly complex, and a rigid module simply couldn't adapt fast enough.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          Because of this, I made the decision to build <strong>ShepherEd OpenAcademia</strong> as a completely separate, standalone open-source platform. 
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          Once OpenAcademia is stable, the plan is to provision it directly into SCP via an integration layer, and slowly decommission the existing legacy Academic Module. This represents the next major evolution in how the ecosystem gracefully handles domain complexity.
        </p>
      </>
    )
  },
  {
    num: '20',
    title: 'Streamlining CI/CD and Automation',
    content: (
      <>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          Building the ecosystem was only the first half of the engineering challenge. Because this is a solo project, maintaining operational efficiency is critical. I cannot afford to lose hours resolving package dependency conflicts, manually managing environment setups, or babysitting deployments. 
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          While implementing the End-to-End testing workflow in GitHub Actions was my first successful step into pipeline automation, it highlighted the need for a much deeper, system-wide approach. I am currently dedicating time to intensely study Continuous Integration and Continuous Deployment (CI/CD) methodologies.
        </p>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-6">
          My immediate roadmap involves mastering <strong>Docker</strong> and <strong>Jenkins</strong>. By containerizing the ecosystem, I can eliminate the friction of inconsistent environments. From there, I plan to use Jenkins to orchestrate clean, automated lifecycles that seamlessly handle package dependencies, testing, and deployment. Mastering this automation is the next frontier, ensuring that the sheer scale of the ecosystem remains easy to handle for a solo engineer.
        </p>
      </>
    )
  }
];

export default function ShepherEdCaseStudy() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations
      gsap.from('[data-hero-el]', {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });

      // Chapter animations
      const sections = gsap.utils.toArray<HTMLElement>('[data-chapter]');
      sections.forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          }
        });
      });

      // Progress rail
      const rail = document.querySelector('[data-progress-rail]');
      const contentCol = document.querySelector('[data-content-col]');
      if (rail && contentCol) {
        gsap.to(rail, {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: contentCol,
            start: 'top 50%',
            end: 'bottom 80%',
            scrub: true,
          }
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__INITIAL_LOAD_DONE__ = true;
    }
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent)] selection:text-[var(--bg-base)] font-body relative">
      <Helmet>
        <title>Engineering ShepherEd | Vishnu Rohith</title>
        <meta name="description" content="An engineering case study on building ShepherEd, a modular platform ecosystem for educational institutions." />
        <link rel="canonical" href="https://vishnurohith.com/case-studies/shephered" />
      </Helmet>

      {/* Nav Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-md bg-[var(--bg-base)]/50 border-b border-[var(--text-primary)]/5 flex items-center justify-between">
        <Link to="/#shephered" className="group inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="font-display text-sm tracking-widest uppercase">Back to Portfolio</span>
        </Link>
        <div className="font-display font-bold text-[var(--accent)] tracking-widest uppercase text-xs">
          Engineering Case Study
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 container-layout relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span data-hero-el className="inline-block mb-6 px-3 py-1.5 border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-display tracking-[0.2em] uppercase rounded-full">
            Project Deep Dive
          </span>
          <h1 data-hero-el className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[0.9] tracking-tighter mb-8 uppercase text-[var(--text-primary)] flex flex-col items-center">
            <span className="text-[var(--accent)] text-lg sm:text-2xl lg:text-3xl tracking-[0.3em] opacity-90 mb-6">SHEPHERED</span>
            <span>Building a</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-primary)]/40">Modular Educational</span>
            <span>Platform Ecosystem</span>
          </h1>
          <p data-hero-el className="text-[var(--text-secondary)] text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto mt-2">
            Not just another Educational ERP. An ecosystem of independent platforms designed to evolve together while remaining deployable and maintainable on their own.
          </p>
        </div>

        <div data-hero-el className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50">
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-display">Scroll to read</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-12 pb-32 container-layout">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">
          
          {/* Sticky Left Rail / Progress Indicator */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-40 max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar">
              <div className="relative">
                <div className="text-[var(--text-primary)] font-display font-bold uppercase tracking-widest text-sm mb-8 opacity-50">
                  The Journey
                </div>
                
                {/* Vertical Progress Rail */}
                <div className="absolute left-[3px] top-14 bottom-0 w-[2px] bg-[var(--text-primary)]/5 rounded-full overflow-hidden">
                  <div data-progress-rail className="w-full h-full bg-[var(--accent)] transform-gpu scale-y-0 origin-top" />
                </div>

                <div className="space-y-6 relative z-10 pl-6">
                  {CONTENT.map((item) => (
                    <a 
                      key={item.num} 
                      href={`#section-${item.num}`}
                      className="group text-xs font-display uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center gap-4 transition-colors cursor-pointer block"
                    >
                      <span className="opacity-40 group-hover:opacity-100 transition-opacity">{item.num}</span>
                      <span className="truncate max-w-[180px]">{item.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Content */}
          <div data-content-col className="lg:col-span-9 space-y-24 md:space-y-32 max-w-3xl">
            {CONTENT.map((section) => (
              <article key={section.num} id={`section-${section.num}`} data-chapter className="scroll-mt-40">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-display font-bold text-3xl sm:text-4xl text-[var(--accent)]/40 leading-none">
                    {section.num}
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-tight">
                    {section.title}
                  </h2>
                </div>
                
                <div className="prose prose-invert prose-lg max-w-none prose-p:text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)]">
                  {section.content}
                </div>
              </article>
            ))}
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--text-primary)]/10 py-12 px-6 md:px-12 text-center">
        <p className="text-[var(--text-secondary)] font-display text-sm uppercase tracking-widest mb-6">End of Case Study</p>
        <a href="/#shephered" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-base)] font-display font-bold uppercase text-sm tracking-widest rounded-full hover:bg-[var(--accent)] transition-colors">
          Return to Portfolio
        </a>
      </footer>
    </div>
  );
}
