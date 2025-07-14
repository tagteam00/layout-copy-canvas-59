import DOMPurify from 'dompurify';
import { z } from 'zod';

// Sanitization utilities
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

// Validation schemas
export const profileValidationSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters')
    .transform(sanitizeText),
  
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .transform(sanitizeText),
  
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required'),
  
  gender: z.string()
    .min(1, 'Gender is required'),
  
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .transform((val) => val ? sanitizeText(val) : val),
  
  occupation: z.string()
    .max(100, 'Occupation must be less than 100 characters')
    .optional()
    .transform((val) => val ? sanitizeText(val) : val),
  
  city: z.string()
    .max(100, 'City must be less than 100 characters')
    .optional()
    .transform((val) => val ? sanitizeText(val) : val),
  
  country: z.string()
    .max(100, 'Country must be less than 100 characters')
    .optional()
    .transform((val) => val ? sanitizeText(val) : val),
});

export const teamValidationSchema = z.object({
  name: z.string()
    .min(1, 'Team name is required')
    .max(100, 'Team name must be less than 100 characters')
    .transform(sanitizeText),
  
  category: z.string()
    .min(1, 'Category is required')
    .transform(sanitizeText),
  
  frequency: z.string()
    .min(1, 'Frequency is required')
    .transform(sanitizeText),
});

export const goalValidationSchema = z.object({
  goal: z.string()
    .min(1, 'Goal is required')
    .max(500, 'Goal must be less than 500 characters')
    .transform(sanitizeText),
});

// Input sanitization hook
export const useSanitizedInput = () => {
  return {
    sanitizeText,
    sanitizeHtml,
    validateProfile: (data: any) => profileValidationSchema.safeParse(data),
    validateTeam: (data: any) => teamValidationSchema.safeParse(data),
    validateGoal: (data: any) => goalValidationSchema.safeParse(data),
  };
};