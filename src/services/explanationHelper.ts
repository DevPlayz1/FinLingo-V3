/**
 * Pedagogical Explanation Enhancer for FinLingo
 * Ensures every quiz question presents a clear, factually accurate explanation
 * of why the correct option is right, particularly for calculations and core commerce concepts.
 */

import { QuizQuestion } from '../types';

export function getEnhancedExplanation(question: QuizQuestion): string {
  const existing = question.explanation;
  const isGeneric = !existing || existing.includes('The source question bank does not include a separate explanation');

  if (!isGeneric && existing.length > 40) {
    return existing;
  }

  const correctText = question.options[question.correctOptionIndex];
  const promptLower = question.prompt.toLowerCase();

  // Accounting fundamentals
  if (promptLower.includes('debit balance') && promptLower.includes('normally')) {
    return `Correct: ${correctText}. Assets (like Accounts Receivable and Cash) and expenses naturally carry normal debit balances, increasing with debits and decreasing with credits. In contrast, liabilities, revenues, and equity normally have credit balances.`;
  }
  if (promptLower.includes('balance sheet') || promptLower.includes('specific date')) {
    return `Correct: ${correctText}. The Balance Sheet provides a snapshot of an organization's financial position (Assets = Liabilities + Equity) at a single specific point in time, unlike the Income Statement which measures flows over a period.`;
  }
  if (promptLower.includes('contra-asset')) {
    return `Correct: ${correctText}. Accumulated Depreciation is a contra-asset account with a normal credit balance that offsets the gross value of property, plant, and equipment (PP&E) on the balance sheet.`;
  }
  if (promptLower.includes('accrual accounting') && promptLower.includes('revenue')) {
    return `Correct: ${correctText}. Under accrual accounting and revenue recognition standards (such as ASC 606 / IFRS 15), revenue is recorded when performance obligations are satisfied (earned), regardless of cash collection timing.`;
  }
  if (promptLower.includes('prepaid') || promptLower.includes('advance')) {
    return `Correct: ${correctText}. Payments made in advance for future benefits (like rent or insurance) represent future economic value and are initially classified as current assets until consumed over time.`;
  }
  if (promptLower.includes('accounting equation')) {
    return `Correct: ${correctText}. The fundamental accounting equation is Assets = Liabilities + Equity. Every business transaction maintains this dual balance across financial accounts.`;
  }
  if (promptLower.includes('gross profit')) {
    return `Correct: ${correctText}. Gross Profit is defined as Net Sales Revenue minus Cost of Goods Sold (COGS), measuring core production/merchandise profitability before operating overhead.`;
  }
  if (promptLower.includes('fifo')) {
    return `Correct: ${correctText}. Under FIFO (First-In, First-Out), the oldest inventory acquired is assumed to be sold first, leaving the most recently acquired goods in ending inventory on the balance sheet.`;
  }
  if (promptLower.includes('depreciation') && promptLower.includes('straight-line')) {
    return `Correct: ${correctText}. Straight-line depreciation evenly allocates the depreciable base: (Historical Cost − Estimated Residual/Salvage Value) divided by Estimated Useful Life.`;
  }
  if (promptLower.includes('time value of money')) {
    return `Correct: ${correctText}. A dollar received today can be invested immediately to earn interest or returns, making it more valuable than a future dollar, all else equal.`;
  }
  if (promptLower.includes('npv') || promptLower.includes('net present value')) {
    return `Correct: ${correctText}. Positive NPV indicates that the present value of all discounted expected future cash inflows exceeds the initial upfront capital outlay, creating net shareholder value.`;
  }
  if (promptLower.includes('irr') || promptLower.includes('internal rate of return')) {
    return `Correct: ${correctText}. The Internal Rate of Return (IRR) is mathematically defined as the discount rate at which the Net Present Value (NPV) of a project's cash flows equals exactly zero.`;
  }
  if (promptLower.includes('bond') && promptLower.includes('yield')) {
    return `Correct: ${correctText}. Bond prices and market yields share an inverse relationship: when required market yield falls, the fixed stream of coupon payments becomes more desirable, driving bond prices up.`;
  }
  if (promptLower.includes('diversification')) {
    return `Correct: ${correctText}. Holding a portfolio of non-perfectly correlated assets eliminates unsystematic (company-specific/idiosyncratic) risk without sacrificing expected portfolio returns.`;
  }
  if (promptLower.includes('beta')) {
    return `Correct: ${correctText}. Beta measures the systematic risk or volatility of an asset or stock relative to the broader benchmark market as a whole (where market beta = 1.0).`;
  }
  if (promptLower.includes('capm')) {
    return `Correct: ${correctText}. Under the Capital Asset Pricing Model (CAPM), Expected Return = Risk-Free Rate + Beta × (Market Return − Risk-Free Rate), compensating investors solely for non-diversifiable systematic risk.`;
  }
  if (promptLower.includes('opportunity cost')) {
    return `Correct: ${correctText}. Opportunity cost is the value of the next best foregone alternative when a choice is made among mutually exclusive options.`;
  }
  if (promptLower.includes('elasticity')) {
    return `Correct: ${correctText}. Price elasticity of demand measures consumer responsiveness: the percentage change in quantity demanded divided by the percentage change in price.`;
  }

  // Fallback clear explanation stating the key and principle
  return `Correct answer: "${correctText}". This matches the verified answer key. Review the associated concept in ${question.topicTag} for full theoretical derivations.`;
}
