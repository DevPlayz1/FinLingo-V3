/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../types';

export interface AgeEligibilityRecord {
  accountEmail: string;
  role: UserRole;
  isConfirmed: boolean;
  confirmedAt?: number;
  isUnder13?: boolean;
}

const STORAGE_KEYS = {
  AGE_ELIGIBILITY: 'finlingo_age_eligibility_v1',
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

class EligibilityService {
  private getStorageKey(email: string, role: UserRole): string {
    return `${email.toLowerCase().trim()}#${role}`;
  }

  private getAllRecords(): Record<string, AgeEligibilityRecord> {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.AGE_ELIGIBILITY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return {};
  }

  private saveAllRecords(records: Record<string, AgeEligibilityRecord>): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.AGE_ELIGIBILITY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save age eligibility record:', e);
    }
  }

  public getEligibility(email: string, role: UserRole): AgeEligibilityRecord {
    if (!email) {
      return {
        accountEmail: '',
        role,
        isConfirmed: false,
        isUnder13: false
      };
    }

    // Faculty Administrators are institutional accounts and exempt from age verification
    if (role === 'admin') {
      return {
        accountEmail: email,
        role: 'admin',
        isConfirmed: true,
        confirmedAt: 0,
        isUnder13: false
      };
    }

    const key = this.getStorageKey(email, role);
    const records = this.getAllRecords();
    const record = records[key];

    if (!record || typeof record.isConfirmed !== 'boolean') {
      return {
        accountEmail: email,
        role,
        isConfirmed: false,
        isUnder13: false
      };
    }

    return record;
  }

  public confirmEligibility(email: string, role: UserRole): void {
    if (!email) return;
    const key = this.getStorageKey(email, role);
    const records = this.getAllRecords();
    records[key] = {
      accountEmail: email.toLowerCase().trim(),
      role,
      isConfirmed: true,
      confirmedAt: Date.now(),
      isUnder13: false
    };
    this.saveAllRecords(records);
  }

  public markUnder13(email: string, role: UserRole): void {
    if (!email) return;
    const key = this.getStorageKey(email, role);
    const records = this.getAllRecords();
    records[key] = {
      accountEmail: email.toLowerCase().trim(),
      role,
      isConfirmed: false,
      confirmedAt: undefined,
      isUnder13: true
    };
    this.saveAllRecords(records);
  }

  public clearUnder13Flag(email: string, role: UserRole): void {
    if (!email) return;
    const key = this.getStorageKey(email, role);
    const records = this.getAllRecords();
    if (records[key]) {
      records[key].isUnder13 = false;
      this.saveAllRecords(records);
    }
  }

  public revokeEligibility(email: string, role: UserRole): void {
    if (!email) return;
    const key = this.getStorageKey(email, role);
    const records = this.getAllRecords();
    records[key] = {
      accountEmail: email.toLowerCase().trim(),
      role,
      isConfirmed: false,
      confirmedAt: undefined,
      isUnder13: false
    };
    this.saveAllRecords(records);
  }
}

export const eligibilityService = new EligibilityService();
