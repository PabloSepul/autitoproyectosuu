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
      const savedCredentials = this.storageService.get('userCredentials');
      console.log('Credenciales almacenadas:', savedCredentials);

      if (savedCredentials && savedCredentials.email === email && savedCredentials.password === password) {
        this.isAuthenticated = true;
        localStorage.setItem('userSession', JSON.stringify({ email }));
        console.log('Inicio de sesión offline exitoso');
        return;
      } else {
        throw new Error('No hay conexión y las credenciales no coinciden.');
      }
    }

    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (userCredential.user) {
        this.isAuthenticated = true;

        console.log('Guardando credenciales en StorageService...');
        await this.storageService.set('userCredentials', { email, password });

        localStorage.setItem('userSession', JSON.stringify({ email }));
        console.log('Inicio de sesión online exitoso y credenciales guardadas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Error al contactar con el servidor. Verifica tu conexión.');
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.afAuth.signOut();
    console.log('Sesión cerrada y credenciales eliminadas');
  }

  async checkStoredCredentials(): Promise<boolean> {
    const session = localStorage.getItem('userSession');
    if (session) {
      this.isAuthenticated = true;
      console.log('Sesión activa encontrada en localStorage');
      return true;
    }

    const savedCredentials = await this.storageService.get('userCredentials');
    console.log('Credenciales almacenadas recuperadas:', savedCredentials);
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
