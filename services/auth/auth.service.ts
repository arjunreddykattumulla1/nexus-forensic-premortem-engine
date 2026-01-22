
export interface UserSession {
  agentId: string;
  accessLevel: 'L4_FORENSIC' | 'L5_ADMIN';
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'nexus_session';

export const authService = {
  getSession: (): UserSession | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  authorize: (): UserSession => {
    const session: UserSession = { 
      agentId: `AGENT_${Math.floor(1000 + Math.random() * 9000)}`, 
      accessLevel: 'L4_FORENSIC', 
      isAuthenticated: true 
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  terminate: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
