import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  registeredAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, fullName: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_PROJECT = 'w7iumFMzCPKzLHMu';

async function fetchUsers(): Promise<any[]> {
  try {
    const res = await fetch(`/api/taskade/projects/${USERS_PROJECT}/nodes`);
    if (!res.ok) return [];
    const data = await res.json();
    return data?.payload?.nodes || [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('zone_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const nodes = await fetchUsers();

      // If API is unavailable, fall back to localStorage-only users
      if (nodes.length === 0) {
        const localUsers: User[] = JSON.parse(localStorage.getItem('zone_local_users') || '[]');
        const normalize = (p: string) => p.replace(/\D/g, '');
        const localUser = localUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && normalize(u.phone) === normalize(phone)
        );
        if (!localUser) {
          return { success: false, error: 'No account found. Please register or check your credentials.' };
        }
        setUser(localUser);
        localStorage.setItem('zone_user', JSON.stringify(localUser));
        return { success: true };
      }

      const normalize = (p: string) => p.replace(/\D/g, '');

      const userNode = nodes.find((n: any) => {
        const nodeEmail = n.fieldValues?.['/attributes/@usr01'] || '';
        return nodeEmail.toLowerCase() === email.toLowerCase();
      });

      if (!userNode) {
        return { success: false, error: 'No account found with that email.' };
      }

      const storedPhone = normalize(userNode.fieldValues?.['/attributes/@usr03'] || '');
      const inputPhone = normalize(phone);

      if (!storedPhone || storedPhone !== inputPhone) {
        return { success: false, error: 'Incorrect phone number.' };
      }

      const userData: User = {
        id: userNode.id,
        email: userNode.fieldValues?.['/attributes/@usr01'] || email,
        fullName: userNode.fieldValues?.['/attributes/@usr02'] || '',
        phone: userNode.fieldValues?.['/attributes/@usr03'] || '',
        registeredAt: userNode.fieldValues?.['/attributes/@usr04'] || '',
      };

      // Update last login (best-effort)
      fetch(`/api/taskade/projects/${USERS_PROJECT}/nodes/${userNode.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ '/attributes/@usr05': new Date().toISOString() }),
      }).catch(() => {});

      setUser(userData);
      localStorage.setItem('zone_user', JSON.stringify(userData));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (
    email: string,
    fullName: string,
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const nodes = await fetchUsers();
      const now = new Date().toISOString();

      // API unavailable — store locally
      if (nodes.length === 0) {
        const localUsers: User[] = JSON.parse(localStorage.getItem('zone_local_users') || '[]');
        const exists = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return { success: false, error: 'An account with that email already exists.' };
        }
        const newUser: User = {
          id: `local_${Date.now()}`,
          email,
          fullName,
          phone,
          registeredAt: now,
        };
        localUsers.push(newUser);
        localStorage.setItem('zone_local_users', JSON.stringify(localUsers));
        setUser(newUser);
        localStorage.setItem('zone_user', JSON.stringify(newUser));
        return { success: true };
      }

      const exists = nodes.find((n: any) =>
        (n.fieldValues?.['/attributes/@usr01'] || '').toLowerCase() === email.toLowerCase()
      );

      if (exists) {
        return { success: false, error: 'An account with that email already exists.' };
      }

      const createRes = await fetch(`/api/taskade/projects/${USERS_PROJECT}/nodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          '/text': fullName,
          '/attributes/@usr01': email,
          '/attributes/@usr02': fullName,
          '/attributes/@usr03': phone,
          '/attributes/@usr04': now,
          '/attributes/@usr05': now,
        }),
      });

      if (!createRes.ok) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      const createData = await createRes.json();
      const newId = createData?.payload?.node?.id || createData?.id || Date.now().toString();

      const userData: User = {
        id: newId,
        email,
        fullName,
        phone,
        registeredAt: now,
      };

      setUser(userData);
      localStorage.setItem('zone_user', JSON.stringify(userData));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zone_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
