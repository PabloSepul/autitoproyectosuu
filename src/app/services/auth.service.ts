import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private storageService: StorageService) {}

  sendPasswordResetEmail(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string): Promise<void> {
    if (!navigator.onLine) {
      const savedCredentials = await this.storageService.get('userCredentials');
      if (savedCredentials && savedCredentials.email === email && savedCredentials.password === password) {
        console.log('Inicio de sesión offline exitoso');
        return;
      } else {
        throw new Error('No hay conexión y las credenciales no coinciden.');
      }
    }

    const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
    if (userCredential.user) {
      await this.storageService.set('userCredentials', { email, password });
      console.log('Credenciales guardadas en almacenamiento local');
    }
  }

  logout() {
    this.storageService.remove('userCredentials');
    return this.afAuth.signOut();
  }

  async checkStoredCredentials(): Promise<any> {
    const savedCredentials = await this.storageService.get('userCredentials');
    return savedCredentials || null;
  }
  
  async isLoggedIn(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    return !!user;
  }
}
