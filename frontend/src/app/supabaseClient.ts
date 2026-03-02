// FastAPI backend base URL (CareFlow AI backend)
export const backendUrl =
  (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:8000";

class MockAuth {
  private listeners: any[] = [];

  async getSession() {
    const token = localStorage.getItem('careflow_token');
    let user = null;
    try {
      const userStr = localStorage.getItem('careflow_user');
      if (userStr) {
        user = JSON.parse(userStr);
      }
    } catch (e) {
      console.error("Failed to parse local user", e);
    }

    if (token && user) {
      try {
        const res = await fetch(`${backendUrl}/auth/me?token=${token}`);
        if (!res.ok) throw new Error("Invalid token");
      } catch {
        localStorage.removeItem('careflow_token');
        localStorage.removeItem('careflow_user');
        return { data: { session: null } };
      }
      return { data: { session: { access_token: token, user } } };
    }
    return { data: { session: null } };
  }

  async getUser() {
    let user = null;
    try {
      const userStr = localStorage.getItem('careflow_user');
      if (userStr) {
        user = JSON.parse(userStr);
      }
    } catch (e) {
      console.error("Failed to parse local user", e);
    }
    return { data: { user } };
  }

  onAuthStateChange(callback: any) {
    this.listeners.push(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
          }
        }
      }
    };
  }

  async signUp({ email, password, options }: any) {
    try {
      const res = await fetch(`${backendUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: options?.data?.name || '' })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Signup failed');
      }
      const data = await res.json();
      localStorage.setItem('careflow_token', data.session.access_token);
      localStorage.setItem('careflow_user', JSON.stringify({ email, user_metadata: { name: data.user.name } }));
      this.notifyListeners('SIGNED_IN', data.session);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async signInWithPassword({ email, password }: any) {
    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Invalid login credentials');
      }
      const data = await res.json();
      localStorage.setItem('careflow_token', data.session.access_token);
      localStorage.setItem('careflow_user', JSON.stringify({ email, user_metadata: { name: data.user.name } }));
      this.notifyListeners('SIGNED_IN', data.session);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async resetPasswordForEmail(email: string, options: any) {
    return { data: {}, error: null };
  }

  async signOut() {
    const token = localStorage.getItem('careflow_token');
    if (token) {
      try {
        await fetch(`${backendUrl}/auth/logout?token=${token}`, { method: 'POST' });
      } catch (e) {
        console.error("Failed to notify backend of logout", e);
      }
    }

    localStorage.removeItem('careflow_token');
    localStorage.removeItem('careflow_user');
    this.notifyListeners('SIGNED_OUT', null);
    return { error: null };
  }

  private notifyListeners(event: string, session: any) {
    this.listeners.forEach(cb => cb(event, session));
  }
}

export const supabase = {
  auth: new MockAuth()
} as any;

export const getServerUrl = (route: string) => {
  return `https://dummy.supabase.co/functions/v1/make-server-57da0870/${route}`;
};

