import { LearningTrack, Lesson, QuizQuestion } from '../types';

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'accounting',
    title: 'Financial Accounting & Reporting',
    shortDescription: 'Master financial statements, debits & credits, EBITDA, and GAAP/IFRS standards.',
    detailedDescription: 'Understand the language of business. Learn how corporate transactions flow into Balance Sheets, Income Statements, and Cash Flow Statements.',
    iconName: 'Receipt',
    themeColor: 'blue',
    bgGradient: 'from-blue-600 to-indigo-700',
    modulesCount: 4,
    totalLessons: 6,
    totalQuestions: 12,
    targetCareer: 'Audit, Corporate Controller, Equity Research'
  },
  {
    id: 'economics',
    title: 'Macro & Microeconomics',
    shortDescription: 'Analyze market mechanisms, price elasticity, monetary policy, and interest rate cycles.',
    detailedDescription: 'From supply-demand equilibrium to central banking decisions and inflation dynamics, learn how macro indicators shape global commerce.',
    iconName: 'TrendingUp',
    themeColor: 'sky',
    bgGradient: 'from-sky-500 to-blue-700',
    modulesCount: 4,
    totalLessons: 6,
    totalQuestions: 12,
    targetCareer: 'Economic Analyst, Central Banking, Strategy Consulting'
  },
  {
    id: 'finance',
    title: 'Corporate Finance & Valuation',
    shortDescription: 'Learn Time Value of Money, DCF models, WACC, CAPM, and portfolio risk management.',
    detailedDescription: 'Understand how capital allocation decisions generate enterprise value, discount cash flows across time, and evaluate risk-adjusted returns.',
    iconName: 'PieChart',
    themeColor: 'indigo',
    bgGradient: 'from-indigo-600 to-blue-900',
    modulesCount: 4,
    totalLessons: 6,
    totalQuestions: 12,
    targetCareer: 'Investment Banking, Private Equity, Asset Management'
  }
];

export const LESSONS: Lesson[] = [
  // --- ACCOUNTING TRACK ---
  {
    id: 'acc-1',
    trackId: 'accounting',
    moduleId: 'acc-mod-1',
    moduleTitle: 'Core Financial Statements',
    order: 1,
    title: 'The Fundamental Accounting Equation',
    term: 'Assets = Liabilities + Equity',
    shortDefinition: 'The bedrock of double-entry accounting stating that everything a business owns is funded by debt or owners’ equity.',
    detailedExplanation: 'Every business transaction impacts at least two accounts to maintain balance. Assets represent resources with future economic benefit (Cash, Inventory, Equipment). Liabilities represent obligations owed to outside parties (Bank Loans, Accounts Payable). Equity represents residual interest owned by shareholders (Common Stock, Retained Earnings).',
    formula: 'Assets = Liabilities + Shareholders’ Equity',
    realWorldExample: {
      companyOrContext: 'Apple Inc.',
      description: 'If Apple purchases $5B in inventory using $2B cash and $3B short-term commercial paper (debt), total assets increase by $3B ($5B inventory - $2B cash) and liabilities increase by $3B, keeping the balance sheet perfectly balanced.',
      keyMetric: 'Net Working Capital = Current Assets - Current Liabilities'
    },
    proTip: 'When solving balance sheet problems, remember: revenue increases equity (via retained earnings), while expenses and dividends decrease equity.',
    commonMisconception: 'Assets are not just physical items; intangible assets like patents, trademarks, and goodwill are also critical assets.',
    keyTakeaways: [
      'Double-entry ensures Assets always equal Liabilities + Equity.',
      'Purchasing an asset with cash does not change total asset value; it shifts liquidity.',
      'Financing through debt elevates liabilities; equity financing dilutes ownership.'
    ],
    estimatedMinutes: 5,
    xpValue: 40
  },
  {
    id: 'acc-2',
    trackId: 'accounting',
    moduleId: 'acc-mod-1',
    moduleTitle: 'Core Financial Statements',
    order: 2,
    title: 'Accrual vs. Cash Accounting',
    term: 'Accrual Accounting & Revenue Recognition',
    shortDefinition: 'Recording revenue when earned and expenses when incurred, regardless of when cash changes hands.',
    detailedExplanation: 'Under GAAP and IFRS, public corporations must use accrual accounting under the Revenue Recognition Principle (ASC 606) and Matching Principle. If Microsoft delivers software under an annual contract in January but receives payment in March, revenue is recognized in January, creating an Account Receivable.',
    formula: 'Net Income (Accrual) = Recognized Revenue - Incurred Expenses',
    realWorldExample: {
      companyOrContext: 'Salesforce (SaaS Subscriptions)',
      description: 'When a customer pays $120,000 upfront for a 1-year software license, Salesforce records $120,000 in Cash and $120,000 in Deferred (Unearned) Revenue as a liability. Each month, it recognizes $10,000 as earned revenue.',
      keyMetric: 'Deferred Revenue = Liability on the balance sheet until delivered'
    },
    proTip: 'Unearned/Deferred revenue is a liability, not an asset, because the firm owes services or goods to the client.',
    commonMisconception: 'High accounting profit does not guarantee positive operating cash flow.',
    keyTakeaways: [
      'Cash flow timing differs from accounting profit recognition.',
      'Expenses must be matched to the period in which the associated revenue is generated.',
      'Accounts Receivable = earned but uncollected; Accounts Payable = incurred but unpaid.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },
  {
    id: 'acc-3',
    trackId: 'accounting',
    moduleId: 'acc-mod-2',
    moduleTitle: 'Profitability & Earnings Quality',
    order: 3,
    title: 'EBITDA & Operating Performance',
    term: 'EBITDA (Earnings Before Interest, Taxes, Depreciation & Amortization)',
    shortDefinition: 'A key proxy for operating cash profitability that strips out capital structure, tax jurisdictions, and non-cash charges.',
    detailedExplanation: 'EBITDA allows investors to compare operational efficiency across companies regardless of whether they lease or own assets (depreciation policy) or finance via debt vs. equity (interest expense). While not a GAAP metric, it is widely utilized in M&A, leveraged buyouts (LBOs), and debt covenants.',
    formula: 'EBITDA = Operating Income (EBIT) + Depreciation + Amortization',
    realWorldExample: {
      companyOrContext: 'Telecom & Tower Companies',
      description: 'Cell tower providers invest heavily upfront in physical infrastructure leading to massive depreciation expenses. Net income may appear near zero or negative, yet EBITDA demonstrates hundreds of millions in operational cash generation.',
      keyMetric: 'EV / EBITDA multiple is the primary valuation metric in private equity.'
    },
    proTip: 'Beware: Warren Buffett famously quipped: "Does management think the tooth fairy pays for capital expenditures?" EBITDA ignores ongoing CapEx.',
    keyTakeaways: [
      'EBITDA measures pure core business operational earnings.',
      'It neutralizes distortions from varying tax rates and financing structures.',
      'Depreciation and amortization are non-cash charges added back to EBIT.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },
  {
    id: 'acc-4',
    trackId: 'accounting',
    moduleId: 'acc-mod-2',
    moduleTitle: 'Profitability & Earnings Quality',
    order: 4,
    title: 'Cash Flow Statement: The Lifeblood of Business',
    term: 'Operating, Investing & Financing Cash Flows',
    shortDefinition: 'The statement reconciling beginning and ending cash balances by tracking operational inflows, capital outlays, and financing.',
    detailedExplanation: 'The Statement of Cash Flows categorizes cash into three sections: Cash from Operations (CFO - core customer receipts less supplier payouts), Cash from Investing (CFI - CapEx, acquisitions, asset sales), and Cash from Financing (CFF - debt issuance, repayments, stock repurchases, dividends).',
    formula: 'Free Cash Flow (FCF) = Operating Cash Flow - Capital Expenditures (CapEx)',
    realWorldExample: {
      companyOrContext: 'Amazon (Early Growth Era)',
      description: 'For years, Amazon reported low or negative net income to minimize taxes while reinvesting heavily, but generated billions in operating cash flow due to favorable working capital (collecting cash from consumers immediately while paying suppliers in 90 days).',
      keyMetric: 'Cash Conversion Cycle (CCC) = Days Inventory Outstanding + Days Sales Outstanding - Days Payables Outstanding'
    },
    proTip: 'A company can survive for years with negative GAAP earnings, but will go bankrupt the moment it runs out of cash.',
    keyTakeaways: [
      'Cash from Operations is the ultimate indicator of core business vitality.',
      'CFI is typically negative for healthy growing companies reinvesting in CapEx.',
      'Free Cash Flow (FCF) represents cash available to distribute to investors.'
    ],
    estimatedMinutes: 7,
    xpValue: 45
  },
  {
    id: 'acc-5',
    trackId: 'accounting',
    moduleId: 'acc-mod-3',
    moduleTitle: 'Asset Valuation & Inventory',
    order: 5,
    title: 'Depreciation Methods: Straight-Line vs. Accelerated',
    term: 'Depreciation & Amortization Expense',
    shortDefinition: 'The systematic allocation of the cost of a tangible asset over its estimated useful economic life.',
    detailedExplanation: 'Under straight-line depreciation, expense is recognized equally each year: (Cost - Salvage Value) / Useful Life. Under accelerated methods (like Double Declining Balance or MACRS for tax), higher expense is recognized in early years, reducing early taxable income.',
    formula: 'Annual Straight-Line Depreciation = (Cost - Salvage Value) / Useful Life',
    realWorldExample: {
      companyOrContext: 'Delta Air Lines',
      description: 'Delta buys a commercial jet for $100M with a 20-year lifespan and $10M salvage value. Annual straight-line depreciation is ($100M - $10M) / 20 = $4.5M/year.',
      keyMetric: 'Accumulated Depreciation is a contra-asset account offsetting gross PP&E.'
    },
    proTip: 'Land has an indefinite life and is never depreciated under GAAP or IFRS.',
    keyTakeaways: [
      'Depreciation is a non-cash expense that provides a real tax shield.',
      'Accelerated depreciation lowers reported net income early on but boosts early cash flow through reduced tax payments.',
      'Accumulated depreciation reduces Net Book Value on the balance sheet.'
    ],
    estimatedMinutes: 5,
    xpValue: 40
  },
  {
    id: 'acc-6',
    trackId: 'accounting',
    moduleId: 'acc-mod-3',
    moduleTitle: 'Asset Valuation & Inventory',
    order: 6,
    title: 'Inventory Costing: FIFO vs. LIFO',
    term: 'FIFO (First-In, First-Out) vs. LIFO (Last-In, First-Out)',
    shortDefinition: 'Methods used to determine the Cost of Goods Sold (COGS) and ending inventory values during inflationary periods.',
    detailedExplanation: 'Under FIFO, oldest goods acquired are assumed sold first; during inflation, this results in lower COGS, higher net income, and higher ending inventory valuation. Under LIFO, newest goods are assumed sold first; this raises COGS, reduces reported net income, but reduces corporate tax liabilities (LIFO conformity rule). LIFO is allowed under US GAAP but prohibited under IFRS.',
    formula: 'COGS = Beginning Inventory + Purchases - Ending Inventory',
    realWorldExample: {
      companyOrContext: 'Oil Refiners & US Retailers',
      description: 'US oil companies using LIFO during oil price surges report higher COGS reflecting current crude prices, saving hundreds of millions in federal taxes.',
      keyMetric: 'LIFO Reserve = FIFO Inventory Value - LIFO Inventory Value'
    },
    proTip: 'IFRS does not permit LIFO because ending inventory would reflect out-of-date historical prices on the balance sheet.',
    keyTakeaways: [
      'In inflationary environments: FIFO produces higher net income; LIFO produces lower tax liabilities.',
      'FIFO inventory reflects current market replacement costs closer to fair value.',
      'LIFO is uniquely permitted under US GAAP, not IFRS.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },

  // --- ECONOMICS TRACK ---
  {
    id: 'eco-1',
    trackId: 'economics',
    moduleId: 'eco-mod-1',
    moduleTitle: 'Foundations of Market Dynamics',
    order: 1,
    title: 'Opportunity Cost & Trade-offs',
    term: 'Opportunity Cost',
    shortDefinition: 'The forgone benefit of the next-best alternative when choosing one option over another.',
    detailedExplanation: 'In economics, true economic cost encompasses both explicit out-of-pocket costs and implicit opportunity costs. When evaluating decisions—such as attending university full-time vs. working a job—the forgone salary is a crucial component of the economic cost.',
    formula: 'Economic Profit = Total Revenue - (Explicit Costs + Implicit Opportunity Costs)',
    realWorldExample: {
      companyOrContext: 'College Student Education Choice',
      description: 'Attending college costs $30,000 in tuition and books (explicit), but also costs $45,000 in forgone salary from working a full-time job (implicit). The true economic cost of the year is $75,000.',
      keyMetric: 'Production Possibility Frontier (PPF) illustrates opportunity cost slopes.'
    },
    proTip: 'Sunk costs (past non-recoverable outlays) should never factor into forward-looking opportunity cost decisions.',
    keyTakeaways: [
      'Scarcity forces trade-offs in every decision.',
      'Economic profit is lower than accounting profit because it deducts opportunity costs.',
      'Comparative advantage relies on whichever party holds the lower opportunity cost in production.'
    ],
    estimatedMinutes: 5,
    xpValue: 40
  },
  {
    id: 'eco-2',
    trackId: 'economics',
    moduleId: 'eco-mod-1',
    moduleTitle: 'Foundations of Market Dynamics',
    order: 2,
    title: 'Price Elasticity of Demand',
    term: 'Price Elasticity of Demand (PED)',
    shortDefinition: 'A quantitative measure of consumer responsiveness in quantity demanded relative to a change in price.',
    detailedExplanation: 'If PED > 1, demand is elastic (e.g., luxury goods, vacations); a price increase decreases total revenue. If PED < 1, demand is inelastic (e.g., insulin, gasoline, essential utilities); a price hike increases total corporate revenue because consumers cannot easily substitute.',
    formula: 'PED = (% Change in Quantity Demanded) / (% Change in Price)',
    realWorldExample: {
      companyOrContext: 'Uber Surge Pricing & Pharmaceutical Drugs',
      description: 'Life-saving prescription drugs possess highly inelastic demand (PED near 0.1), giving pharmaceutical firms significant pricing power, whereas airline leisure tickets are highly elastic (PED > 1.5).',
      keyMetric: 'Midpoint Elasticity Formula = [(Q2 - Q1)/((Q1+Q2)/2)] / [(P2 - P1)/((P1+P2)/2)]'
    },
    proTip: 'When demand is unit elastic (PED = 1.0), total revenue is maximized at that exact price point.',
    keyTakeaways: [
      'Inelastic (|PED| < 1): Price and Total Revenue move in the same direction.',
      'Elastic (|PED| > 1): Price and Total Revenue move in opposite directions.',
      'Goods with many close substitutes generally display higher price elasticity.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },
  {
    id: 'eco-3',
    trackId: 'economics',
    moduleId: 'eco-mod-2',
    moduleTitle: 'Macroeconomic Policy & Money',
    order: 3,
    title: 'Monetary Policy & Central Banking',
    term: 'Monetary Policy & The Federal Funds Rate',
    shortDefinition: 'Actions by central banks (like the US Federal Reserve or ECB) manipulating interest rates and money supply to manage inflation and employment.',
    detailedExplanation: 'Central banks utilize three primary levers: the benchmark policy interest rate (Federal Funds Rate), reserve requirements, and open market operations (including Quantitative Easing/Tightening). When inflation spikes, central banks hike rates to cool borrowing and demand; when recession threatens, they cut rates to stimulate investment.',
    formula: 'Taylor Rule: Target Interest Rate = Neutral Rate + 0.5(Inflation - Target) + 0.5(Output Gap)',
    realWorldExample: {
      companyOrContext: 'The 2022-2023 Fed Rate Hiking Cycle',
      description: 'Faced with 9.1% CPI inflation in mid-2022, the Federal Reserve aggressively raised interest rates from near 0% to over 5.25%, cooling housing and tech capital expenditure while causing bond valuations to drop.',
      keyMetric: 'Fed Funds Effective Rate dictates mortgage, credit card, and corporate loan rates.'
    },
    proTip: 'Monetary policy acts with long and variable lags—typically taking 12 to 18 months to fully filter into economic output.',
    keyTakeaways: [
      'Hawkish policy = raising interest rates to curb inflation.',
      'Dovish policy = lowering interest rates to stimulate growth and employment.',
      'Bond prices move inversely to benchmark interest rates.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },
  {
    id: 'eco-4',
    trackId: 'economics',
    moduleId: 'eco-mod-2',
    moduleTitle: 'Macroeconomic Policy & Money',
    order: 4,
    title: 'Fiscal Policy & Government Debt',
    term: 'Fiscal Policy & The Keynesian Multiplier',
    shortDefinition: 'Government decisions on taxation and public expenditures used to influence aggregate demand.',
    detailedExplanation: 'Expansionary fiscal policy involves increasing public spending or cutting taxes to stimulate economic recovery, resulting in budget deficits financed by Treasury bond issuance. Contractionary fiscal policy lowers spending or raises taxes to stabilize overheated economies. High deficits can cause "crowding out," driving interest rates higher for private borrowers.',
    formula: 'Fiscal Multiplier = 1 / (1 - Marginal Propensity to Consume)',
    realWorldExample: {
      companyOrContext: 'US CARES Act & Infrastructure Act',
      description: 'Direct stimulus checks and public infrastructure spending pumped trillions into the economy to prevent depression during economic lockdowns, boosting GDP but increasing national public debt-to-GDP to over 120%.',
      keyMetric: 'Debt-to-GDP Ratio is the sovereign metric for debt sustainability.'
    },
    proTip: 'Fiscal policy is enacted by elected legislatures (Congress/Parliament), whereas monetary policy is set by independent central bankers.',
    keyTakeaways: [
      'Government spending injects aggregate demand directly into the economy.',
      'Tax cuts increase disposable income, but some portion is saved (leakage).',
      'Deficit spending must be balanced against debt sustainability and inflation.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },
  {
    id: 'eco-5',
    trackId: 'economics',
    moduleId: 'eco-mod-3',
    moduleTitle: 'Price Indexes & Global Trade',
    order: 5,
    title: 'Inflation & Purchasing Power Parity',
    term: 'Consumer Price Index (CPI) & Real vs. Nominal',
    shortDefinition: 'The rate at which the general level of prices for goods and services rises, eroding purchasing power.',
    detailedExplanation: 'Headline CPI measures a broad basket of consumer goods including food and energy. Core CPI strips out volatile food and energy to gauge underlying structural inflation. To find the real return or wage growth, one must subtract the inflation rate from the nominal figure via the Fisher equation.',
    formula: 'Real Interest Rate ≈ Nominal Interest Rate - Inflation Rate (Fisher Effect)',
    realWorldExample: {
      companyOrContext: 'Treasury Inflation-Protected Securities (TIPS)',
      description: 'If a bond yields 5% nominally, but inflation is 3.5%, the investor’s real purchasing power gain is only 1.5%. TIPS adjust their principal value directly to CPI.',
      keyMetric: 'Core PCE is the Federal Reserve’s preferred inflation barometer.'
    },
    proTip: 'Inflation benefits fixed-rate debt borrowers (they repay with devalued dollars) and hurts cash holders.',
    keyTakeaways: [
      'Nominal metrics are unadjusted for inflation; real metrics measure genuine purchasing power.',
      'Hyperinflation destroys currency credibility, leading to barter or foreign currency adoption.',
      'Purchasing Power Parity (PPP) compares currency value across equivalent goods.'
    ],
    estimatedMinutes: 5,
    xpValue: 40
  },
  {
    id: 'eco-6',
    trackId: 'economics',
    moduleId: 'eco-mod-3',
    moduleTitle: 'Price Indexes & Global Trade',
    order: 6,
    title: 'Market Structures: Monopoly to Perfect Competition',
    term: 'Oligopoly, Monopoly & Monopolistic Competition',
    shortDefinition: 'Categorization of industries based on barriers to entry, pricing power, and product differentiation.',
    detailedExplanation: 'In Perfect Competition, firms are price takers with zero economic profit in the long run. In Monopoly, a single seller sets prices where Marginal Revenue equals Marginal Cost (MR = MC). In Oligopoly (airlines, smartphone OS), few large firms dominate, often modeling pricing strategies through Game Theory (Nash Equilibrium).',
    formula: 'Profit Maximization Condition for All Firms: Marginal Revenue (MR) = Marginal Cost (MC)',
    realWorldExample: {
      companyOrContext: 'OPEC+ and Android vs. iOS',
      description: 'OPEC operates as an oligopoly cartel coordinating crude production targets. In tech, Apple and Google hold a duopoly over mobile operating systems with huge barriers to entry.',
      keyMetric: 'Herfindahl-Hirschman Index (HHI) measures industry concentration for antitrust enforcement.'
    },
    proTip: 'Even a monopoly cannot charge an infinite price; its pricing power is still constrained by the market demand curve.',
    keyTakeaways: [
      'Competitive markets achieve allocative and productive efficiency.',
      'Oligopolies face strategic interdependence and price stickiness (kinked demand).',
      'Monopolies produce deadweight loss compared to competitive equilibrium.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },

  // --- FINANCE TRACK ---
  {
    id: 'fin-1',
    trackId: 'finance',
    moduleId: 'fin-mod-1',
    moduleTitle: 'Valuation & Time Value of Money',
    order: 1,
    title: 'Time Value of Money (TVM)',
    term: 'Present Value (PV) & Discount Rate',
    shortDefinition: 'The core financial axiom that a dollar today is worth more than a dollar tomorrow due to its earning potential.',
    detailedExplanation: 'Money available at present has greater purchasing power because it can be invested to earn interest. To value any financial asset (a stock, bond, or startup), finance professionals discount all projected future cash flows back to the present day using an appropriate discount rate reflecting risk and opportunity cost.',
    formula: 'PV = FV / (1 + r)^n  |  FV = PV * (1 + r)^n',
    realWorldExample: {
      companyOrContext: 'Retirement & Mega Millions Lottery',
      description: 'A lottery jackpot advertised as $100 Million paid over 30 years has a cash lump-sum value of only around $48 Million today because future installments are heavily discounted by the prevailing interest rate.',
      keyMetric: 'Compound Interest Formula: A = P(1 + r/n)^(nt)'
    },
    proTip: 'Higher interest/discount rates drastically depress the present value of distant cash flows—this is why high-growth tech stocks drop when rates rise.',
    keyTakeaways: [
      'Compounding exponentially expands capital over long horizons.',
      'Discounting converts future expected cash flows into today’s currency.',
      'The discount rate reflects risk: riskier cash flows require higher discount rates.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },
  {
    id: 'fin-2',
    trackId: 'finance',
    moduleId: 'fin-mod-1',
    moduleTitle: 'Valuation & Time Value of Money',
    order: 2,
    title: 'Discounted Cash Flow (DCF) & Net Present Value',
    term: 'Net Present Value (NPV) & Hurdle Rate',
    shortDefinition: 'The sum of all incoming future cash flows discounted to today minus the initial upfront investment cost.',
    detailedExplanation: 'NPV is the gold standard for capital budgeting. If NPV > 0, an investment generates more return than the required cost of capital (WACC), thus creating shareholder value. Internal Rate of Return (IRR) is the discount rate at which the project NPV equals zero.',
    formula: 'NPV = ∑ [CF_t / (1 + r)^t] - Initial Investment',
    realWorldExample: {
      companyOrContext: 'Boeing Launching a New Aircraft Program',
      description: 'Boeing forecasts spending $15B over 4 years to engineer a new fuel-efficient jet. It builds a DCF model projecting airline deliveries over 20 years. Only if the NPV at a 10% WACC is positive does the board approve the capital project.',
      keyMetric: 'If NPV > 0, accept the project; if NPV < 0, reject it.'
    },
    proTip: 'When NPV and IRR conflict on mutually exclusive projects of differing scales, always choose the project with the highest positive NPV.',
    keyTakeaways: [
      'Positive NPV directly increases total enterprise equity value.',
      'Terminal Value often accounts for 60-80% of total calculated DCF valuation.',
      'WACC (Weighted Average Cost of Capital) serves as the standard corporate hurdle rate.'
    ],
    estimatedMinutes: 7,
    xpValue: 45
  },
  {
    id: 'fin-3',
    trackId: 'finance',
    moduleId: 'fin-mod-2',
    moduleTitle: 'Risk, Return & Asset Pricing',
    order: 3,
    title: 'Capital Asset Pricing Model (CAPM) & Beta',
    term: 'CAPM & Equity Risk Premium',
    shortDefinition: 'A mathematical model calculating expected return on equity based on systemic market risk (Beta).',
    detailedExplanation: 'CAPM asserts that investors should only be compensated for systematic market risk, which cannot be diversified away. Beta measures a stock’s price volatility relative to the overall market (S&P 500). A Beta of 1.0 matches market volatility; a Beta of 1.5 indicates 50% greater volatility than the market.',
    formula: 'E(R) = R_f + β * [E(R_m) - R_f]',
    realWorldExample: {
      companyOrContext: 'Tesla vs. Johnson & Johnson',
      description: 'Johnson & Johnson has a Beta of ~0.6 (defensive healthcare, low volatility). Tesla has a Beta of ~2.2 (high tech/cyclical volatility). Under CAPM, Tesla requires a much higher expected rate of return to compensate for its risk.',
      keyMetric: 'R_f = 10-Year US Treasury yield; [E(R_m) - R_f] is the Market Equity Risk Premium (~5-6%).'
    },
    proTip: 'Beta measures systematic risk only. Firm-specific idiosyncratic risk (e.g. factory fire, CEO resignation) can be eliminated through diversification.',
    keyTakeaways: [
      'Higher systematic risk demands higher required investor return.',
      'Risk-free rate (R_f) forms the baseline return floor for zero credit risk.',
      'The Cost of Equity derived from CAPM is plugged directly into WACC.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },
  {
    id: 'fin-4',
    trackId: 'finance',
    moduleId: 'fin-mod-2',
    moduleTitle: 'Risk, Return & Asset Pricing',
    order: 4,
    title: 'Portfolio Diversification & Modern Portfolio Theory',
    term: 'Modern Portfolio Theory (MPT) & The Efficient Frontier',
    shortDefinition: 'Constructing asset portfolios to maximize expected return for a given level of risk through non-correlated assets.',
    detailedExplanation: 'Developed by Nobel laureate Harry Markowitz, MPT demonstrates that holding assets with correlation coefficient ρ < 1 allows an investor to reduce portfolio variance without sacrificing expected return. Unsystematic (firm-specific) risk is eliminated across a basket of 25-30 uncorrelated securities.',
    formula: 'Portfolio Variance = w1^2*σ1^2 + w2^2*σ2^2 + 2*w1*w2*Cov(1,2)',
    realWorldExample: {
      companyOrContext: 'Yale Endowment (David Swensen Model)',
      description: 'Rather than holding only US domestic stocks and bonds, the Yale endowment diversified into international equities, real estate, private equity, and timberland, achieving decades of market-beating risk-adjusted returns (high Sharpe Ratio).',
      keyMetric: 'Sharpe Ratio = (Portfolio Return - Risk Free Rate) / Portfolio Standard Deviation'
    },
    proTip: 'Diversification is often called "the only free lunch in finance" because it lowers risk without proportionally penalizing expected return.',
    keyTakeaways: [
      'Correlation between assets determines the degree of diversification benefit.',
      'The Efficient Frontier represents portfolios offering the highest return per unit of volatility.',
      'Sharpe ratio measures risk-adjusted performance; higher is always better.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },
  {
    id: 'fin-5',
    trackId: 'finance',
    moduleId: 'fin-mod-3',
    moduleTitle: 'Fixed Income & Debt Markets',
    order: 5,
    title: 'Bonds, Yield to Maturity & Duration',
    term: 'Yield to Maturity (YTM) & Macaulay Duration',
    shortDefinition: 'The total anticipated annual return on a bond held until maturity, and its sensitivity to interest rate shifts.',
    detailedExplanation: 'A bond is a loan from an investor to an issuer. When benchmark interest rates rise, existing bonds with lower fixed coupon payments become less attractive, so their market price falls until their yield matches current market rates. Duration measures how many percent a bond price changes for a 1% change in interest rates.',
    formula: 'Approx. % Price Change = -Modified Duration * Δ Yield',
    realWorldExample: {
      companyOrContext: 'Silicon Valley Bank (SVB) Collapse',
      description: 'SVB held billions in long-duration (10-30 year) low-yielding US Treasury and mortgage bonds. When the Fed rapidly raised interest rates by 4.5%, the market value of those long-duration bonds plunged by ~20%, causing an insolvency crisis.',
      keyMetric: 'Bonds trading above par are at a Premium (YTM < Coupon); below par are at a Discount (YTM > Coupon).'
    },
    proTip: 'Bond prices and interest rates have an inverse relationship—like a seesaw. When yields go up, bond prices go down.',
    keyTakeaways: [
      'YTM equates the present value of coupon payments + principal repayment to the current bond market price.',
      'Longer maturity and lower coupon bonds carry significantly higher interest rate duration risk.',
      'Credit spread is the extra yield paid above sovereign Treasuries for corporate default risk.'
    ],
    estimatedMinutes: 6,
    xpValue: 40
  },
  {
    id: 'fin-6',
    trackId: 'finance',
    moduleId: 'fin-mod-3',
    moduleTitle: 'Fixed Income & Debt Markets',
    order: 6,
    title: 'The Inverted Yield Curve: Economic Barometer',
    term: 'Yield Curve Inversion (10Y - 2Y Spread)',
    shortDefinition: 'An abnormal financial anomaly where short-term government debt yields more than long-term government debt.',
    detailedExplanation: 'Normally, the yield curve slopes upward: investors demand higher yields for locking up money in 10-year or 30-year bonds due to inflation uncertainty. When the 2-Year Treasury yield rises above the 10-Year yield (inverted curve), it reflects bond market expectations that central banks have raised rates so high that a recession will occur, forcing rate cuts in the future.',
    formula: 'Yield Spread = 10-Year Treasury Yield - 2-Year Treasury Yield (Negative = Inversion)',
    realWorldExample: {
      companyOrContext: 'Historical US Recessions (1970-2024)',
      description: 'An inverted 10Y-2Y yield curve has preceded every single US recession over the past 50 years, making it Wall Street’s most closely watched recession indicator.',
      keyMetric: 'A steepening yield curve after an inversion frequently marks the start of the economic slowdown.'
    },
    proTip: 'A normal yield curve indicates healthy bank lending margins (borrowing short-term at low rates, lending long-term at higher rates). An inverted curve squeezes bank profits.',
    keyTakeaways: [
      'Upward-sloping curve = expansionary normal state.',
      'Flat or inverted curve = tight credit and high recession probability.',
      'Central bank short-rate hikes push the front end of the curve higher.'
    ],
    estimatedMinutes: 5,
    xpValue: 40
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-acc-6-001',
    lessonId: 'acc-6',
    trackId: 'accounting',
    prompt: 'During a period of consistently rising prices (inflation), which inventory costing method produces the highest reported Net Income?',
    options: [
      'FIFO (First-In, First-Out)',
      'LIFO (Last-In, First-Out)',
      'Weighted Average Cost',
      'Specific Identification'
    ],
    correctOptionIndex: 0,
    explanation: 'Under FIFO, older and lower costs are matched against current revenues in Cost of Goods Sold (COGS). Lower COGS produces higher Gross Profit and higher reported Net Income.',
    difficulty: 'intermediate',
    xpPoints: 20,
    topicTag: 'Inventory Costing: FIFO vs. LIFO'
  },
  {
    id: 'q-acc-6-002',
    lessonId: 'acc-6',
    trackId: 'accounting',
    prompt: 'Why do US companies often adopt LIFO during inflationary periods despite reporting lower accounting earnings?',
    options: [
      'LIFO reports higher Cost of Goods Sold, lowering taxable income and conserving cash on tax payments',
      'LIFO is mandated by international IFRS accounting standards',
      'LIFO maximizes balance sheet ending inventory asset valuation',
      'LIFO avoids the requirement to track physical inventory movements'
    ],
    correctOptionIndex: 0,
    explanation: 'Under the IRS LIFO Conformity Rule, using LIFO yields higher COGS during inflation, reducing taxable income and actual cash paid for corporate taxes.',
    difficulty: 'intermediate',
    xpPoints: 20,
    topicTag: 'Inventory Costing: FIFO vs. LIFO'
  },
  {
    id: 'q-acc-6-003',
    lessonId: 'acc-6',
    trackId: 'accounting',
    prompt: 'Which major accounting framework strictly prohibits the use of LIFO for inventory valuation?',
    options: [
      'IFRS (International Financial Reporting Standards)',
      'US GAAP (Generally Accepted Accounting Principles)',
      'Both US GAAP and IFRS permit LIFO equally',
      'Neither permits LIFO without SEC special exemptions'
    ],
    correctOptionIndex: 0,
    explanation: 'IAS 2 under IFRS explicitly prohibits LIFO because it leaves ending inventory on the balance sheet measured at outdated historical costs that lack fair-value relevance.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Inventory Costing: FIFO vs. LIFO'
  },
  {
    id: 'q-acc-6-004',
    lessonId: 'acc-6',
    trackId: 'accounting',
    prompt: 'What financial metric represents the cumulative difference between inventory valued under FIFO versus LIFO?',
    options: [
      'LIFO Reserve (FIFO Inventory − LIFO Inventory)',
      'Inventory Turnover Ratio',
      'Days Sales of Inventory (DSI)',
      'Contra-Asset Amortization Allowance'
    ],
    correctOptionIndex: 0,
    explanation: 'LIFO Reserve is a required financial footnote disclosure: LIFO Reserve = FIFO Inventory Value − LIFO Inventory Value. It allows financial analysts to adjust LIFO statements for direct peer comparisons.',
    difficulty: 'advanced',
    xpPoints: 20,
    topicTag: 'Inventory Costing: FIFO vs. LIFO'
  },
  {
    id: 'q-acc-6-005',
    lessonId: 'acc-6',
    trackId: 'accounting',
    prompt: 'A company reports Beginning Inventory of $50,000, Purchases of $200,000, and Ending Inventory of $70,000. What is the Cost of Goods Sold (COGS)?',
    options: [
      '$180,000',
      '$220,000',
      '$250,000',
      '$130,000'
    ],
    correctOptionIndex: 0,
    explanation: 'Using the fundamental inventory formula: COGS = Beginning Inventory ($50,000) + Purchases ($200,000) − Ending Inventory ($70,000) = $180,000.',
    difficulty: 'intermediate',
    xpPoints: 20,
    topicTag: 'Inventory Costing: FIFO vs. LIFO'
  },
  {
    id: 'q-acc-6-006',
    lessonId: 'acc-6',
    trackId: 'accounting',
    prompt: 'During prolonged periods of declining prices (deflation), what is the expected relationship between LIFO and FIFO?',
    options: [
      'LIFO will report lower COGS and higher Net Income than FIFO',
      'FIFO will report lower COGS and higher Net Income than LIFO',
      'Both methods report identical COGS and tax liabilities',
      'LIFO cannot be legally calculated during deflationary quarters'
    ],
    correctOptionIndex: 0,
    explanation: 'In a deflationary environment, newer inventory costs are lower than older costs. Because LIFO charges the newest (cheaper) costs to COGS, COGS is lower and Net Income is higher.',
    difficulty: 'advanced',
    xpPoints: 20,
    topicTag: 'Inventory Costing: FIFO vs. LIFO'
  },
  {
    id: 'q-bank-accounting-001',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'Which account normally has a debit balance?',
    options: [
      'Accounts receivable',
      'Sales revenue',
      'Accounts payable',
      'Capital'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Double-entry bookkeeping'
  },
  {
    id: 'q-bank-accounting-002',
    lessonId: 'acc-4',
    trackId: 'accounting',
    prompt: 'Which statement reports assets, liabilities and equity on a specific date?',
    options: [
      'Income statement',
      'Balance sheet',
      'Cash-flow statement',
      'Trial balance'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Financial statements'
  },
  {
    id: 'q-bank-accounting-003',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'A business buys equipment for cash. What is the immediate effect?',
    options: [
      'Assets increase overall',
      'Assets decrease overall',
      'One asset increases and another decreases',
      'Liabilities increase'
    ],
    correctOptionIndex: 2,
    explanation: 'Answer key: C. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-004',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Which is a contra-asset account?',
    options: [
      'Sales revenue',
      'Accumulated depreciation',
      'Accounts payable',
      'Share capital'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-005',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'Under accrual accounting, revenue is generally recorded when it is:',
    options: [
      'Received in cash only',
      'Earned',
      'Budgeted',
      'Deposited in the bank'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-accounting-006',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'Rent paid in advance is initially recorded as:',
    options: [
      'An expense only',
      'A liability',
      'An asset',
      'Revenue'
    ],
    correctOptionIndex: 2,
    explanation: 'Answer key: C. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-007',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Outstanding salary at year-end is:',
    options: [
      'An accrued expense and liability',
      'Prepaid expense',
      'Unearned revenue',
      'A fixed asset'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-008',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Depreciation allocates the cost of a tangible fixed asset over its:',
    options: [
      'Market-price changes',
      'Useful life',
      'Warranty period only',
      'Purchase-order number'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Asset valuation and inventory'
  },
  {
    id: 'q-bank-accounting-009',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Which error may not be revealed by a trial balance?',
    options: [
      'A transaction omitted completely',
      'A debit posted as a credit with same amount',
      'Unequal debit and credit totals',
      'A one-sided posting'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-010',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'The accounting equation is:',
    options: [
      'Assets = Liabilities + Equity',
      'Assets = Revenue − Expenses',
      'Equity = Assets + Liabilities',
      'Liabilities = Assets + Revenue'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-011',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Goods returned by a customer are recorded as:',
    options: [
      'Purchase returns',
      'Sales returns',
      'Drawings',
      'Capital reserve'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-012',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'A credit purchase of inventory increases:',
    options: [
      'Inventory and accounts payable',
      'Cash and revenue',
      'Drawings and cash',
      'Expense and accounts receivable'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Double-entry bookkeeping'
  },
  {
    id: 'q-bank-accounting-013',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Which inventory method assumes earliest purchases are sold first?',
    options: [
      'LIFO',
      'FIFO',
      'Weighted-average only',
      'Specific identification always'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Asset valuation and inventory'
  },
  {
    id: 'q-bank-accounting-014',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Closing inventory is generally shown as a current asset and affects:',
    options: [
      'Only the cash-flow statement',
      'Cost of goods sold',
      'Share capital',
      'Interest expense only'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Asset valuation and inventory'
  },
  {
    id: 'q-bank-accounting-015',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'Gross profit equals:',
    options: [
      'Revenue minus operating expenses',
      'Net sales minus cost of goods sold',
      'Assets minus liabilities',
      'Cash receipts minus payments'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-accounting-016',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'Which item is normally a current liability?',
    options: [
      'Land',
      'Accounts payable',
      'Goodwill',
      'Long-term investment'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-017',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'A bank reconciliation explains differences between:',
    options: [
      'Sales and purchases',
      'Cash book and bank statement balances',
      'Assets and equity',
      'Budget and forecast'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-018',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'A cheque issued but not yet presented generally makes the bank-statement balance:',
    options: [
      'Lower than the cash-book balance, all else equal',
      'Higher than the cash-book balance, all else equal',
      'Equal in every case',
      'A liability disappear'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-019',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Bad-debt expense relates to:',
    options: [
      'Expected or actual uncollectible receivables',
      'Depreciation of machinery',
      'Inventory purchases',
      'Share issuance'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-accounting-020',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'The allowance method for doubtful debts follows which principle?',
    options: [
      'Matching/expected credit-loss recognition',
      'Cash-only recognition',
      'Historical-cost revaluation',
      'Capital maintenance only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-021',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Which is a capital expenditure?',
    options: [
      'Routine monthly cleaning',
      'Annual office electricity bill',
      'Purchase of a production machine',
      'Small stationery purchase'
    ],
    correctOptionIndex: 2,
    explanation: 'Answer key: C. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-022',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Which is a revenue expenditure?',
    options: [
      'Acquisition of land',
      'Routine repair of equipment',
      'Purchase of a building',
      'Major asset acquisition'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-accounting-023',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'A credit balance in a supplier account usually represents:',
    options: [
      'Amount owed to supplier',
      'Cash in hand',
      'Customer receivable',
      'Inventory on hand'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Double-entry bookkeeping'
  },
  {
    id: 'q-bank-accounting-024',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'A debit note is commonly used to document:',
    options: [
      'Goods returned to a supplier or an amount claimed from supplier',
      'Issue of shares',
      'Depreciation',
      'Cash sales only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Double-entry bookkeeping'
  },
  {
    id: 'q-bank-accounting-025',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'A credit note issued to a customer commonly reduces:',
    options: [
      'Sales returns/amount receivable',
      'Plant and machinery',
      'Share capital',
      'Bank loan principal automatically'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Double-entry bookkeeping'
  },
  {
    id: 'q-bank-accounting-026',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Which account records owner withdrawals in a sole proprietorship?',
    options: [
      'Drawings',
      'Sales',
      'Accounts payable',
      'Accumulated depreciation'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-027',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Net profit is transferred to equity because it:',
    options: [
      'Increases the owner\'s residual interest, before drawings/tax effects as applicable',
      'Always increases cash by the same amount',
      'Is a liability to customers',
      'Reduces all assets'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Financial statements'
  },
  {
    id: 'q-bank-accounting-028',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'The matching principle aims to recognise expenses in the period of related:',
    options: [
      'Share issues',
      'Revenue earned',
      'Loan applications',
      'Asset purchases only'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-accounting-029',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Unearned revenue is initially a:',
    options: [
      'Liability',
      'Expense',
      'Contra-asset',
      'Drawing'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-accounting-030',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Which document normally supports a credit sale?',
    options: [
      'Sales invoice',
      'Bank passbook only',
      'Depreciation schedule only',
      'Share certificate'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Double-entry bookkeeping'
  },
  {
    id: 'q-bank-accounting-031',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'A suspense account may be opened when:',
    options: [
      'Trial-balance difference is temporarily unresolved',
      'All accounts are finalised correctly',
      'Cash is deposited',
      'Inventory is counted'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-032',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Under straight-line depreciation, annual depreciation is generally:',
    options: [
      'Cost × market return',
      '(Cost − residual value) ÷ useful life',
      'Cost ÷ sales revenue',
      'Residual value ÷ liabilities'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Asset valuation and inventory'
  },
  {
    id: 'q-bank-accounting-033',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'A provision differs from a reserve because a provision is generally:',
    options: [
      'Recognised for an expected obligation/loss and charged in determining profit',
      'Always part of share capital',
      'A cash account',
      'A distribution to owners'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-034',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'Which item is not ordinarily an expense?',
    options: [
      'Wages',
      'Insurance consumed',
      'Dividend declared to shareholders',
      'Office rent'
    ],
    correctOptionIndex: 2,
    explanation: 'Answer key: C. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-accounting-035',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'A trial balance is primarily used to check:',
    options: [
      'Arithmetic equality of ledger debits and credits',
      'Whether every transaction is economically correct',
      'Whether fraud is impossible',
      'Market value of all assets'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-036',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'A purchase discount received from a supplier generally:',
    options: [
      'Reduces purchase cost or related expense, depending on accounting policy',
      'Increases sales revenue',
      'Is always share capital',
      'Creates goodwill'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Time value of money'
  },
  {
    id: 'q-bank-accounting-037',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'A cash sale of ₹8,000 is recorded by debiting:',
    options: [
      'Sales',
      'Cash/bank',
      'Accounts payable',
      'Capital'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Double-entry bookkeeping'
  },
  {
    id: 'q-bank-accounting-038',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'If assets are ₹5,00,000 and liabilities ₹1,80,000, equity is:',
    options: [
      '₹6,80,000',
      '₹3,20,000',
      '₹1,80,000',
      '₹5,00,000'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Financial statements'
  },
  {
    id: 'q-bank-accounting-039',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Opening inventory ₹40,000, purchases ₹1,20,000 and closing inventory ₹30,000; COGS is:',
    options: [
      '₹1,90,000',
      '₹1,10,000',
      '₹1,30,000',
      '₹90,000'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Asset valuation and inventory'
  },
  {
    id: 'q-bank-accounting-040',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Sales ₹2,00,000 and COGS ₹1,30,000; gross profit is:',
    options: [
      '₹70,000',
      '₹1,30,000',
      '₹3,30,000',
      '₹30,000'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-accounting-041',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'A prepaid expense adjustment usually:',
    options: [
      'Debits an asset and credits the expense account',
      'Debits liability and credits revenue',
      'Debits cash and credits capital',
      'Debits revenue and credits receivable'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-accounting-042',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'An accrued revenue adjustment usually recognises:',
    options: [
      'Revenue earned but not yet received/billed',
      'Cash received for future service only',
      'A capital contribution',
      'An unpaid supplier bill'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-accounting-043',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Which statement shows operating, investing and financing cash flows?',
    options: [
      'Cash-flow statement',
      'Trial balance',
      'Statement of changes in inventory only',
      'Sales ledger'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Cash flow management'
  },
  {
    id: 'q-bank-accounting-044',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'The going-concern assumption presumes the entity will:',
    options: [
      'Continue operating for the foreseeable future, absent contrary evidence',
      'Close tomorrow',
      'Never incur a loss',
      'Always pay dividends'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-045',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Materiality means information is important if it could:',
    options: [
      'Influence users\' decisions',
      'Be printed in bold',
      'Be recorded only in cash',
      'Never be estimated'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-046',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'A contingent liability is generally:',
    options: [
      'A possible obligation whose outcome depends on uncertain future events',
      'Always a confirmed loan payable',
      'An asset held for sale',
      'A type of revenue'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-047',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Which ratio measures short-term liquidity?',
    options: [
      'Current ratio',
      'Gross margin',
      'Debt-to-equity only',
      'Inventory turnover only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Accounting fundamentals'
  },
  {
    id: 'q-bank-accounting-048',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Current assets ₹2,40,000 and current liabilities ₹1,20,000; current ratio is:',
    options: [
      '0.5:1',
      '1:1',
      '2:1',
      '3:1'
    ],
    correctOptionIndex: 2,
    explanation: 'Answer key: C. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Financial statements'
  },
  {
    id: 'q-bank-accounting-049',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Which is a non-cash expense commonly added back under the indirect cash-flow method?',
    options: [
      'Depreciation',
      'Cash purchase of inventory',
      'Dividend paid',
      'Loan repayment'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-accounting-050',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'A company receives ₹12,000 from a customer for an invoice already recorded earlier. The receipt is recorded by debiting:',
    options: [
      'Cash/bank and crediting accounts receivable',
      'Sales and crediting cash',
      'Accounts payable and crediting revenue',
      'Capital and crediting inventory'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Double-entry bookkeeping'
  },
  {
    id: 'q-bank-finance-001',
    lessonId: 'fin-1',
    trackId: 'finance',
    prompt: 'The time value of money means:',
    options: [
      '₹1 today can be worth more than ₹1 received later',
      'Money has no time value',
      'Future cash flows never need discounting',
      'Inflation always equals zero'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Time value of money'
  },
  {
    id: 'q-bank-finance-002',
    lessonId: 'fin-1',
    trackId: 'finance',
    prompt: 'Present value is the:',
    options: [
      'Future value compounded forward',
      'Current value of a future cash flow discounted at a rate',
      'Accounting profit',
      'Face value of a bond only'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Time value of money'
  },
  {
    id: 'q-bank-finance-003',
    lessonId: 'fin-1',
    trackId: 'finance',
    prompt: 'At 10% annual compounding, ₹1,000 invested for one year becomes:',
    options: [
      '₹1,010',
      '₹1,100',
      '₹900',
      '₹1,210'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Time value of money'
  },
  {
    id: 'q-bank-finance-004',
    lessonId: 'fin-1',
    trackId: 'finance',
    prompt: 'A project has positive NPV when:',
    options: [
      'Present value of inflows exceeds present value of outflows',
      'IRR is always zero',
      'Initial investment exceeds all inflows',
      'Payback is infinite'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Capital budgeting'
  },
  {
    id: 'q-bank-finance-005',
    lessonId: 'fin-1',
    trackId: 'finance',
    prompt: 'IRR is the discount rate at which project NPV equals:',
    options: [
      'One',
      'Initial investment',
      'Zero',
      'The tax rate'
    ],
    correctOptionIndex: 2,
    explanation: 'Answer key: C. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Time value of money'
  },
  {
    id: 'q-bank-finance-006',
    lessonId: 'fin-2',
    trackId: 'finance',
    prompt: 'Which method discounts cash flows explicitly?',
    options: [
      'Simple payback only',
      'NPV',
      'Accounting rate of return only',
      'Book-value method'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Cash flow management'
  },
  {
    id: 'q-bank-finance-007',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'A bond\'s price generally rises when its required market yield:',
    options: [
      'Rises',
      'Falls',
      'Equals zero only',
      'Is unrelated to price'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Fixed income'
  },
  {
    id: 'q-bank-finance-008',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'A bond trading below face value is trading at a:',
    options: [
      'Premium',
      'Discount',
      'Par value',
      'Dividend yield'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Fixed income'
  },
  {
    id: 'q-bank-finance-009',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'Coupon rate is calculated using the bond\'s:',
    options: [
      'Current market price',
      'Face value',
      'Trading volume',
      'Duration'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Fixed income'
  },
  {
    id: 'q-bank-finance-010',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'Current yield on a bond is approximately:',
    options: [
      'Annual coupon ÷ current market price',
      'Price ÷ annual coupon',
      'Face value ÷ maturity',
      'Coupon rate × duration'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Fixed income'
  },
  {
    id: 'q-bank-finance-011',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'Duration is commonly used to estimate a bond\'s sensitivity to:',
    options: [
      'Interest-rate changes',
      'Inventory losses',
      'Tax filing dates',
      'Sales volume'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Fixed income'
  },
  {
    id: 'q-bank-finance-012',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'Diversification primarily reduces:',
    options: [
      'All systematic risk',
      'Company-specific risk',
      'Inflation to zero',
      'Every possible loss'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Portfolio management'
  },
  {
    id: 'q-bank-finance-013',
    lessonId: 'fin-3',
    trackId: 'finance',
    prompt: 'Beta measures a security\'s sensitivity to:',
    options: [
      'Market movements',
      'Company revenue only',
      'Interest coverage',
      'Dividend payment dates'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Risk and return'
  },
  {
    id: 'q-bank-finance-014',
    lessonId: 'fin-3',
    trackId: 'finance',
    prompt: 'A beta of 1.3 indicates the asset has historically tended to be:',
    options: [
      'Less sensitive than the market',
      'More sensitive than the market',
      'Risk-free',
      'Guaranteed to earn 30%'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Risk and return'
  },
  {
    id: 'q-bank-finance-015',
    lessonId: 'fin-3',
    trackId: 'finance',
    prompt: 'CAPM expected return equals:',
    options: [
      'Risk-free rate + beta × market risk premium',
      'Dividend ÷ price only',
      'Coupon rate + inflation only',
      'EPS × P/E'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Risk and return'
  },
  {
    id: 'q-bank-finance-016',
    lessonId: 'fin-3',
    trackId: 'finance',
    prompt: 'If risk-free rate is 6%, beta is 1.2 and market risk premium is 5%, CAPM return is:',
    options: [
      '6%',
      '11%',
      '12%',
      '15%'
    ],
    correctOptionIndex: 2,
    explanation: 'Answer key: C. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Risk and return'
  },
  {
    id: 'q-bank-finance-017',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'A call option gives its buyer the right, not obligation, to:',
    options: [
      'Sell the underlying asset',
      'Buy the underlying asset',
      'Receive a fixed coupon',
      'Vote at a shareholder meeting'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-018',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'A put option gives its buyer the right, not obligation, to:',
    options: [
      'Buy the underlying asset',
      'Sell the underlying asset',
      'Issue a bond',
      'Borrow at zero interest'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-019',
    lessonId: 'fin-3',
    trackId: 'finance',
    prompt: 'A futures contract is generally:',
    options: [
      'A standardised exchange-traded agreement to transact later',
      'An insurance policy only',
      'A company share',
      'A savings account'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-020',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A hedger uses derivatives mainly to:',
    options: [
      'Reduce exposure to an underlying risk',
      'Guarantee profit',
      'Avoid all market risk',
      'Increase accounting revenue'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-021',
    lessonId: 'fin-3',
    trackId: 'finance',
    prompt: 'A call option is in the money at expiry when market price is:',
    options: [
      'Below strike price',
      'Above strike price',
      'Exactly zero',
      'Always equal to premium'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-022',
    lessonId: 'fin-3',
    trackId: 'finance',
    prompt: 'An option buyer\'s maximum loss is generally limited to the:',
    options: [
      'Underlying price',
      'Premium paid',
      'Strike price plus all market moves',
      'Unlimited amount'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-023',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'A mutual fund pools money from:',
    options: [
      'Multiple investors',
      'One lender only',
      'Only the government',
      'Only company employees'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-024',
    lessonId: 'fin-3',
    trackId: 'finance',
    prompt: 'An ETF typically trades:',
    options: [
      'On an exchange during market hours',
      'Only once every ten years',
      'Only directly with a bank branch',
      'Without any price'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-025',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'NAV per mutual fund unit is broadly:',
    options: [
      'Net assets ÷ units outstanding',
      'Revenue ÷ employees',
      'Debt ÷ equity',
      'Dividend ÷ face value'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-026',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A higher expense ratio, all else equal, tends to:',
    options: [
      'Reduce investor net returns',
      'Increase net returns automatically',
      'Eliminate market risk',
      'Guarantee outperformance'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-finance-027',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'Equity shareholders are residual claimants, meaning they are paid:',
    options: [
      'Before all creditors in liquidation',
      'After higher-priority claims',
      'A guaranteed coupon',
      'The same return every year'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Financial statements'
  },
  {
    id: 'q-bank-finance-028',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'A dividend yield is annual dividend per share divided by:',
    options: [
      'Market price per share',
      'Book value of debt',
      'Total assets',
      'Face value of all bonds'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-029',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'P/E ratio is calculated as:',
    options: [
      'Price per share ÷ earnings per share',
      'EPS ÷ price per share',
      'Debt ÷ EBITDA',
      'Dividend ÷ sales'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-030',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'A company with price ₹240 and EPS ₹12 has a P/E of:',
    options: [
      '12x',
      '20x',
      '24x',
      '2x'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-031',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'Market capitalisation equals:',
    options: [
      'Share price × shares outstanding',
      'Revenue − expenses',
      'Debt − cash only',
      'EPS × dividend yield'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-032',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Working capital is:',
    options: [
      'Current assets − current liabilities',
      'Fixed assets − equity',
      'Revenue − tax',
      'Debt + dividends'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-033',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Cost of capital is the:',
    options: [
      'Required return expected by providers of capital',
      'Historical purchase cost of inventory',
      'Face value of equity only',
      'Tax rate alone'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-034',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'WACC weights the costs of:',
    options: [
      'Debt and equity financing, and other capital sources where relevant',
      'Sales and inventory',
      'Assets and revenue only',
      'Dividends and taxes only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-035',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Debt financing can increase financial risk because it creates:',
    options: [
      'Contractual interest and repayment obligations',
      'Guaranteed sales growth',
      'No cash outflows',
      'Automatic equity appreciation'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-036',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'A firm\'s debt-to-equity ratio compares:',
    options: [
      'Total debt with shareholders\' equity',
      'Sales with inventory',
      'Cash with revenue',
      'Profit with tax'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Financial statements'
  },
  {
    id: 'q-bank-finance-037',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'A bear market is generally associated with:',
    options: [
      'Falling prices and pessimism',
      'Rising prices only',
      'No price changes',
      'Guaranteed dividend growth'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-038',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Liquidity in a financial market refers to the ability to:',
    options: [
      'Trade quickly with limited price impact',
      'Guarantee positive returns',
      'Avoid every tax',
      'Predict every price'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-039',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Inflation erodes purchasing power because:',
    options: [
      'General prices rise over time',
      'All wages rise faster than prices',
      'Interest rates are always zero',
      'Currency becomes a physical asset'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Macroeconomics'
  },
  {
    id: 'q-bank-finance-040',
    lessonId: 'fin-3',
    trackId: 'finance',
    prompt: 'Real return is approximately nominal return minus:',
    options: [
      'Inflation rate',
      'Dividend payout',
      'Beta',
      'Face value'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-041',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'A portfolio\'s expected return is calculated as a weighted average of:',
    options: [
      'Expected returns of its holdings',
      'Only the highest-return asset',
      'Only its cash balance',
      'All historical prices added together'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Portfolio management'
  },
  {
    id: 'q-bank-finance-042',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'Correlation close to −1 suggests two assets tend to move:',
    options: [
      'In opposite directions',
      'Identically in all periods',
      'Without any relationship',
      'Only upward'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Financial statements'
  },
  {
    id: 'q-bank-finance-043',
    lessonId: 'fin-4',
    trackId: 'finance',
    prompt: 'Systematic risk is risk that:',
    options: [
      'Affects the broader market and cannot be eliminated by diversification alone',
      'Is unique to one firm only',
      'Is always avoidable',
      'Only concerns accounting errors'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Portfolio management'
  },
  {
    id: 'q-bank-finance-044',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'A sinking fund provision helps an issuer:',
    options: [
      'Set aside funds to repay debt over time',
      'Avoid all interest expense',
      'Increase bond coupon automatically',
      'Convert all debt to equity immediately'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-045',
    lessonId: 'fin-2',
    trackId: 'finance',
    prompt: 'The payback period measures:',
    options: [
      'Time needed to recover the initial investment',
      'Total project NPV',
      'The exact shareholder return',
      'The cost of equity'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-046',
    lessonId: 'fin-1',
    trackId: 'finance',
    prompt: 'A higher discount rate, for a conventional future cash-flow stream, generally makes present value:',
    options: [
      'Lower',
      'Higher',
      'Unchanged in all cases',
      'Equal to future value'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Cash flow management'
  },
  {
    id: 'q-bank-finance-047',
    lessonId: 'fin-2',
    trackId: 'finance',
    prompt: 'XNPV is useful compared with NPV when cash flows:',
    options: [
      'Occur on specific dates that are not equally spaced',
      'Are all identical',
      'Contain no dates',
      'Must be non-financial'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Cash flow management'
  },
  {
    id: 'q-bank-finance-048',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A rights issue gives existing shareholders an opportunity to:',
    options: [
      'Buy additional shares, typically in proportion to holdings',
      'Receive guaranteed interest',
      'Sell company assets directly',
      'Avoid all dilution without investing'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-049',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A stock split generally changes the number of shares and price per share but not, by itself, the firm\'s:',
    options: [
      'Total market value',
      'Share count',
      'Per-share price',
      'Face-value denomination'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-finance-050',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A dividend payout ratio measures dividends as a proportion of:',
    options: [
      'Net income/earnings',
      'Total liabilities',
      'Market capitalisation only',
      'Operating cash outflow'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Finance fundamentals'
  },
  {
    id: 'q-bank-economics-001',
    lessonId: 'eco-1',
    trackId: 'economics',
    prompt: 'Opportunity cost is the:',
    options: [
      'Value of the next-best alternative forgone',
      'Total money spent only',
      'Accounting profit',
      'Market price alone'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Economic foundations'
  },
  {
    id: 'q-bank-economics-002',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'The law of demand generally states that, other things equal, quantity demanded falls when price:',
    options: [
      'Rises',
      'Falls',
      'Is unchanged',
      'Is subsidised in every case'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-003',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'A movement along a demand curve is caused by a change in:',
    options: [
      'The good\'s own price',
      'Consumer income only',
      'Taste only',
      'Price of a related good only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-004',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'A normal good\'s demand generally rises when consumer income:',
    options: [
      'Rises',
      'Falls',
      'Becomes negative in all cases',
      'Has no change ever'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-005',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'An inferior good\'s demand may fall when income:',
    options: [
      'Rises',
      'Falls',
      'Is taxed at source only',
      'Is constant'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-006',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'Price elasticity of demand measures responsiveness of quantity demanded to a change in:',
    options: [
      'Price',
      'Advertising only',
      'Population only',
      'Production technology'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-007',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'Demand is elastic when the absolute price elasticity is:',
    options: [
      'Greater than 1',
      'Less than 1',
      'Exactly zero',
      'Always negative one'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-008',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'If demand is inelastic, a price increase tends to make total revenue:',
    options: [
      'Rise',
      'Fall to zero',
      'Remain exactly unchanged in all cases',
      'Become negative'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-economics-009',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'Supply generally increases when the market price rises, other things equal, because firms have an incentive to:',
    options: [
      'Offer more for sale',
      'Stop production always',
      'Reduce capacity to zero',
      'Lower every cost'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-010',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'Market equilibrium occurs where:',
    options: [
      'Quantity demanded equals quantity supplied',
      'Demand is zero',
      'Supply is zero',
      'Price equals production cost in every market'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-011',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'A price ceiling set below equilibrium price is likely to cause:',
    options: [
      'A shortage',
      'A surplus',
      'No effect in any case',
      'Unlimited supply'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-012',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'A binding minimum price above equilibrium is likely to cause:',
    options: [
      'A surplus',
      'A shortage',
      'Demand to become infinite',
      'Supply to become zero'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-013',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'GDP measures the market value of:',
    options: [
      'Final goods and services produced within a country during a period',
      'All intermediate goods counted repeatedly',
      'Only exports',
      'Only government salaries'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-014',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'Nominal GDP is measured using:',
    options: [
      'Current-period prices',
      'Constant base-year prices only',
      'Foreign prices only',
      'Share-market prices'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-015',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'Real GDP adjusts nominal GDP for changes in:',
    options: [
      'The price level',
      'Population alone',
      'Tax rates alone',
      'Imports alone'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-016',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'GDP per capita is GDP divided by:',
    options: [
      'Population',
      'Exports',
      'Government debt',
      'Number of firms'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-017',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'Inflation is a sustained increase in the:',
    options: [
      'General price level',
      'Price of one isolated product only',
      'Unemployment rate',
      'Exchange rate in every case'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Macroeconomics'
  },
  {
    id: 'q-bank-economics-018',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'The Consumer Price Index commonly tracks changes in prices paid for a basket of:',
    options: [
      'Consumer goods and services',
      'Only exported machinery',
      'Shares and bonds only',
      'Corporate taxes'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-019',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'Deflation means:',
    options: [
      'A sustained fall in the general price level',
      'A slower rate of inflation only',
      'A rise in all prices',
      'An increase in GDP by definition'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-020',
    lessonId: 'eco-3',
    trackId: 'economics',
    prompt: 'The unemployment rate is the unemployed as a percentage of the:',
    options: [
      'Labour force',
      'Total population including children',
      'Working-age population only in every official method',
      'Number of employers'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-021',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'Fiscal policy involves government decisions about:',
    options: [
      'Taxation and public spending',
      'Money supply only',
      'Private company dividends',
      'Exchange trading hours'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Macroeconomics'
  },
  {
    id: 'q-bank-economics-022',
    lessonId: 'eco-3',
    trackId: 'economics',
    prompt: 'Monetary policy is typically conducted by the:',
    options: [
      'Central bank',
      'Stock exchange',
      'Individual households',
      'External auditors'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Macroeconomics'
  },
  {
    id: 'q-bank-economics-023',
    lessonId: 'eco-3',
    trackId: 'economics',
    prompt: 'An expansionary monetary policy may involve:',
    options: [
      'Reducing policy rates or easing liquidity',
      'Raising all taxes',
      'Cutting all public expenditure',
      'Banning bank lending'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Macroeconomics'
  },
  {
    id: 'q-bank-economics-024',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'A budget deficit occurs when government expenditure exceeds:',
    options: [
      'Government revenue, under the stated accounting definition',
      'Imports',
      'Exports',
      'GDP per capita'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-economics-025',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'A progressive tax takes a higher average rate as:',
    options: [
      'Taxable income rises',
      'Taxable income falls',
      'Inflation becomes zero',
      'Imports increase'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Macroeconomics'
  },
  {
    id: 'q-bank-economics-026',
    lessonId: 'eco-1',
    trackId: 'economics',
    prompt: 'A subsidy can lower producers\' costs and may increase:',
    options: [
      'Supply',
      'Opportunity cost to zero',
      'Demand for every good',
      'The exchange rate automatically'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-027',
    lessonId: 'eco-1',
    trackId: 'economics',
    prompt: 'Comparative advantage is based on lower:',
    options: [
      'Opportunity cost',
      'Absolute wages only',
      'Market share',
      'Inflation'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economic foundations'
  },
  {
    id: 'q-bank-economics-028',
    lessonId: 'eco-1',
    trackId: 'economics',
    prompt: 'Absolute advantage means producing a good using:',
    options: [
      'Fewer resources per unit than another producer',
      'A higher opportunity cost',
      'More resources per unit',
      'No labour or capital ever'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-029',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'A tariff is a tax on:',
    options: [
      'Imports',
      'Domestic wages',
      'All savings accounts',
      'Exports in every case'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Macroeconomics'
  },
  {
    id: 'q-bank-economics-030',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'A depreciation of the domestic currency generally makes imports:',
    options: [
      'More expensive in domestic currency, all else equal',
      'Cheaper in domestic currency, all else equal',
      'Free',
      'Unaffected in every case'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Asset valuation and inventory'
  },
  {
    id: 'q-bank-economics-031',
    lessonId: 'eco-3',
    trackId: 'economics',
    prompt: 'The balance of payments records economic transactions between:',
    options: [
      'Residents of a country and the rest of the world',
      'Only domestic firms',
      'Only banks within one city',
      'Government departments only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-032',
    lessonId: 'eco-3',
    trackId: 'economics',
    prompt: 'The current account includes trade in goods and services plus:',
    options: [
      'Primary and secondary income flows',
      'Only stock-market trades',
      'Only domestic tax receipts',
      'Only banknotes issued'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-033',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'A public good is typically non-rival and:',
    options: [
      'Non-excludable',
      'Always privately owned',
      'Always scarce by definition',
      'Only consumed by one person'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-034',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'A negative externality occurs when an activity imposes:',
    options: [
      'External costs on third parties',
      'Only benefits on third parties',
      'No social cost',
      'A guaranteed profit'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-035',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'A monopoly is a market with:',
    options: [
      'One dominant supplier without close substitutes, in the standard model',
      'Many identical sellers',
      'Only two buyers',
      'Perfectly free entry by definition'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-036',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'In perfect competition, firms are generally described as:',
    options: [
      'Price takers',
      'Price makers with complete control',
      'Protected by permanent entry barriers',
      'The only supplier'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-037',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'Marginal cost is the change in total cost from producing:',
    options: [
      'One additional unit',
      'All units sold last year',
      'Zero output only',
      'One additional employee in every case'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-038',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'Economies of scale occur when long-run average cost falls as:',
    options: [
      'Output increases',
      'Output falls to zero',
      'Prices rise',
      'Taxes increase'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-039',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'The business cycle includes expansions and:',
    options: [
      'Contractions',
      'Only inflation',
      'Only trade surpluses',
      'Only budget deficits'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-040',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'Stagflation combines high inflation with weak output and:',
    options: [
      'High unemployment or stagnation',
      'Zero prices',
      'Guaranteed growth',
      'A permanent trade surplus'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Macroeconomics'
  },
  {
    id: 'q-bank-economics-041',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'The multiplier effect describes how an initial spending change can lead to a larger change in:',
    options: [
      'Aggregate income/output',
      'The number of currencies',
      'The legal tax rate only',
      'The price of one stock only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-042',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'Aggregate demand consists of consumption, investment, government spending and:',
    options: [
      'Net exports',
      'Depreciation only',
      'Tax revenue only',
      'Imports without exports'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-economics-043',
    lessonId: 'eco-3',
    trackId: 'economics',
    prompt: 'A recession is commonly associated with a significant decline in:',
    options: [
      'Economic activity',
      'Every price in every market',
      'The population by definition',
      'All interest rates to zero'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-044',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'Human capital refers to workers\':',
    options: [
      'Skills, education and experience',
      'Physical machines only',
      'Financial securities only',
      'Natural resources only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-045',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'The Gini coefficient is used to measure:',
    options: [
      'Income or wealth inequality',
      'Inflation only',
      'GDP growth only',
      'Exchange-rate volatility only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-046',
    lessonId: 'eco-3',
    trackId: 'economics',
    prompt: 'A central bank may raise policy rates to help reduce:',
    options: [
      'Inflationary pressure',
      'The money value of every export by law',
      'All productivity',
      'All savings'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Macroeconomics'
  },
  {
    id: 'q-bank-economics-047',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'If nominal GDP is ₹220 lakh crore and the GDP deflator is 110 (base 100), real GDP is approximately:',
    options: [
      '₹200 lakh crore',
      '₹242 lakh crore',
      '₹110 lakh crore',
      '₹330 lakh crore'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-048',
    lessonId: 'eco-6',
    trackId: 'economics',
    prompt: 'If price rises from ₹50 to ₹60, the percentage price increase is:',
    options: [
      '10%',
      '20%',
      '25%',
      '50%'
    ],
    correctOptionIndex: 1,
    explanation: 'Answer key: B. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-049',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'A shortage occurs when, at the current price:',
    options: [
      'Quantity demanded exceeds quantity supplied',
      'Quantity supplied exceeds quantity demanded',
      'Demand equals supply',
      'No buyer exists'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Economics fundamentals'
  },
  {
    id: 'q-bank-economics-050',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'If demand increases while supply remains unchanged, equilibrium price generally:',
    options: [
      'Rises',
      'Falls',
      'Must become zero',
      'Cannot change'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-business-001',
    lessonId: 'eco-1',
    trackId: 'economics',
    prompt: 'A business model explains how an organisation:',
    options: [
      'Creates, delivers and captures value',
      'Records only depreciation',
      'Sets only employee leave',
      'Avoids all competition'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-002',
    lessonId: 'eco-1',
    trackId: 'economics',
    prompt: 'An entrepreneur is someone who typically:',
    options: [
      'Organises resources and bears business risk to pursue an opportunity',
      'Only consumes goods',
      'Only audits government accounts',
      'Cannot innovate'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-003',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Working capital management focuses on:',
    options: [
      'Current assets and current liabilities',
      'Only long-term land purchases',
      'Only share-price forecasts',
      'Brand colours'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Business and commerce'
  },
  {
    id: 'q-bank-business-004',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'The main purpose of a business budget is to:',
    options: [
      'Plan and control expected financial activity',
      'Guarantee profit',
      'Replace all financial statements',
      'Eliminate uncertainty'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-business-005',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'A cash budget forecasts:',
    options: [
      'Expected cash receipts and payments',
      'Only accounting depreciation',
      'Only sales returns',
      'Shareholder voting'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Cash flow management'
  },
  {
    id: 'q-bank-business-006',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'A variance is the difference between:',
    options: [
      'Actual and budgeted/standard performance',
      'Assets and liabilities only',
      'Sales and inventory always',
      'Two identical invoices'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-business-007',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'A favourable cost variance generally means actual cost is:',
    options: [
      'Lower than the relevant budget/standard, subject to context',
      'Higher than budget in every case',
      'Equal to revenue',
      'Always zero'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-business-008',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'Break-even point is where:',
    options: [
      'Total revenue equals total cost',
      'Profit is maximised in every market',
      'Variable cost is zero',
      'Sales equal fixed cost only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-business-009',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Contribution per unit equals selling price minus:',
    options: [
      'Variable cost per unit',
      'Fixed cost per unit only',
      'Total assets',
      'Interest income'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-business-010',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Fixed costs, within the relevant range, generally remain constant in total as:',
    options: [
      'Activity volume changes',
      'Every input price changes',
      'Time becomes infinite',
      'Sales price changes by definition'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Business and commerce'
  },
  {
    id: 'q-bank-business-011',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'If fixed costs are ₹60,000 and contribution per unit is ₹20, break-even volume is:',
    options: [
      '1,000 units',
      '2,000 units',
      '3,000 units',
      '4,000 units'
    ],
    correctOptionIndex: 2,
    explanation: 'Answer key: C. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-business-012',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'A supply chain covers activities involved in:',
    options: [
      'Sourcing, producing and delivering goods/services',
      'Only preparing a balance sheet',
      'Only advertising',
      'Only hiring directors'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-business-013',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Inventory turnover indicates how efficiently inventory is sold or used relative to:',
    options: [
      'Cost of goods sold or sales, depending on the formula used',
      'Share capital',
      'Income tax rate',
      'Number of directors'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Asset valuation and inventory'
  },
  {
    id: 'q-bank-business-014',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'CRM stands for:',
    options: [
      'Customer Relationship Management',
      'Cost Revenue Method',
      'Credit Risk Margin',
      'Corporate Reporting Model'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-015',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'The primary purpose of CRM is to manage:',
    options: [
      'Customer interactions and relationships',
      'Only warehouse depreciation',
      'Only statutory audits',
      'Only bond coupons'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'beginner',
    xpPoints: 20,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-016',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'ERP systems integrate information across:',
    options: [
      'Multiple business functions',
      'Only one personal spreadsheet',
      'Only social media accounts',
      'Only stock exchanges'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-017',
    lessonId: 'eco-4',
    trackId: 'economics',
    prompt: 'A SWOT analysis examines strengths, weaknesses, opportunities and:',
    options: [
      'Threats',
      'Transactions',
      'Taxes',
      'Turnover'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-018',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'A KPI is a:',
    options: [
      'Key Performance Indicator',
      'Known Price Index',
      'Key Payment Invoice',
      'Knowledge Protection Investment'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-019',
    lessonId: 'eco-6',
    trackId: 'economics',
    prompt: 'Market segmentation divides a market into groups with:',
    options: [
      'Similar needs or characteristics',
      'Identical accounting entries only',
      'The same bank account',
      'No purchasing behaviour'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-business-020',
    lessonId: 'eco-6',
    trackId: 'economics',
    prompt: 'A value proposition states why a customer should:',
    options: [
      'Choose the offering over alternatives',
      'Pay tax twice',
      'Ignore product benefits',
      'Avoid all suppliers'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Markets and competition'
  },
  {
    id: 'q-bank-business-021',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'A balance sheet is an example of:',
    options: [
      'A financial statement',
      'A marketing channel',
      'A warehouse receipt in every case',
      'A sales promotion'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Financial statements'
  },
  {
    id: 'q-bank-business-022',
    lessonId: 'acc-3',
    trackId: 'accounting',
    prompt: 'Internal control is designed to provide reasonable assurance regarding operations, reporting and:',
    options: [
      'Compliance',
      'Guaranteed profits',
      'Elimination of all human error',
      'Share-price increases'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Business and commerce'
  },
  {
    id: 'q-bank-business-023',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'Segregation of duties reduces risk by separating:',
    options: [
      'Authorisation, custody and record-keeping responsibilities',
      'All staff from all information',
      'Sales from customers permanently',
      'Every expense from accounting'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Business and commerce'
  },
  {
    id: 'q-bank-business-024',
    lessonId: 'acc-3',
    trackId: 'accounting',
    prompt: 'An audit trail helps users:',
    options: [
      'Trace transactions through records and supporting evidence',
      'Predict stock prices with certainty',
      'Avoid maintaining records',
      'Replace authorisation controls'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Business and commerce'
  },
  {
    id: 'q-bank-business-025',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'KYC procedures are primarily used to:',
    options: [
      'Verify customer identity and understand customer risk',
      'Calculate depreciation',
      'Forecast inventory demand only',
      'Set product colours'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Financial technology and security'
  },
  {
    id: 'q-bank-business-026',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'AML controls aim to prevent and detect:',
    options: [
      'Money laundering and related financial crime',
      'All business losses',
      'All interest-rate movements',
      'Routine depreciation'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Financial technology and security'
  },
  {
    id: 'q-bank-business-027',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A digital payment gateway helps a merchant:',
    options: [
      'Process electronic payment transactions',
      'Prepare physical inventory only',
      'Issue a statutory audit opinion',
      'Set central-bank rates'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Financial technology and security'
  },
  {
    id: 'q-bank-business-028',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Phishing is a cyberattack that attempts to:',
    options: [
      'Trick users into revealing sensitive information or taking unsafe actions',
      'Improve password strength',
      'Encrypt data solely for backup',
      'Reconcile a bank account'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Financial technology and security'
  },
  {
    id: 'q-bank-business-029',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Two-factor authentication requires:',
    options: [
      'Two different types of verification factors',
      'Two passwords of the same type in all cases',
      'Two bank accounts',
      'Two email addresses only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Financial technology and security'
  },
  {
    id: 'q-bank-business-030',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Data minimisation means collecting:',
    options: [
      'Only personal data necessary for a stated purpose',
      'Every available data point',
      'No data under any circumstances',
      'Data without access controls'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Financial technology and security'
  },
  {
    id: 'q-bank-business-031',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'A business\'s gross margin is gross profit divided by:',
    options: [
      'Revenue',
      'Total assets',
      'Current liabilities',
      'Share capital'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-business-032',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'A company has revenue ₹5,00,000 and gross profit ₹1,50,000. Gross margin is:',
    options: [
      '15%',
      '25%',
      '30%',
      '35%'
    ],
    correctOptionIndex: 2,
    explanation: 'Answer key: C. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-business-033',
    lessonId: 'acc-5',
    trackId: 'accounting',
    prompt: 'Net profit margin equals net profit divided by:',
    options: [
      'Revenue',
      'Inventory',
      'Current liabilities',
      'Total debt'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Management accounting'
  },
  {
    id: 'q-bank-business-034',
    lessonId: 'acc-1',
    trackId: 'accounting',
    prompt: 'Accounts receivable days estimate the average time taken to:',
    options: [
      'Collect customer payments',
      'Pay employee salaries',
      'Sell fixed assets',
      'Repay share capital'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Accrual accounting'
  },
  {
    id: 'q-bank-business-035',
    lessonId: 'eco-3',
    trackId: 'economics',
    prompt: 'A purchase order is normally issued by the:',
    options: [
      'Buyer to request goods or services from a supplier',
      'Supplier as proof of payment received',
      'Auditor to declare dividends',
      'Bank to report net profit'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'intermediate',
    xpPoints: 30,
    topicTag: 'Business operations'
  },
  {
    id: 'q-bank-business-036',
    lessonId: 'eco-3',
    trackId: 'economics',
    prompt: 'A goods received note records:',
    options: [
      'Receipt of goods against an order or delivery',
      'A shareholder\'s dividend election',
      'A bank\'s policy rate',
      'Depreciation on a building'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Business operations'
  },
  {
    id: 'q-bank-business-037',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'A credit period is the time allowed to a customer to:',
    options: [
      'Pay an invoice after purchase',
      'Return shares to the issuer in every case',
      'Complete an audit',
      'Prepare a budget'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Double-entry bookkeeping'
  },
  {
    id: 'q-bank-business-038',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'Corporate governance concerns the system by which companies are:',
    options: [
      'Directed, controlled and held accountable',
      'Priced at the stock exchange only',
      'Exempted from all regulation',
      'Guaranteed a profit'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-039',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A conflict of interest arises when personal interests may:',
    options: [
      'Unduly influence professional judgement or duties',
      'Always improve objectivity',
      'Replace all company policies',
      'Eliminate risk'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-040',
    lessonId: 'fin-5',
    trackId: 'finance',
    prompt: 'An ethical decision should consider legality, fairness, stakeholders and:',
    options: [
      'Professional integrity',
      'Only short-term profit',
      'Only management preference',
      'Social-media popularity alone'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-041',
    lessonId: 'eco-5',
    trackId: 'economics',
    prompt: 'A stakeholder is a person or group that:',
    options: [
      'Can affect or is affected by an organisation',
      'Must own ordinary shares',
      'Must be a supplier',
      'Cannot be affected by business activity'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Business management'
  },
  {
    id: 'q-bank-business-042',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A business continuity plan prepares an organisation to:',
    options: [
      'Maintain or restore critical operations after disruption',
      'Increase tax automatically',
      'Eliminate every cyber risk',
      'Stop all operations permanently'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Business operations'
  },
  {
    id: 'q-bank-business-043',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A project milestone is:',
    options: [
      'A significant checkpoint or event in a project timeline',
      'A recurring monthly expense only',
      'A type of current liability',
      'A customer complaint'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Business operations'
  },
  {
    id: 'q-bank-business-044',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A project risk register records risks, their assessment and:',
    options: [
      'Responses/mitigation actions and ownership',
      'Only completed invoices',
      'Only employee birthdays',
      'Only final profits'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Business operations'
  },
  {
    id: 'q-bank-business-045',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A prototype is an early version used to:',
    options: [
      'Test ideas, functionality and user experience',
      'Replace all future testing',
      'Guarantee market success',
      'Complete statutory accounts automatically'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Digital systems and learning technology'
  },
  {
    id: 'q-bank-business-046',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'User acceptance testing checks whether a system:',
    options: [
      'Meets users\' requirements and is fit for intended use',
      'Has the highest stock-market valuation',
      'Eliminates every possible defect',
      'Needs no user feedback'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Digital systems and learning technology'
  },
  {
    id: 'q-bank-business-047',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A responsive website is designed to:',
    options: [
      'Adapt its layout to different screen sizes',
      'Work only on one desktop resolution',
      'Require a separate site for every device always',
      'Prevent all security attacks'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Digital systems and learning technology'
  },
  {
    id: 'q-bank-business-048',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'A database primary key is used to:',
    options: [
      'Uniquely identify each record in a table',
      'Store only images',
      'Encrypt every field automatically',
      'Sort records by profit only'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Digital systems and learning technology'
  },
  {
    id: 'q-bank-business-049',
    lessonId: 'eco-6',
    trackId: 'economics',
    prompt: 'In a learning platform, spaced repetition means:',
    options: [
      'Reviewing material at intervals to improve retention',
      'Repeating every question every second',
      'Showing only questions already mastered',
      'Removing incorrect answers permanently'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Digital systems and learning technology'
  },
  {
    id: 'q-bank-business-050',
    lessonId: 'eco-6',
    trackId: 'economics',
    prompt: 'A leaderboard in a gamified learning app typically ranks users by:',
    options: [
      'A defined performance metric such as XP or points',
      'Their date of birth only',
      'Their device model',
      'Their email provider'
    ],
    correctOptionIndex: 0,
    explanation: 'Answer key: A. The source question bank does not include a separate explanation for each question; review the linked lesson for the underlying concept.',
    difficulty: 'advanced',
    xpPoints: 40,
    topicTag: 'Digital systems and learning technology'
  }
];


export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: 'First Ledger Entry',
    description: 'Complete your first lesson in any track',
    icon: 'BookOpen',
    isUnlocked: true,
    category: 'mastery' as const
  },
  {
    id: 'ach-2',
    title: 'Daily Trader Streak',
    description: 'Maintain a 3-day study streak',
    icon: 'Flame',
    isUnlocked: true,
    category: 'streak' as const
  },
  {
    id: 'ach-3',
    title: 'Wall Street Analyst',
    description: 'Accumulate over 500 XP',
    icon: 'Award',
    isUnlocked: false,
    category: 'xp' as const
  },
  {
    id: 'ach-4',
    title: 'Precision Investor',
    description: 'Score 100% on any practice quiz session',
    icon: 'Target',
    isUnlocked: true,
    category: 'accuracy' as const
  },
  {
    id: 'ach-5',
    title: 'Memory Vault Master',
    description: 'Master 3 concepts through Spaced Repetition',
    icon: 'Brain',
    isUnlocked: false,
    category: 'mastery' as const
  },
  {
    id: 'ach-6',
    title: 'Chief Financial Officer',
    description: 'Reach Level 4 in the FinLingo career ladder',
    icon: 'Crown',
    isUnlocked: false,
    category: 'xp' as const
  }
];

export const INITIAL_LEADERBOARD = [
  {
    id: 'lb-1',
    rank: 1,
    displayName: 'Wharton Scholar #12',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    university: 'Wharton (UPenn)',
    xp: 2450,
    streak: 18,
    badge: 'Diamond Analyst',
    league: 'Ivy League Tier',
    isCurrentUser: false
  },
  {
    id: 'lb-2',
    rank: 2,
    displayName: 'Stern Analyst #07',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    university: 'NYU Stern',
    xp: 1980,
    streak: 14,
    badge: 'Senior Associate',
    league: 'Ivy League Tier',
    isCurrentUser: false
  },
  {
    id: 'lb-3',
    rank: 3,
    displayName: 'Haas Quant #34',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    university: 'UC Berkeley (Haas)',
    xp: 1720,
    streak: 9,
    badge: 'Quant Pioneer',
    league: 'Ivy League Tier',
    isCurrentUser: false
  },
  {
    id: 'lb-curr',
    rank: 4,
    displayName: 'You (Student Scholar)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    university: 'Columbia Business School',
    xp: 420,
    streak: 3,
    badge: 'Junior Analyst',
    league: 'Gold League',
    isCurrentUser: true
  },
  {
    id: 'lb-5',
    rank: 5,
    displayName: 'LSE Macro Strategist #19',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    university: 'London School of Econ (LSE)',
    xp: 390,
    streak: 4,
    badge: 'Macro Strategist',
    league: 'Gold League',
    isCurrentUser: false
  },
  {
    id: 'lb-6',
    rank: 6,
    displayName: 'Booth Valuation Fellow #82',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    university: 'Chicago Booth',
    xp: 340,
    streak: 2,
    badge: 'Valuation Scholar',
    league: 'Gold League',
    isCurrentUser: false
  },
  {
    id: 'lb-7',
    rank: 7,
    displayName: 'HEC Paris Intern #45',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    university: 'HEC Paris',
    xp: 280,
    streak: 1,
    badge: 'Commerce Intern',
    league: 'Silver League',
    isCurrentUser: false
  }
];

