import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private storageService: StorageService
  ) {}

  async login(email: string, password: string): Promise<void> {
    if (!navigator.onLine) {
      const savedCredentials = await this.storageService.get('userCredentials');
      if (savedCredentials && savedCredentials.email === email && savedCredentials.password === password) {
        this.isAuthenticated = true;
        console.log('Inicio de sesión offline exitoso');
        return;
      } else {
        throw new Error('No hay conexión y las credenciales no coinciden.');
      }
    }

    const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
    if (userCredential.user) {
      this.isAuthenticated = true;
      await this.storageService.set('userCredentials', { email, password });
      console.log('Credenciales guardadas en almacenamiento local');
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.afAuth.signOut();
  }

  async checkStoredCredentials(): Promise<boolean> {
    const savedCredentials = await this.storageService.get('userCredentials');
    this.isAuthenticated = !!savedCredentials;
    return this.isAuthenticated;
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }
}
