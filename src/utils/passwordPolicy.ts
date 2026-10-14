/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PasswordRequirementCheck {
  id: 'length' | 'lowercase' | 'uppercase' | 'digit' | 'special';
  label: string;
  met: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  checks: PasswordRequirementCheck[];
  strength: 'Weak' | 'Medium' | 'Strong';
  score: number; // 0 to 100
  feedback: string;
}

/**
 * Validates a password against FinLingo's security policy:
 * - At least 10 characters
 * - At least one lowercase letter (a-z)
 * - At least one uppercase letter (A-Z)
 * - At least one digit (0-9)
 * - At least one special character (!@#$%^&*...)
 */
export function validatePassword(password: string): PasswordValidationResult {
  const pwd = password || '';

  const checks: PasswordRequirementCheck[] = [
    {
      id: 'length',
      label: 'At least 10 characters',
      met: pwd.length >= 10
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter (a-z)',
      met: /[a-z]/.test(pwd)
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter (A-Z)',
      met: /[A-Z]/.test(pwd)
    },
    {
      id: 'digit',
      label: 'At least one digit (0-9)',
      met: /\d/.test(pwd)
    },
    {
      id: 'special',
      label: 'At least one special character (!@#$%^&*...)',
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pwd)
    }
  ];

  const metCount = checks.filter((c) => c.met).length;
  const allMet = metCount === checks.length;

  let strength: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  let score = 20;

  if (metCount <= 2 || pwd.length < 8) {
    strength = 'Weak';
    score = Math.min(30, metCount * 15);
  } else if (!allMet || pwd.length < 12) {
    strength = 'Medium';
    score = Math.min(70, 30 + metCount * 8 + (pwd.length >= 10 ? 10 : 0));
  } else {
    strength = 'Strong';
    score = 100;
  }

  let feedback = 'Does not meet minimum requirements.';
  if (allMet) {
    if (strength === 'Strong') {
      feedback = 'Excellent security strength.';
    } else {
      feedback = 'Meets all requirements. Add more characters for maximum strength.';
    }
  } else {
    const missing = checks.filter((c) => !c.met).map((c) => c.label.toLowerCase());
    feedback = `Missing: ${missing.slice(0, 2).join(', ')}`;
  }

  return {
    isValid: allMet,
    checks,
    strength,
    score,
    feedback
  };
}
