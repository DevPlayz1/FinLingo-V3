/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../types';
import { validatePassword } from '../utils/passwordPolicy';
import { PROF_ANJALI_SANE_AVATAR } from '../assets/adminAvatar';

export interface PredefinedAccount {
  email: string;
  role: UserRole;
  displayName: string;
  avatar: string;
  university: string;
  salt: string;
  hash: string;
  iterations: number;
  sessionEpoch: number;
  updatedAt: number;
}

export interface ActiveSession {
  email: string;
  role: UserRole;
  displayName: string;
  sessionToken: string;
  sessionEpoch: number;
  loginTime: number;
}

const STORAGE_KEYS = {
  ACCOUNTS: 'finlingo_auth_accounts_v1',
  SESSION: 'finlingo_auth_session_v1',
  THROTTLE: 'finlingo_auth_throttle_v1'
};

const memoryStore: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStore[key] ?? null;
    } catch {
      return memoryStore[key] ?? null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      memoryStore[key] = value;
    } catch {
      memoryStore[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      delete memoryStore[key];
    } catch {
      delete memoryStore[key];
    }
  }
};

// Initial default passwords satisfying all 5 requirements:
// - At least 10 chars
// - Lowercase, Uppercase, Digit, Special char
export const INITIAL_CREDENTIALS = {
  admin: {
    email: 'admin@finlingo.local',
    defaultPassword: 'Admin#2026Master',
    role: 'admin' as UserRole,
    displayName: 'Prof. Dr. Anjali Sane'
  },
  user: {
    email: 'learner@finlingo.local',
    defaultPassword: 'Learner!Pass2026',
    role: 'user' as UserRole,
    displayName: 'Dev Purecha'
  }
};

/**
 * Standard Web Crypto PBKDF2 Password Hashing
 * 
 * ARCHITECTURE NOTICE:
 * This PBKDF2 implementation uses the browser's native Web Crypto API with 100,000 iterations
 * and unique 16-byte random cryptographic salts.
 * Plaintext passwords are NEVER stored in localStorage or logged.
 * 
 * LIMITATION DISCLAIMER:
 * Because FinLingo operates as a local browser demo without a trusted backend server,
 * client-side hashing cannot provide production-grade security against someone who inspects or
 * modifies client-side JavaScript. Production systems must authenticate credentials on a
 * trusted server using Argon2id or bcrypt with secure, HTTP-only session cookies.
 */
async function derivePbkdf2Hash(password: string, saltHex: string, iterations = 100000): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBytes = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateRandomHex(byteCount = 16): string {
  const bytes = new Uint8Array(byteCount);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

class AuthService {
  private initialized = false;
  private activeSession: ActiveSession | null = null;

  constructor() {
    this.logout();
    this.ensureInitialized();
  }

  /**
   * Initializes the two predefined accounts with PBKDF2 password hashes if not already set.
   */
  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (!stored) {
        // Bootstrap the two predefined accounts
        const adminSalt = generateRandomHex(16);
        const adminHash = await derivePbkdf2Hash(INITIAL_CREDENTIALS.admin.defaultPassword, adminSalt);

        const userSalt = generateRandomHex(16);
        const userHash = await derivePbkdf2Hash(INITIAL_CREDENTIALS.user.defaultPassword, userSalt);

        const initialAccounts: Record<string, PredefinedAccount> = {
          [INITIAL_CREDENTIALS.admin.email.toLowerCase()]: {
            email: INITIAL_CREDENTIALS.admin.email,
            role: 'admin',
            displayName: 'Prof. Dr. Anjali Sane',
            avatar: PROF_ANJALI_SANE_AVATAR,
            university: 'Faculty of Commerce & Finance',
            salt: adminSalt,
            hash: adminHash,
            iterations: 100000,
            sessionEpoch: Date.now(),
            updatedAt: Date.now()
          },
          [INITIAL_CREDENTIALS.user.email.toLowerCase()]: {
            email: INITIAL_CREDENTIALS.user.email,
            role: 'user',
            displayName: 'Dev Purecha',
            avatar: '',
            university: 'Columbia Business School',
            salt: userSalt,
            hash: userHash,
            iterations: 100000,
            sessionEpoch: Date.now(),
            updatedAt: Date.now()
          }
        };

        safeStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(initialAccounts));
      } else {
        // Migrate existing accounts if they contain old display names or old avatars
        const existingAccounts = JSON.parse(stored);
        let updated = false;
        const adminKey = INITIAL_CREDENTIALS.admin.email.toLowerCase();
        const userKey = INITIAL_CREDENTIALS.user.email.toLowerCase();

        if (existingAccounts[adminKey]) {
          if (existingAccounts[adminKey].displayName !== 'Prof. Dr. Anjali Sane') {
            existingAccounts[adminKey].displayName = 'Prof. Dr. Anjali Sane';
            updated = true;
          }
          if (existingAccounts[adminKey].avatar?.includes('unsplash.com') || !existingAccounts[adminKey].avatar) {
            existingAccounts[adminKey].avatar = PROF_ANJALI_SANE_AVATAR;
            updated = true;
          }
        }
        if (existingAccounts[userKey]) {
          if (existingAccounts[userKey].displayName !== 'Dev Purecha') {
            existingAccounts[userKey].displayName = 'Dev Purecha';
            updated = true;
          }
          if (existingAccounts[userKey].avatar?.includes('unsplash.com')) {
            existingAccounts[userKey].avatar = '';
            updated = true;
          }
        }
        if (updated) {
          safeStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(existingAccounts));
        }
      }
      this.initialized = true;
    } catch (e) {
      console.warn('AuthService initialization notice:', e);
      this.initialized = true;
    }
  }

  // --- ACCOUNT STORAGE GETTERS & SETTERS ---
  private getAccounts(): Record<string, PredefinedAccount> {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return {};
  }

  private saveAccounts(accounts: Record<string, PredefinedAccount>): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch {
      // Ignore
    }
  }

  // --- THROTTLING & RATE LIMITING SAFEGUARD ---
  private getThrottleRecord(email: string): { failedAttempts: number; lockedUntil: number } {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.THROTTLE);
      if (raw) {
        const parsed = JSON.parse(raw);
        const key = email.toLowerCase().trim();
        if (parsed[key]) {
          return parsed[key];
        }
      }
    } catch {
      // Ignore
    }
    return { failedAttempts: 0, lockedUntil: 0 };
  }

  private updateThrottleRecord(email: string, failedAttempts: number, lockedUntil = 0): void {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.THROTTLE);
      const parsed = raw ? JSON.parse(raw) : {};
      const key = email.toLowerCase().trim();
      parsed[key] = { failedAttempts, lockedUntil };
      safeStorage.setItem(STORAGE_KEYS.THROTTLE, JSON.stringify(parsed));
    } catch {
      // Ignore
    }
  }

  private clearThrottle(email: string): void {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.THROTTLE);
      if (raw) {
        const parsed = JSON.parse(raw);
        delete parsed[email.toLowerCase().trim()];
        safeStorage.setItem(STORAGE_KEYS.THROTTLE, JSON.stringify(parsed));
      }
    } catch {
      // Ignore
    }
  }

  // --- LOGIN & AUTHENTICATION ---
  /**
   * Authenticates against the registered account.
   * Enforces:
   * 1. Generic error messages for invalid credentials (safeguard 8).
   * 2. Throttling for repeated failed attempts (lockout for 60s after 5 failed tries).
   * 3. Verifies account's true assigned role rather than relying on the selected login tab alone.
   * 4. Session epoch matching to invalidate stale sessions.
   */
  async login(
    email: string,
    passwordAttempt: string,
    expectedRoleTab?: UserRole
  ): Promise<{
    success: boolean;
    error?: string;
    lockSeconds?: number;
    remainingAttempts?: number;
    user?: ActiveSession;
    assignedRoleMismatch?: {
      accountRole: UserRole;
      tabRole: UserRole;
    };
  }> {
    await this.ensureInitialized();

    const normalizedEmail = (email || '').toLowerCase().trim();
    const throttle = this.getThrottleRecord(normalizedEmail);

    // Check if account is currently locked out
    const now = Date.now();
    if (throttle.lockedUntil > now) {
      const lockSeconds = Math.ceil((throttle.lockedUntil - now) / 1000);
      return {
        success: false,
        error: `Too many failed login attempts. Account temporarily locked for security. Please wait ${lockSeconds} seconds.`,
        lockSeconds
      };
    }

    const accounts = this.getAccounts();
    const account = accounts[normalizedEmail];

    // Generic invalid credential check
    if (!account) {
      const newAttempts = throttle.failedAttempts + 1;
      let lockedUntil = 0;
      if (newAttempts >= 5) {
        lockedUntil = Date.now() + 60000; // 60-second cooldown
      }
      this.updateThrottleRecord(normalizedEmail, newAttempts, lockedUntil);

      return {
        success: false,
        error: 'Invalid email or password.',
        remainingAttempts: Math.max(0, 5 - newAttempts)
      };
    }

    // Hash check using account salt and PBKDF2
    const computedHash = await derivePbkdf2Hash(passwordAttempt, account.salt, account.iterations || 100000);
    if (computedHash !== account.hash) {
      const newAttempts = throttle.failedAttempts + 1;
      let lockedUntil = 0;
      if (newAttempts >= 5) {
        lockedUntil = Date.now() + 60000; // 60-second cooldown
      }
      this.updateThrottleRecord(normalizedEmail, newAttempts, lockedUntil);

      return {
        success: false,
        error: 'Invalid email or password.',
        remainingAttempts: Math.max(0, 5 - newAttempts),
        lockSeconds: lockedUntil > 0 ? 60 : undefined
      };
    }

    // Success! Clear throttle
    this.clearThrottle(normalizedEmail);

    // Create session token and record
    const sessionToken = generateRandomHex(24);
    const session: ActiveSession = {
      email: account.email,
      role: account.role,
      displayName: account.displayName,
      sessionToken,
      sessionEpoch: account.sessionEpoch || Date.now(),
      loginTime: Date.now()
    };

    // Enforce strict separation between Admin and User login tabs
    if (expectedRoleTab === 'admin' && account.role !== 'admin') {
      return {
        success: false,
        error: 'Administrator credentials required. User account credentials cannot be used for Admin access.'
      };
    }

    if (expectedRoleTab === 'user' && account.role === 'admin') {
      return {
        success: false,
        error: 'Faculty Administrator credentials detected. Please switch to the Admin Login tab to sign in.'
      };
    }

    // Store session in-memory only: active for the current runtime session.
    // Fresh visit or page reload will always require authentication first.
    this.activeSession = session;

    // Purge any stored session in localStorage/sessionStorage so reload/revisit never auto-authenticates
    safeStorage.removeItem(STORAGE_KEYS.SESSION);
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(STORAGE_KEYS.SESSION);
        window.localStorage.removeItem(STORAGE_KEYS.SESSION);
        window.sessionStorage.removeItem('finlingo_active_session');
        window.localStorage.removeItem('finlingo_active_session');
      }
    } catch {
      // Ignore
    }

    return {
      success: true,
      user: session
    };
  }

  // --- SESSION MANAGEMENT ---
  getCurrentSession(): ActiveSession | null {
    if (!this.activeSession) return null;

    try {
      // Verify session epoch is still valid (not invalidated by a password change)
      const accounts = this.getAccounts();
      const account = accounts[this.activeSession.email.toLowerCase()];
      if (!account || (account.sessionEpoch && this.activeSession.sessionEpoch < account.sessionEpoch)) {
        // Session was invalidated
        this.logout();
        return null;
      }

      if (this.activeSession.role === 'admin' && this.activeSession.displayName !== 'Prof. Dr. Anjali Sane') {
        this.activeSession.displayName = 'Prof. Dr. Anjali Sane';
      } else if (this.activeSession.role === 'user' && this.activeSession.displayName !== 'Dev Purecha') {
        this.activeSession.displayName = 'Dev Purecha';
      }

      return this.activeSession;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null;
  }

  logout(): void {
    this.activeSession = null;
    safeStorage.removeItem(STORAGE_KEYS.SESSION);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEYS.SESSION);
        window.sessionStorage.removeItem(STORAGE_KEYS.SESSION);
        window.localStorage.removeItem('finlingo_active_session');
        window.sessionStorage.removeItem('finlingo_active_session');
      }
    } catch {
      // Ignore
    }
  }

  // --- PASSWORD MANAGEMENT (IN-APP) ---
  /**
   * Updates an account password.
   * Enforces:
   * 1. 5 requirements via validatePassword (min 10 chars, lower, upper, digit, special).
   * 2. Derives fresh PBKDF2 hash with unique 16-byte random salt.
   * 3. Plaintext password is NEVER stored.
   * 4. Updates sessionEpoch so stale sessions are invalidated.
   */
  async changePassword(
    email: string,
    newPassword: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    await this.ensureInitialized();

    const normalizedEmail = (email || '').toLowerCase().trim();
    const accounts = this.getAccounts();
    const account = accounts[normalizedEmail];

    if (!account) {
      return { success: false, error: 'Account not found.' };
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'Password does not meet all security requirements.'
      };
    }

    const newSalt = generateRandomHex(16);
    const newHash = await derivePbkdf2Hash(newPassword, newSalt, 100000);

    const now = Date.now();
    account.salt = newSalt;
    account.hash = newHash;
    account.sessionEpoch = now;
    account.updatedAt = now;

    this.saveAccounts(accounts);

    // Update current active session epoch if this account is currently logged in
    const currentSession = this.getCurrentSession();
    if (currentSession && currentSession.email.toLowerCase() === normalizedEmail) {
      currentSession.sessionEpoch = now;
    }

    return { success: true };
  }

  // --- UTILS ---
  getAccountRole(email: string): UserRole | null {
    const accounts = this.getAccounts();
    const acc = accounts[email.toLowerCase().trim()];
    return acc ? acc.role : null;
  }
}

export const authService = new AuthService();
