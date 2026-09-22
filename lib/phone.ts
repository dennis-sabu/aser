/**
 * Indian Phone Number Validation, Normalization, and WhatsApp Link Utilities
 * 
 * Rules:
 * - Indian mobile numbers have 10 digits starting with 6, 7, 8, or 9.
 * - Acceptable inputs include prefixes like +91, 91, or 0, along with spaces, dashes, or parentheses.
 * - Normalized format for storage: +91XXXXXXXXXX
 * - WhatsApp URL format: https://wa.me/91XXXXXXXXXX?text=... (digits only, no '+' or special characters)
 */

export interface PhoneValidationResult {
  valid: boolean;
  normalized?: string; // e.g. +919876543210
  formatted?: string;  // e.g. +91 98765 43210
  cleanDigits?: string; // e.g. 919876543210
  error?: string;
}

/**
 * Validates and normalizes an Indian phone number.
 */
export function validateAndNormalizeIndianPhone(rawPhone: string | null | undefined): PhoneValidationResult {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { valid: false, error: 'Phone number is required.' };
  }

  const trimmed = rawPhone.trim();
  if (!trimmed) {
    return { valid: false, error: 'Phone number is required.' };
  }

  // Remove common separators (spaces, dashes, parentheses, dots)
  let clean = trimmed.replace(/[\s\-().]/g, '');

  // Strip leading '+' if present
  if (clean.startsWith('+')) {
    clean = clean.slice(1);
  }

  // Handle various prefixes:
  // 1. If starts with 91 and has 12 digits total
  if (clean.startsWith('91') && clean.length === 12) {
    clean = clean.slice(2);
  }
  // 2. If starts with 0 and has 11 digits total (STD trunk prefix)
  else if (clean.startsWith('0') && clean.length === 11) {
    clean = clean.slice(1);
  }

  // Check if remaining characters are exactly 10 digits
  if (!/^\d+$/.test(clean)) {
    return {
      valid: false,
      error: 'Phone number must contain only valid numbers.',
    };
  }

  if (clean.length !== 10) {
    return {
      valid: false,
      error: `Indian mobile number must be 10 digits (got ${clean.length}).`,
    };
  }

  // Indian mobile numbers must start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(clean)) {
    return {
      valid: false,
      error: 'Invalid Indian mobile number. Mobile numbers must start with 6, 7, 8, or 9.',
    };
  }

  const normalized = `+91${clean}`;
  const formatted = `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  const cleanDigits = `91${clean}`;

  return {
    valid: true,
    normalized,
    formatted,
    cleanDigits,
  };
}

/**
 * Generates an official WhatsApp click-to-chat URL.
 * URL format: https://wa.me/<number>?text=<encoded_text>
 * WhatsApp requires the international number without '+' or formatting symbols.
 */
export function getWhatsAppUrl(phone: string | null | undefined, prefilledText?: string): string | null {
  if (!phone) return null;

  const result = validateAndNormalizeIndianPhone(phone);
  if (!result.valid || !result.cleanDigits) {
    return null;
  }

  let url = `https://wa.me/${result.cleanDigits}`;
  if (prefilledText && prefilledText.trim()) {
    url += `?text=${encodeURIComponent(prefilledText.trim())}`;
  }

  return url;
}

/**
 * Formats a phone number for user-friendly display in settings.
 * Returns formatted '+91 XXXXX XXXXX' or original trimmed string.
 */
export function formatPhoneDisplay(phone: string | null | undefined): string {
  if (!phone) return '';
  const result = validateAndNormalizeIndianPhone(phone);
  return result.valid && result.formatted ? result.formatted : phone.trim();
}
