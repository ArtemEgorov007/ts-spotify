import { makeAutoObservable } from 'mobx';

export type AuthMethod = 'none' | 'vk' | 'local';

class AuthStore {
  username = '';
  email = '';
  authMethod: AuthMethod = 'none';
  authHydrated = false;

  constructor() {
    makeAutoObservable(this);
  }

  applyAuthUser(username: string, email: string, authMethod: AuthMethod) {
    this.username = username;
    this.email = email;
    this.authMethod = authMethod;
    this.authHydrated = true;
  }

  hydrateAuthUser(
    session: { username: string; email: string; authMethod: Exclude<AuthMethod, 'none'> } | null,
  ) {
    if (session) {
      this.username = session.username;
      this.email = session.email;
      this.authMethod = session.authMethod;
    } else {
      this.username = '';
      this.email = '';
      this.authMethod = 'none';
    }

    this.authHydrated = true;
  }

  clearAuthUser() {
    this.username = '';
    this.email = '';
    this.authMethod = 'none';
    this.authHydrated = true;
  }

  get roleChipLabel() {
    return this.username || this.email || 'Гость';
  }

  get isAuthenticated() {
    return this.authMethod !== 'none';
  }
}

export const authStore = new AuthStore();
