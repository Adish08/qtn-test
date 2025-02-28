// utils/auth.ts

import { Credentials } from '../types';

export const VALID_CREDENTIALS: Credentials[] = [
  { username: 'paras', password: '6408' },
  { username: 'ankesh', password: 'ankeshpatel123' },
  { username: 'ajay', password: 'ajay787' },
  { username: 'demo', password: 'demo123' }
];

export const SESSION_TIMEOUT = 48 * 60 * 60 * 1000; // 48 hours

export const validateCredentials = (username: string, password: string): boolean => {
  return VALID_CREDENTIALS.some(
    cred => cred.username === username && cred.password === password
  );
};

export const saveUserSession = (username: string): void => {
  const expiryTime = Date.now() + SESSION_TIMEOUT;
  localStorage.setItem('user', JSON.stringify({
    username,
    expiryTime
  }));
};

export const checkUserSession = (): string | null => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    const userData = JSON.parse(userJson);
    if (userData.expiryTime > Date.now()) {
      return userData.username;
    } else {
      localStorage.removeItem('user');
      return null;
    }
  } catch (e) {
    localStorage.removeItem('user');
    return null;
  }
};

export const clearUserSession = (): void => {
  localStorage.removeItem('user');
};