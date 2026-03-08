import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Star, Coffee, DollarSign, Briefcase, GraduationCap,
  Lightbulb, TrendingUp, Heart, Bookmark, BookmarkCheck, ChevronRight,
  Flame, Target, Sparkles, ArrowRight, CheckCircle2, Clock, Zap,
  PiggyBank, ShieldCheck, Users, Smartphone, Search, X, Quote
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { TIPS, type TipCategory, type TipDifficulty, type Tip } from '@/data/tips';
import { getTodaysQuote, DAILY_QUOTES } from '@/data/dailyQuotes';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  emoji: string;
  progress: number;
  target: number;
  reward: string;
}
    content: 'Split your income: 50% for needs (rent, food, transport), 30% for wants (entertainment, dining out), and 20% for savings. This simple framework keeps your budget balanced without being restrictive. Used by millions worldwide, it\'s the simplest starting point for any budget.',
    category: 'budgeting', difficulty: 'beginner', isFeatured: true, potentialSaving: 500,
    actionSteps: ['Calculate your monthly income after tax', 'List all fixed expenses (needs) — rent, groceries, transport', 'Set a fun-money limit (wants) — dining, entertainment', 'Automate your 20% savings transfer on payday'],
    tags: ['essential', 'beginner-friendly', 'framework']
  },
  {
    id: '9', title: 'Subscription Audit', emoji: '🔍',
    content: 'The average student pays for 4-6 subscriptions they barely use. Pull your bank statements and list every debit order. Cancel anything unused in 30 days. Common culprits: gym memberships (R300-R500/mo), streaming services you share, forgotten app trials. One audit can save R200-R600/month instantly.',
    category: 'budgeting', difficulty: 'beginner', potentialSaving: 600,
    actionSteps: ['Pull your last 3 months of bank statements', 'Highlight every recurring debit order', 'Rate each: use daily / weekly / never', 'Cancel everything rated "never" today', 'Set phone reminders before free trials end'],
    tags: ['quick-win', 'audit', 'subscriptions']
  },
  {
    id: '13', title: 'Zero-Based Budgeting', emoji: '🎯',
    content: 'Give every rand a job. Income minus all planned spending should equal R0. This doesn\'t mean spend everything — it means allocate every rand to a category including savings. Apps like 22seven (free for SA) make this easy. People who zero-base spend 15-20% less than those who don\'t budget.',
    category: 'budgeting', difficulty: 'intermediate', potentialSaving: 800,
    actionSteps: ['List your exact monthly income', 'Assign every rand to a category', 'Include "savings" as a mandatory category', 'Track daily and adjust weekly', 'Use 22seven or this app to automate tracking'],
    tags: ['advanced-budgeting', 'discipline']
  },
  {
    id: '14', title: 'The Envelope System (Digital)', emoji: '✉️',
    content: 'Allocate cash to virtual "envelopes" for each spending category. When an envelope is empty, stop spending in that category. Capitec and FNB allow sub-accounts that work like digital envelopes. This creates hard limits that credit cards don\'t.',
    category: 'budgeting', difficulty: 'beginner', potentialSaving: 700,
    actionSteps: ['Create 4-5 spending categories', 'Set a monthly limit for each', 'Use separate bank pockets or sub-accounts', 'Check balances before every purchase', 'Roll over unused amounts to savings'],
    tags: ['cash-flow', 'discipline', 'banking']
  },
  {
    id: '15', title: 'Track Every Rand for 30 Days', emoji: '📝',
    content: 'Before optimising, you need data. Track every single expense for one full month — even R5 for parking. Most people are shocked to find R500-R1,500/month in "invisible" spending: coffees, snacks, impulse buys, data top-ups. Awareness alone reduces spending by 10-15%.',
    category: 'budgeting', difficulty: 'beginner', potentialSaving: 500,
    actionSteps: ['Download this app or use a notebook', 'Record every purchase immediately', 'Categorise at end of each day', 'Review totals weekly', 'Identify your top 3 "leak" categories'],
    tags: ['awareness', 'data', 'first-step']
  },
  {
    id: '16', title: 'Bill Negotiation Scripts', emoji: '📞',
    content: 'Call your service providers and negotiate. "I\'ve been a loyal customer and found a better deal elsewhere — can you match it?" works 60% of the time. Target: cell phone contract, insurance, internet. SA providers like Vodacom, MTN, and Telkom have retention departments specifically for this.',
    category: 'budgeting', difficulty: 'intermediate', potentialSaving: 1200,
    actionSteps: ['List all your monthly service providers', 'Research competitor prices for each', 'Call and ask for their "retention department"', 'Mention the competitor offer and ask them to match', 'If they refuse, actually switch — loyalty tax is real'],
    tags: ['negotiation', 'bills', 'phone']
  },

  // === STUDENT ===
  {
    id: '2', title: 'Meal Prep Like a Pro', emoji: '🍱',
    content: 'Cook meals in bulk on Sundays — rice, chicken, veggies. Freeze portions for the week. Students who meal prep save R800-R1,200/month compared to buying takeaways daily. A full week\'s groceries costs R250-R400 versus R80-R120/day on takeaways. That\'s R2,400/mo vs R400/mo.',
    category: 'student', difficulty: 'beginner', potentialSaving: 1000,
    actionSteps: ['Plan 5 meals for the week on Saturday', 'Buy ingredients in bulk at Checkers/PnP/Shoprite', 'Cook 2-3 large batches on Sunday', 'Portion into labelled containers', 'Freeze what you won\'t eat in 3 days'],
    tags: ['food', 'weekly-habit', 'cooking']
  },
  {
    id: '4', title: 'Textbook Hacks', emoji: '📚',
    content: 'Never buy new textbooks at full price. A R800 textbook can be found for R200-R300 secondhand. Check Takealot, campus notice boards, WhatsApp groups, or use LibGen/Z-Library for digital copies. International editions are identical content but 60% cheaper. Some lecturers also put readings on library reserve.',
    category: 'student', difficulty: 'beginner', potentialSaving: 2000,
    actionSteps: ['Check if the library has reserve copies first', 'Search Takealot, Facebook Marketplace, Gumtree', 'Join campus WhatsApp book exchange groups', 'Ask senior students — many sell at semester end', 'Split textbook costs with study group members'],
    tags: ['academic', 'quick-win', 'textbooks']
  },
  {
    id: '6', title: 'Student Discount Everything', emoji: '🎓',
    content: 'Your student card is literally a discount card. Spotify Student R30/mo (vs R60), Apple Music R35/mo, Ster-Kinekor R50 tickets, Nando\'s 20% off, Steers student combos, free Microsoft Office 365, free GitHub Pro, free Canva Pro, discounted Adobe Creative Cloud. Always ask before paying — worst case they say no.',
    category: 'student', difficulty: 'beginner', potentialSaving: 400,
    actionSteps: ['Ensure your student card is validated and current', 'Sign up for Spotify/Apple Music student plans', 'Get free Microsoft Office via your university email', 'Claim GitHub Student Developer Pack (free)', 'Always ask "do you have a student discount?" everywhere'],
    tags: ['discounts', 'easy', 'free-stuff']
  },
  {
    id: '11', title: 'Transport Savings', emoji: '🚌',
    content: 'Transport is often a student\'s 2nd biggest expense. Uber from Braamfontein to Sandton: R80-R120. MyCiTi bus: R15. Rea Vaya: R12. Walking or cycling for distances under 3km saves R500+/month. Lift clubs via WhatsApp groups split fuel costs 3-4 ways. A monthly Gautrain bus pass is R750 for unlimited rides.',
    category: 'student', difficulty: 'beginner', potentialSaving: 700,
    actionSteps: ['Calculate your monthly transport spend', 'Compare: Uber vs bus vs taxi vs walking', 'Join campus lift club WhatsApp groups', 'Buy a monthly MyCiTi/Rea Vaya/Gautrain pass', 'Cycle or walk for trips under 3km'],
    tags: ['transport', 'daily', 'commute']
  },
  {
    id: '17', title: 'Free Campus Resources', emoji: '🏫',
    content: 'Your tuition fees include access to resources most students never use: free Wi-Fi (save R200-R500/mo on data), free printing quotas, free counselling, free gym access at some universities, career services, writing centres, and legal aid clinics. UCT, Wits, Stellenbosch, UP all offer these.',
    category: 'student', difficulty: 'beginner', potentialSaving: 500,
    actionSteps: ['Check your university\'s student services website', 'Use campus Wi-Fi instead of buying data', 'Use your free printing/copying quota', 'Book free counselling if needed', 'Attend free career workshops and mock interviews'],
    tags: ['free', 'campus', 'resources']
  },
  {
    id: '18', title: 'Res vs Digs Cost Analysis', emoji: '🏠',
    content: 'University residence often seems expensive (R30K-R60K/year), but it includes electricity, Wi-Fi, water, security, and proximity to campus. Off-campus digs at R3,500/mo = R42K/year + R500 electricity + R400 WiFi + R700 transport = R61K. Always do the full cost comparison including hidden expenses.',
    category: 'student', difficulty: 'intermediate', potentialSaving: 3000,
    actionSteps: ['List ALL costs of your current living situation', 'Include: rent, electricity, water, WiFi, transport, security', 'Compare with 2-3 alternatives', 'Factor in time cost of commuting', 'Consider sharing a flat to split costs 2-3 ways'],
    tags: ['accommodation', 'analysis', 'big-decision']
  },
  {
    id: '19', title: 'Data & Airtime Savings', emoji: '📱',
    content: 'Stop buying daily data bundles — they\'re 3-5x more expensive than monthly deals. Vodacom 1GB daily = R15 × 30 = R450/mo. Vodacom 30-day 10GB = R149. That\'s 10x more data for 1/3 the price. Use campus Wi-Fi when available. Download lectures/videos on Wi-Fi to watch offline.',
    category: 'student', difficulty: 'beginner', potentialSaving: 350,
    actionSteps: ['Check your monthly data spend in your banking app', 'Compare daily vs monthly bundle prices', 'Switch to a monthly data deal', 'Download content on Wi-Fi for offline use', 'Use WhatsApp calls over regular calls (uses less data)'],
    tags: ['data', 'phone', 'quick-win']
  },
  {
    id: '20', title: 'NSFAS & Bursary Maximization', emoji: '🎒',
    content: 'If you receive NSFAS, understand exactly what\'s covered: tuition, accommodation, food allowance (R15,000/year), book allowance (R5,460/year), transport allowance, and personal care allowance. Many students don\'t claim all allowances. Also apply for external bursaries — Fasset, Allan Gray, Investec all fund students.',
    category: 'student', difficulty: 'intermediate', potentialSaving: 5000,
    actionSteps: ['Review your NSFAS allocation letter carefully', 'Ensure you\'re claiming all allowances', 'Apply to 10+ external bursaries on bursaries.co.za', 'Keep all receipts for allowance claims', 'Check with financial aid office for unclaimed funds'],
    tags: ['funding', 'bursaries', 'NSFAS']
  },

  // === SAVING ===
  {
    id: '3', title: 'Emergency Fund Strategy', emoji: '🛡️',
    content: 'An emergency fund prevents you from going into debt when life happens — car breaks down, phone stolen, medical emergency. Target: 3-6 months of basic expenses. Start with just R200/month. In a year that\'s R2,400. In a Money Market account earning 8-9% interest, it grows even while you sleep.',
    category: 'saving', difficulty: 'intermediate', isFeatured: true, potentialSaving: 6000,
    actionSteps: ['Calculate your monthly essential expenses', 'Set a target: 3 months\' worth minimum', 'Open a separate Money Market savings account', 'Set up automatic R200-R500 monthly transfer', 'Only touch it for genuine emergencies — not FOMO'],
    tags: ['critical', 'long-term', 'safety-net']
  },
  {
    id: '21', title: 'The Pay-Yourself-First Method', emoji: '💰',
    content: 'On payday, immediately transfer your savings amount BEFORE spending on anything else. Most people save what\'s "left over" — which is usually nothing. By paying yourself first, you adapt your spending to what remains. Even R300/month becomes R3,600/year + interest.',
    category: 'saving', difficulty: 'beginner', potentialSaving: 3600,
    actionSteps: ['Decide on a fixed savings amount (start with 10% of income)', 'Set up a debit order for payday', 'Transfer to a separate account automatically', 'Learn to live on what\'s left', 'Increase by R50 every 3 months'],
    tags: ['automation', 'habit', 'essential']
  },
  {
    id: '22', title: 'The Savings Snowball', emoji: '⛄',
    content: 'Start with one tiny savings goal (R500 for something specific). Once you hit it, the dopamine hit motivates bigger goals. R500 → R1,000 → R5,000 → R10,000. Each win builds momentum. Research shows small early wins are the #1 predictor of long-term saving success.',
    category: 'saving', difficulty: 'beginner', potentialSaving: 2000,
    actionSteps: ['Set your first mini-goal: R500', 'Save R20-R50 per week toward it', 'Celebrate when you hit it (cheaply!)', 'Immediately set the next goal: R1,000', 'Track progress visually — seeing growth motivates'],
    tags: ['motivation', 'psychology', 'goals']
  },
  {
    id: '23', title: 'Round-Up Savings', emoji: '🔄',
    content: 'Round up every purchase to the nearest R10 and save the difference. Buy coffee for R37? Round to R40, save R3. It feels like nothing, but averages R15-R30/day = R450-R900/month. Capitec and TymeBank have automatic round-up features built into their apps.',
    category: 'saving', difficulty: 'beginner', potentialSaving: 700,
    actionSteps: ['Check if your bank app has a round-up feature', 'If not, manually transfer round-ups daily', 'Set round-up to nearest R5 or R10', 'Don\'t touch the round-up account for 3 months', 'Be amazed at how much accumulates'],
    tags: ['micro-saving', 'automation', 'painless']
  },
  {
    id: '24', title: 'Savings Account Interest Comparison', emoji: '🏦',
    content: 'Not all savings accounts are equal. Standard savings accounts pay 3-4% interest. Money Market accounts pay 7-9%. Fixed deposits pay 8-11% but lock your money. African Bank pays 9.25% on their Money Market. TymeBank GoalSave pays 9%. That interest difference on R10,000 = R300-R700/year extra for free.',
    category: 'saving', difficulty: 'intermediate', potentialSaving: 500,
    actionSteps: ['Check your current savings account interest rate', 'Compare: African Bank, TymeBank, Discovery, Capitec', 'Move savings to the highest-interest option', 'Consider a notice deposit for medium-term goals', 'Re-compare rates every 6 months (they change)'],
    tags: ['interest', 'banking', 'optimisation']
  },

  // === EARNING ===
  {
    id: '5', title: 'Side Hustle Starter Pack', emoji: '💼',
    content: 'Tutoring pays R150-R300/hr, freelance design R200+/hr, content creation can be monetised. Pick something that builds skills in your field — earn while you learn. A BCom student doing bookkeeping, an IT student doing web dev, a law student doing contract reviews. 10hrs/week × R200/hr = R8,000/month extra.',
    category: 'earning', difficulty: 'intermediate', potentialSaving: 3000,
    actionSteps: ['Identify your top 3 marketable skills', 'Create a simple portfolio or WhatsApp Business profile', 'Start on Fiverr, Upwork, or campus notice boards', 'Dedicate 5-10 hrs/week consistently', 'Raise your rates every 3 months as you build reputation'],
    tags: ['income', 'skill-building', 'freelance']
  },
  {
    id: '25', title: 'Campus Job Opportunities', emoji: '🏢',
    content: 'Most universities hire students as tutors (R80-R150/hr), lab assistants (R60-R100/hr), library assistants (R50-R70/hr), or res mentors (free accommodation + stipend). These jobs work around your schedule and look great on your CV. Apply at your faculty office or student employment office.',
    category: 'earning', difficulty: 'beginner', potentialSaving: 2000,
    actionSteps: ['Visit your university\'s student employment office', 'Check faculty notice boards for tutor positions', 'Apply to be a res mentor or orientation leader', 'Ask lecturers if they need research assistants', 'Check the university website careers page weekly'],
    tags: ['campus', 'part-time', 'CV-building']
  },
  {
    id: '26', title: 'Sell What You Don\'t Use', emoji: '🛍️',
    content: 'The average student has R2,000-R5,000 worth of unused items: old textbooks, clothes, electronics, furniture. Facebook Marketplace, Gumtree, campus groups, and Yaga (SA fashion resale) are easy platforms. One weekend declutter session can fund a month of savings.',
    category: 'earning', difficulty: 'beginner', potentialSaving: 2500,
    actionSteps: ['Go through your room — pile up everything unused for 3+ months', 'Photograph items in good lighting', 'List on Facebook Marketplace & campus WhatsApp groups', 'Price at 40-60% of retail for quick sales', 'Put all proceeds straight into savings'],
    tags: ['declutter', 'quick-cash', 'easy']
  },
  {
    id: '27', title: 'Build a Digital Skill', emoji: '💻',
    content: 'High-demand digital skills you can learn free: Python (freeCodeCamp), graphic design (Canva), video editing (DaVinci Resolve is free), social media management, copywriting, data analysis (Google certificates). 3-6 months of learning → R5,000-R20,000/month freelance income. SA has a massive digital skills shortage.',
    category: 'earning', difficulty: 'intermediate', potentialSaving: 5000,
    actionSteps: ['Pick ONE skill aligned with your interests', 'Complete a free online course (Coursera, freeCodeCamp, Google)', 'Build 3 portfolio projects', 'Offer services at 50% market rate to get first clients', 'Gradually increase rates as reviews come in'],
    tags: ['skills', 'long-term', 'high-value']
  },
  {
    id: '28', title: 'Content Creation as Income', emoji: '🎥',
    content: 'TikTok, YouTube, Instagram, and blogs can generate income through brand deals, affiliate marketing, and ad revenue. SA micro-influencers (5K-20K followers) earn R500-R5,000 per brand post. Pick a niche (student life, finance, tech reviews), post consistently, and monetise at 1K+ followers.',
    category: 'earning', difficulty: 'advanced', potentialSaving: 4000,
    actionSteps: ['Choose your platform and niche', 'Create 30 pieces of content before expecting results', 'Post consistently — 3-5x per week minimum', 'Engage with your community genuinely', 'Reach out to small SA brands for collaborations at 1K followers'],
    tags: ['social-media', 'creative', 'passive-income']
  },

  // === INVESTING ===
  {
    id: '7', title: 'Start Investing with R100', emoji: '📈',
    content: 'You don\'t need thousands to start. EasyEquities lets you invest from R100. Buy ETFs like the Satrix Top 40 — it tracks SA\'s biggest 40 companies. Historical return: ~12% per year. R500/month invested from age 20 at 12% = R3.5 million by age 50. Time in the market always beats timing the market.',
    category: 'investing', difficulty: 'intermediate', potentialSaving: 1200,
    actionSteps: ['Open a free EasyEquities account (takes 10 mins)', 'Start with Satrix Top 40 ETF or Satrix MSCI World', 'Set up monthly R100-R500 auto-invest', 'Don\'t check daily — invest and forget', 'Never panic sell during market dips — they recover'],
    tags: ['wealth-building', 'long-term', 'ETFs']
  },
  {
    id: '12', title: 'Tax-Free Savings Account (TFSA)', emoji: '🏦',
    content: 'SA allows R36,000/year (R3,000/mo) into a tax-free savings account with a R500K lifetime limit. ALL growth is tax-free — no capital gains tax, no dividend tax, no income tax on interest. If you invest R3,000/mo from age 22 to 30 (just 8 years) in a TFSA earning 12%, you\'ll have R500K+ that grows tax-free forever.',
    category: 'investing', difficulty: 'advanced', potentialSaving: 3000,
    actionSteps: ['Open a TFSA at EasyEquities, Satrix, or your bank', 'Choose a low-cost equity ETF (fees < 0.5%)', 'Contribute R500-R3,000/month', 'Max out R36K/year if you possibly can', 'NEVER withdraw — let compound interest work for decades'],
    tags: ['tax', 'wealth-building', 'essential']
  },
  {
    id: '29', title: 'Understand Compound Interest', emoji: '🧮',
    content: 'Einstein called it the 8th wonder of the world. R1,000 invested at 12% per year: after 10 years = R3,106. After 20 years = R9,646. After 30 years = R29,960. Your money makes money, and then THAT money makes money. Starting at 20 vs 30 can mean 3-5x more wealth at retirement — same contributions.',
    category: 'investing', difficulty: 'beginner', potentialSaving: 2000,
    actionSteps: ['Use an online compound interest calculator', 'Compare starting now vs starting in 5 years', 'Even R100/month matters — just start', 'Reinvest all returns — never withdraw early', 'Increase contributions as your income grows'],
    tags: ['fundamentals', 'long-term', 'wealth']
  },
  {
    id: '30', title: 'Avoid These Investment Scams', emoji: '⚠️',
    content: 'If someone promises guaranteed returns above 15-20%, it\'s likely a scam. Red flags: "guaranteed" returns, pressure to recruit others (pyramid scheme), unregistered with FSCA, WhatsApp investment groups promising 30%+ returns. In SA, MMM, Kipi, and dozens of Ponzi schemes have stolen billions from students and families.',
    category: 'investing', difficulty: 'beginner', potentialSaving: 5000,
    actionSteps: ['Check if any investment is registered with the FSCA', 'If returns sound too good to be true, they are', 'Never invest money you can\'t afford to lose completely', 'Stick to regulated platforms: EasyEquities, Satrix, banks', 'Report suspected scams to FSCA: 0800 110 443'],
    tags: ['safety', 'scams', 'critical']
  },
  {
    id: '31', title: 'Global vs Local Investing', emoji: '🌍',
    content: 'Don\'t put all your money in SA only. The rand weakens ~5% per year against the dollar long-term. Investing offshore protects against rand depreciation. The Satrix MSCI World ETF or S&P 500 ETF gives you exposure to Apple, Google, Amazon etc. via your SA brokerage — no foreign account needed.',
    category: 'investing', difficulty: 'advanced', potentialSaving: 2000,
    actionSteps: ['Understand the difference: SA equities vs global equities', 'Allocate 40-60% of investments to global ETFs', 'Use Satrix MSCI World or 1nvest S&P 500 on EasyEquities', 'Keep some SA exposure for local growth', 'Rebalance once per year'],
    tags: ['diversification', 'offshore', 'advanced']
  },

  // === LIFESTYLE ===
  {
    id: '8', title: 'The No-Spend Challenge', emoji: '🚫',
    content: 'Pick one day per week where you spend R0. Bring lunch, skip coffee shops, walk instead of Uber, stream instead of going out. Over a month, this saves R500-R1,000 without major lifestyle changes. Over a year, that\'s R6,000-R12,000. It also retrains your brain to find free alternatives.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 800,
    actionSteps: ['Choose your no-spend day (Mondays work great)', 'Prep meals and snacks the night before', 'Find free entertainment: YouTube, library, park walks', 'Track your savings in a note on your phone', 'Challenge friends to join — accountability helps'],
    tags: ['challenge', 'mindset', 'weekly']
  },
  {
    id: '10', title: 'The 24-Hour Rule', emoji: '⏰',
    content: 'Before any non-essential purchase over R200, wait 24 hours. If you still want it after sleeping on it, buy it. This eliminates 70% of impulse purchases. For items over R1,000, wait a full week. The "add to cart and abandon" technique lets dopamine fade before you spend.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 1500,
    actionSteps: ['Add items to your online cart but DON\'T checkout', 'Write the item and price in your notes app', 'Set a 24-hour timer', 'After 24 hours, ask: "Do I need this or just want this?"', 'If you still want it, budget for it from your "wants" category'],
    tags: ['mindset', 'impulse-control', 'psychology']
  },
  {
    id: '32', title: 'Free Entertainment Guide', emoji: '🎭',
    content: 'Joburg: free entry to Constitution Hill, Neighbourgoods Market (window shopping), Zoo Lake, Delta Park. Cape Town: free Kirstenbosch on Tuesdays, Sea Point Promenade, Bo-Kaap walks, Camps Bay sunset. Durban: beachfront, uShaka free zones, Moses Mabhida walks. You don\'t need money to have amazing weekends.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 600,
    actionSteps: ['Make a list of free activities in your city', 'Plan 2 free activities per weekend', 'Suggest free hangouts to friends proactively', 'Follow local "free events" Instagram pages', 'Explore nature — hiking is free and incredible in SA'],
    tags: ['fun', 'free', 'social']
  },
  {
    id: '33', title: 'Coffee Shop Math', emoji: '☕',
    content: 'A R45 cappuccino every weekday = R225/week = R990/month = R11,880/year. A French press + good coffee beans at home = R30/week = R130/month = R1,560/year. That\'s R10,320 saved per year. If invested at 12%, that\'s R185,000 over 10 years. Your daily coffee could literally buy you a car.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 10000,
    actionSteps: ['Buy a R200 French press or R300 moka pot', 'Buy quality beans from local roasters (R120/kg)', 'Make coffee at home on weekdays', 'Allow yourself 1-2 coffee shop visits per week as a treat', 'Invest the difference — R800/month minimum'],
    tags: ['latte-factor', 'daily-habit', 'high-impact']
  },
  {
    id: '34', title: 'Social Media Spending Triggers', emoji: '🧠',
    content: 'Instagram ads, TikTok hauls, and influencer marketing are designed to make you feel you NEED things. Studies show people who spend 2+ hours on social media spend 30% more than average. Unfollow accounts that make you want to buy things. Follow finance accounts instead. Your feed shapes your financial habits.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 1200,
    actionSteps: ['Audit who you follow — unfollow "haul" accounts', 'Follow SA finance creators instead', 'Remove saved payment methods from apps', 'Turn off push notifications from shopping apps', 'When you see an ad you like, screenshot it and wait 7 days'],
    tags: ['psychology', 'social-media', 'awareness']
  },
  {
    id: '35', title: 'Electricity & Water Savings', emoji: '💡',
    content: 'Small changes = big savings. Shower 5 mins instead of 10: save R200/mo. Switch to LED bulbs: save R100/mo. Geyser timer: save R300/mo. Unplug chargers/appliances: save R50/mo. Cook with lids on pots: 30% faster = less electricity. These tiny habits save R500-R800/month combined.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 700,
    actionSteps: ['Install a geyser timer (set to heat 5-6am and 4-5pm)', 'Replace all bulbs with LEDs', 'Time your showers — aim for 5 minutes', 'Unplug everything not in use (especially phone chargers)', 'Cook with lids and use the right pot size for the plate'],
    tags: ['utilities', 'daily', 'environment']
  },
  {
    id: '36', title: 'Health on a Budget', emoji: '🏃',
    content: 'Gym membership: R300-R700/mo. Running, bodyweight exercises, YouTube workouts: R0. If you want a gym, Planet Fitness is R99/mo. Many university gyms are free with your student card. For healthy eating: frozen veggies are just as nutritious as fresh but 50% cheaper. Buy in-season fruit.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 500,
    actionSteps: ['Check if your university has a free gym', 'Try YouTube HIIT workouts (no equipment needed)', 'Buy frozen vegetables — same nutrition, longer shelf life', 'Drink water instead of sugary drinks (saves R300-R500/mo)', 'Cook at home — restaurant "healthy" food costs 3x more'],
    tags: ['health', 'fitness', 'nutrition']
  },
  {
    id: '37', title: 'Bulk Buying Strategy', emoji: '🛒',
    content: 'Buying non-perishables in bulk saves 20-40%. Makro, Jumbo Cash & Carry, and PnP bulk sections are your friends. Split bulk purchases with flatmates: 10kg rice, 5L cooking oil, bulk toilet paper. Never bulk-buy perishables unless you can freeze them. Track price per unit, not total price.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 600,
    actionSteps: ['Make a list of items you use every month', 'Compare unit prices: bulk vs regular at Checkers/PnP', 'Split large purchases with flatmates or friends', 'Stock up on non-perishables when on sale', 'Use Checkers Sixty60 or PnP asap for price comparison'],
    tags: ['groceries', 'shopping', 'smart-buying']
  },
  {
    id: '38', title: 'Insurance You Actually Need', emoji: '🔐',
    content: 'As a student, you probably DON\'T need life insurance or comprehensive car insurance on a cheap car. What you DO need: phone insurance if your phone costs R5K+ (R70-R150/mo), laptop insurance (R50-R100/mo), and basic medical cover via your parents\' plan or university health services. Don\'t over-insure.',
    category: 'lifestyle', difficulty: 'intermediate', potentialSaving: 800,
    actionSteps: ['List what you currently have insured', 'Ask: "can I afford to replace this myself?"', 'If yes, self-insure (skip the premium)', 'If no, shop around — use Hippo.co.za to compare', 'Check if parents\' policies cover your belongings'],
    tags: ['insurance', 'protection', 'adulting']
  },
];

const CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'No-Spend Week', description: 'Go 7 full days with only essential spending (rent, transport, basic groceries)', duration: '7 days', difficulty: 'intermediate', emoji: '🚫', progress: 3, target: 7, reward: 'Save ~R500' },
  { id: 'c2', title: 'Pack Lunch Challenge', description: 'Bring lunch from home every single day for 2 weeks — no takeaways allowed', duration: '14 days', difficulty: 'beginner', emoji: '🍱', progress: 8, target: 14, reward: 'Save ~R700' },
  { id: 'c3', title: 'R5 Coin Jar', description: 'Save every R5 coin you receive for a full month — don\'t spend any', duration: '30 days', difficulty: 'beginner', emoji: '🪙', progress: 15, target: 30, reward: 'Save ~R300' },
  { id: 'c4', title: '52-Week Savings Ladder', description: 'Week 1: save R10, Week 2: R20, Week 3: R30... increasing R10 each week', duration: '52 weeks', difficulty: 'advanced', emoji: '📈', progress: 12, target: 52, reward: 'Save R13,780' },
  { id: 'c5', title: 'Coffee Detox Month', description: 'Make all coffee at home for 30 days — no coffee shops', duration: '30 days', difficulty: 'intermediate', emoji: '☕', progress: 0, target: 30, reward: 'Save ~R900' },
  { id: 'c6', title: 'Sell 10 Things Challenge', description: 'Find and sell 10 unused items from your room this month', duration: '30 days', difficulty: 'beginner', emoji: '🛍️', progress: 0, target: 10, reward: 'Earn R1,000-R3,000' },
  { id: 'c7', title: 'Track Every Rand', description: 'Log every single expense for 30 days without missing one', duration: '30 days', difficulty: 'intermediate', emoji: '📝', progress: 0, target: 30, reward: 'Awareness = 15% less spending' },
  { id: 'c8', title: '30-Day Investment Start', description: 'Open an investment account and make your first R100 investment', duration: '30 days', difficulty: 'beginner', emoji: '🚀', progress: 0, target: 1, reward: 'Start your wealth journey' },
];

const CATEGORY_META: Record<TipCategory, { icon: React.ReactNode; label: string; color: string }> = {
  student: { icon: <GraduationCap size={14} />, label: 'Student', color: 'bg-primary/15 text-primary' },
  budgeting: { icon: <DollarSign size={14} />, label: 'Budgeting', color: 'bg-accent/15 text-accent-foreground' },
  saving: { icon: <PiggyBank size={14} />, label: 'Saving', color: 'bg-success/15 text-success' },
  earning: { icon: <Briefcase size={14} />, label: 'Earning', color: 'bg-warning/15 text-warning' },
  investing: { icon: <TrendingUp size={14} />, label: 'Investing', color: 'bg-destructive/15 text-destructive' },
  lifestyle: { icon: <Coffee size={14} />, label: 'Lifestyle', color: 'bg-muted text-muted-foreground' },
};

const DIFFICULTY_META: Record<TipDifficulty, { label: string; color: string }> = {
  beginner: { label: 'Easy', color: 'bg-success/10 text-success' },
  intermediate: { label: 'Medium', color: 'bg-warning/10 text-warning' },
  advanced: { label: 'Advanced', color: 'bg-destructive/10 text-destructive' },
};

const TipsPage: React.FC = () => {
  const { totalExpenses, totalIncome } = useBudget();
  const [activeTab, setActiveTab] = useState('tips');
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedTips, setSavedTips] = useState<Set<string>>(new Set(['1', '3']));
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<number>>>({});

  const filteredTips = useMemo(() =>
    TIPS
      .filter(t => !selectedCategory || t.category === selectedCategory)
      .filter(t => !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.content.toLowerCase().includes(searchTerm.toLowerCase()) || t.tags?.some(tag => tag.includes(searchTerm.toLowerCase()))),
    [selectedCategory, searchTerm]
  );

  const featuredTips = TIPS.filter(t => t.isFeatured);
  const totalPotentialSaving = TIPS.reduce((s, t) => s + (t.potentialSaving || 0), 0);
  const savedTipsList = TIPS.filter(t => savedTips.has(t.id));

  const toggleSaved = (id: string) => {
    setSavedTips(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Removed from saved'); }
      else { next.add(id); toast.success('Tip saved! 🔖'); }
      return next;
    });
  };

  const toggleStep = (tipId: string, stepIdx: number) => {
    setCompletedSteps(prev => {
      const steps = new Set(prev[tipId] || []);
      if (steps.has(stepIdx)) steps.delete(stepIdx); else steps.add(stepIdx);
      return { ...prev, [tipId]: steps };
    });
  };

  const getPersonalizedTips = () => {
    const spendRate = totalIncome > 0 ? totalExpenses / totalIncome : 0;
    if (spendRate > 0.8) return TIPS.filter(t => t.category === 'budgeting' || t.category === 'saving').slice(0, 3);
    if (spendRate > 0.5) return TIPS.filter(t => t.category === 'saving' || t.category === 'investing').slice(0, 3);
    return TIPS.filter(t => t.category === 'investing' || t.category === 'earning').slice(0, 3);
  };

  const personalizedTips = getPersonalizedTips();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 pb-28">
      {/* Ambient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-20 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-1/3 -left-20 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '16s' }} />
      </div>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border py-5 px-4 sticky top-0 z-20">
        <div className="container mx-auto max-w-lg">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Lightbulb size={16} className="text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">Financial Tips</h1>
                    <p className="text-[11px] text-muted-foreground">Smart money moves for students</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="bg-success/10 rounded-lg px-2.5 py-1 text-center">
                  <p className="text-[10px] text-muted-foreground">Can save</p>
                  <p className="text-xs font-bold text-success">{formatCurrency(totalPotentialSaving)}/yr</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 space-y-4 max-w-lg">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full bg-card/60 backdrop-blur-md border border-border">
            <TabsTrigger value="tips" className="text-xs gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Lightbulb size={13} /> Tips
            </TabsTrigger>
            <TabsTrigger value="foryou" className="text-xs gap-1 data-[state=active]:bg-accent/10 data-[state=active]:text-accent-foreground">
              <Sparkles size={13} /> For You
            </TabsTrigger>
            <TabsTrigger value="challenges" className="text-xs gap-1 data-[state=active]:bg-warning/10 data-[state=active]:text-warning">
              <Flame size={13} /> Challenges
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-xs gap-1 data-[state=active]:bg-success/10 data-[state=active]:text-success">
              <Bookmark size={13} /> Saved
            </TabsTrigger>
          </TabsList>

          {/* TIPS TAB */}
          <TabsContent value="tips">
            <AnimatePresence mode="wait">
              <motion.div key="tips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                {/* Featured Carousel */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/15 p-4">
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium flex items-center gap-1">
                      <Star size={10} /> Featured
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {featuredTips.map((tip, i) => (
                      <motion.div key={tip.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={i > 0 ? 'hidden' : ''}>
                        <span className="text-3xl">{tip.emoji}</span>
                        <h3 className="text-base font-bold text-foreground mt-2">{tip.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tip.content}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${CATEGORY_META[tip.category].color} flex items-center gap-1`}>
                            {CATEGORY_META[tip.category].icon} {CATEGORY_META[tip.category].label}
                          </span>
                          {tip.potentialSaving && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                              Save ~{formatCurrency(tip.potentialSaving)}/yr
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Search & Category Filters */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-3 border border-border space-y-2.5">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tips..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-background/50 border-border h-9 text-sm"
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5">
                        <X size={14} className="text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                    >
                      All ({TIPS.length})
                    </button>
                    {(Object.entries(CATEGORY_META) as [TipCategory, typeof CATEGORY_META[TipCategory]][]).map(([key, meta]) => {
                      const count = TIPS.filter(t => t.category === key).length;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                          className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1 ${selectedCategory === key ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                        >
                          {meta.icon} {meta.label} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tips List */}
                <div className="space-y-2">
                  {filteredTips.map((tip, idx) => {
                    const isExpanded = expandedTip === tip.id;
                    const tipSteps = completedSteps[tip.id] || new Set();
                    const stepsTotal = tip.actionSteps?.length || 0;
                    const stepsDone = tipSteps.size;

                    return (
                      <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        layout
                        className="bg-card/60 backdrop-blur-xl rounded-xl border border-border overflow-hidden"
                      >
                        <div
                          className="p-3.5 cursor-pointer hover:bg-muted/20 transition-colors"
                          onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center text-xl flex-shrink-0">
                              {tip.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleSaved(tip.id); }}
                                  className="flex-shrink-0 ml-2"
                                >
                                  {savedTips.has(tip.id) ? (
                                    <BookmarkCheck size={16} className="text-primary" />
                                  ) : (
                                    <Bookmark size={16} className="text-muted-foreground hover:text-primary transition-colors" />
                                  )}
                                </button>
                              </div>
                              <p className={`text-xs text-muted-foreground mt-0.5 ${isExpanded ? '' : 'line-clamp-2'}`}>{tip.content}</p>
                              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${CATEGORY_META[tip.category].color} flex items-center gap-0.5`}>
                                  {CATEGORY_META[tip.category].icon} {CATEGORY_META[tip.category].label}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${DIFFICULTY_META[tip.difficulty].color}`}>
                                  {DIFFICULTY_META[tip.difficulty].label}
                                </span>
                                {tip.potentialSaving && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success">
                                    ~{formatCurrency(tip.potentialSaving)}/yr
                                  </span>
                                )}
                                {stepsTotal > 0 && stepsDone > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {stepsDone}/{stepsTotal} done
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && tip.actionSteps && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3.5 pb-3.5 border-t border-border pt-3">
                                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                                  <Target size={12} className="text-primary" /> Action Steps
                                </p>
                                {stepsTotal > 0 && (
                                  <div className="mb-2.5">
                                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                      <span>Progress</span>
                                      <span>{stepsDone}/{stepsTotal}</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stepsDone / stepsTotal) * 100}%` }}
                                        className="h-full rounded-full bg-primary"
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="space-y-1.5">
                                  {tip.actionSteps.map((step, i) => (
                                    <button
                                      key={i}
                                      onClick={() => toggleStep(tip.id, i)}
                                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all text-xs ${tipSteps.has(i) ? 'bg-success/10 line-through text-muted-foreground' : 'bg-muted/20 hover:bg-muted/30 text-foreground'}`}
                                    >
                                      <CheckCircle2 size={14} className={tipSteps.has(i) ? 'text-success' : 'text-muted-foreground'} />
                                      {step}
                                    </button>
                                  ))}
                                </div>
                                {tip.tags && (
                                  <div className="flex gap-1 mt-2.5 flex-wrap">
                                    {tip.tags.map(tag => (
                                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted/40 text-muted-foreground">#{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                  {filteredTips.length === 0 && (
                    <div className="bg-card/60 backdrop-blur-xl rounded-xl p-8 border border-border text-center">
                      <Search size={28} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No tips found</p>
                      <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}>Clear filters</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* FOR YOU TAB */}
          <TabsContent value="foryou">
            <AnimatePresence mode="wait">
              <motion.div key="foryou" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-3">
                {/* Personalized Header */}
                <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Personalized for You</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on your spending pattern ({totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}% of income), here are tips that can help most.
                  </p>
                </div>

                {/* Personalized Tips */}
                {personalizedTips.map((tip, idx) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                        {tip.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-foreground">{tip.title}</h3>
                          {tip.potentialSaving && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                              ~{formatCurrency(tip.potentialSaving)}/yr
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{tip.content}</p>
                        {tip.actionSteps && (
                          <div className="mt-2.5 space-y-1">
                            {tip.actionSteps.slice(0, 2).map((step, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <ArrowRight size={10} className="text-primary flex-shrink-0" />
                                {step}
                              </div>
                            ))}
                            {(tip.actionSteps.length > 2) && (
                              <p className="text-[10px] text-primary cursor-pointer" onClick={() => { setActiveTab('tips'); setExpandedTip(tip.id); }}>
                                +{tip.actionSteps.length - 2} more steps →
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Quick Stats */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-warning" /> Quick Wins
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TIPS.filter(t => t.difficulty === 'beginner' && t.potentialSaving).slice(0, 4).map(tip => (
                      <button
                        key={tip.id}
                        onClick={() => { setActiveTab('tips'); setExpandedTip(tip.id); }}
                        className="bg-muted/20 hover:bg-muted/30 rounded-lg p-2.5 text-left transition-colors"
                      >
                        <span className="text-lg">{tip.emoji}</span>
                        <p className="text-[11px] font-medium text-foreground mt-1 line-clamp-1">{tip.title}</p>
                        <p className="text-[10px] text-success">~{formatCurrency(tip.potentialSaving!)}/yr</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* CHALLENGES TAB */}
          <TabsContent value="challenges">
            <AnimatePresence mode="wait">
              <motion.div key="challenges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                <div className="bg-gradient-to-br from-warning/10 to-destructive/10 border border-warning/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame size={16} className="text-warning" />
                    <h3 className="text-sm font-bold text-foreground">Money Challenges</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Build better habits with fun savings challenges</p>
                </div>

                {CHALLENGES.map((challenge, idx) => {
                  const pct = Math.round((challenge.progress / challenge.target) * 100);
                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center text-xl flex-shrink-0">
                          {challenge.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-foreground">{challenge.title}</h3>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${DIFFICULTY_META[challenge.difficulty].color}`}>
                              {DIFFICULTY_META[challenge.difficulty].label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{challenge.description}</p>
                          <div className="mt-2.5">
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                              <span className="flex items-center gap-1"><Clock size={10} /> {challenge.duration}</span>
                              <span>{challenge.progress}/{challenge.target} · {pct}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6 }}
                                className="h-full rounded-full bg-warning"
                              />
                            </div>
                            <p className="text-[10px] text-success mt-1.5 flex items-center gap-1">
                              <Star size={10} /> Reward: {challenge.reward}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* SAVED TAB */}
          <TabsContent value="saved">
            <AnimatePresence mode="wait">
              <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                {savedTipsList.length > 0 ? (
                  <>
                    <div className="bg-card/60 backdrop-blur-xl rounded-xl p-3 border border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{savedTipsList.length} saved tips</span>
                      <span className="text-xs text-success font-medium">
                        ~{formatCurrency(savedTipsList.reduce((s, t) => s + (t.potentialSaving || 0), 0))}/yr potential
                      </span>
                    </div>
                    {savedTipsList.map((tip, idx) => (
                      <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-card/60 backdrop-blur-xl rounded-xl p-3.5 border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center text-xl flex-shrink-0">{tip.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
                              <button onClick={() => toggleSaved(tip.id)}>
                                <BookmarkCheck size={16} className="text-primary" />
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tip.content}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${CATEGORY_META[tip.category].color}`}>
                                {CATEGORY_META[tip.category].label}
                              </span>
                              {tip.potentialSaving && (
                                <span className="text-[10px] text-success">~{formatCurrency(tip.potentialSaving)}/yr</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div className="bg-card/60 backdrop-blur-xl rounded-xl p-8 border border-border text-center">
                    <Bookmark size={32} className="mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">No saved tips</h3>
                    <p className="text-xs text-muted-foreground mb-3">Bookmark tips to save them here for later</p>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setActiveTab('tips')}>
                      Browse Tips
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TipsPage;
