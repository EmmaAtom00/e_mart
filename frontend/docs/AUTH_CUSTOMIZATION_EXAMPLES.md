# Authentication Customization Examples

Common customizations and how to implement them.

## 1. Add Social Login (Google)

### Install Google OAuth Library

```bash
npm install @react-oauth/google
```

### Update Layout

```typescript
// app/layout.tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

### Add Google Login Button

```typescript
// components/auth/GoogleLoginButton.tsx
import { useGoogleLogin } from '@react-oauth/google';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export const GoogleLoginButton = () => {
  const { login } = useStore();
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      // Send token to backend
      const response = await fetch('/api/auth/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: codeResponse.access_token }),
      });
      
      const data = await response.json();
      if (data.access) {
        localStorage.setItem('auth_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        router.push('/');
      }
    },
  });

  return (
    <button onClick={() => handleGoogleLogin()}>
      Sign in with Google
    </button>
  );
};
```

## 2. Add Email Verification

### Create Verification Page

```typescript
// app/(pages)/auth/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await apiClient.request('/auth/verify-email/', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });
        
        if (response.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === 'loading' && <div>Verifying email...</div>}
      {status === 'success' && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
          <p>You can now login to your account.</p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
          <p>The verification link is invalid or expired.</p>
        </div>
      )}
    </div>
  );
}
```

## 3. Add Two-Factor Authentication

### Create 2FA Setup Page

```typescript
// app/(pages)/account/2fa/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function TwoFactorPage() {
  const { user } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleEnable2FA = async () => {
    const response = await fetch('/api/auth/2fa/setup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await response.json();
    setQrCode(data.qr_code);
  };

  const handleVerify2FA = async () => {
    const response = await fetch('/api/auth/2fa/verify/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: verificationCode }),
    });
    
    if (response.ok) {
      setIs2FAEnabled(true);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Two-Factor Authentication</h1>
        
        {!is2FAEnabled ? (
          <div className="space-y-4">
            <button
              onClick={handleEnable2FA}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Enable 2FA
            </button>
            
            {qrCode && (
              <div>
                <img src={qrCode} alt="2FA QR Code" />
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                />
                <button
                  onClick={handleVerify2FA}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Verify
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded">
            <p className="text-green-700">2FA is enabled</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
```

## 4. Add Session Management

### Create Session List Component

```typescript
// components/auth/SessionManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface Session {
  id: string;
  device: string;
  lastActive: string;
  isCurrent: boolean;
}

export const SessionManager = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await apiClient.request('/auth/sessions/', {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        setSessions(response.data);
      }
    };

    fetchSessions();
  }, []);

  const handleLogoutSession = async (sessionId: string) => {
    await apiClient.request(`/auth/sessions/${sessionId}/logout/`, {
      method: 'POST',
    });
    
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Active Sessions</h3>
      {sessions.map(session => (
        <div key={session.id} className="border p-4 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{session.device}</p>
              <p className="text-sm text-gray-600">
                Last active: {new Date(session.lastActive).toLocaleString()}
              </p>
              {session.isCurrent && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Current
                </span>
              )}
            </div>
            {!session.isCurrent && (
              <button
                onClick={() => handleLogoutSession(session.id)}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
```

## 5. Add Activity Logging

### Create Activity Log Component

```typescript
// components/auth/ActivityLog.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface Activity {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export const ActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await apiClient.request('/auth/activity/', {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        setActivities(response.data);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-2">
        {activities.map(activity => (
          <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="font-medium">{activity.action}</p>
            <p className="text-sm text-gray-600">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">{activity.ipAddress}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 6. Add Password Strength Indicator

### Create Password Strength Component

```typescript
// components/auth/PasswordStrengthIndicator.tsx
'use client';

import { useState, useEffect } from 'react';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Very Weak',
    color: 'bg-red-500',
  });

  useEffect(() => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const strengthLevels = [
      { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      { score: 1, label: 'Weak', color: 'bg-orange-500' },
      { score: 2, label: 'Fair', color: 'bg-yellow-500' },
      { score: 3, label: 'Good', color: 'bg-blue-500' },
      { score: 4, label: 'Strong', color: 'bg-green-500' },
      { score: 5, label: 'Very Strong', color: 'bg-green-600' },
    ];

    setStrength(strengthLevels[Math.min(score, 5)]);
  }, [password]);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded ${
              i < strength.score ? strength.color : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Password Strength: <span className="font-semibold">{strength.label}</span>
      </p>
    </div>
  );
};
```

## 7. Add Remember Me Functionality

### Update Sign In Page

```typescript
// app/(pages)/auth/sign-in/page.tsx
'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function SignIn() {
  const { login } = useStore();
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success && rememberMe) {
      // Store email for next time
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    // ... form JSX
    <label>
      <input
        type="checkbox"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      />
      Remember me
    </label>
  );
}
```

## 8. Add Custom Error Messages

### Create Error Handler Hook

```typescript
// hooks/useAuthError.ts
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

const errorMessages: Record<string, string> = {
  'Invalid credentials': 'Email or password is incorrect',
  'Email already exists': 'This email is already registered',
  'Token expired': 'Your session has expired. Please login again',
  'Unauthorized': 'You are not authorized to access this resource',
};

export const useAuthError = () => {
  const { error, clearError } = useStore();

  const getErrorMessage = (err: string | null) => {
    if (!err) return null;
    return errorMessages[err] || err;
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return {
    error,
    errorMessage: getErrorMessage(error),
    clearError,
  };
};
```

## 9. Add Rate Limiting UI

### Create Rate Limit Handler

```typescript
// lib/rateLimiter.ts
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts = 5;
  private windowMs = 15 * 60 * 1000; // 15 minutes

  isLimited(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts
    const recentAttempts = attempts.filter(
      time => now - time < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return true;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return false;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remaining = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, remaining);
  }
}

export const rateLimiter = new RateLimiter();
```

## 10. Add Biometric Authentication

### Create Biometric Login Component

```typescript
// components/auth/BiometricLogin.tsx
'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

export const BiometricLogin = () => {
  const { login } = useStore();
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is supported
    if (window.PublicKeyCredential) {
      setIsSupported(true);
    }
  }, []);

  const handleBiometricLogin = async () => {
    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: 'preferred',
        },
      });

      if (assertion) {
        // Send to backend for verification
        const response = await fetch('/api/auth/biometric/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assertion }),
        });

        const data = await response.json();
        if (data.access) {
          localStorage.setItem('auth_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
        }
      }
    } catch (error) {
      console.error('Biometric login failed:', error);
    }
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={handleBiometricLogin}
      className="w-full bg-purple-600 text-white py-3 rounded-lg"
    >
      Login with Biometric
    </button>
  );
};
```

---

These examples show how to extend the authentication system with common features. Adapt them to your specific needs.
