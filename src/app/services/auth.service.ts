import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from '../services/storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private storageService: StorageService,
    private firestore: AngularFirestore
  ) {}

  /**
   * Método para iniciar sesión.
   * Guarda las credenciales en localStorage y permite iniciar sesión offline.
   */
  async login(email: string, password: string): Promise<void> {
    // Verificar si hay conexión a internet
    if (!navigator.onLine) {
      const savedCredentials = this.storageService.get('userCredentials');
      if (savedCredentials && savedCredentials.email === email && savedCredentials.password === password) {
        this.isAuthenticated = true;
        localStorage.setItem('userSession', JSON.stringify({ email }));
        console.log('Inicio de sesión offline exitoso');
        return;
      } else {
        throw new Error('No hay conexión a internet y las credenciales no coinciden.');
      }
    }

    // Inicio de sesión online
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (userCredential.user) {
        this.isAuthenticated = true;

        // Guardar credenciales y sesión en localStorage
        await this.storageService.set('userCredentials', { email, password });
        localStorage.setItem('userSession', JSON.stringify({ email }));
        console.log('Inicio de sesión online exitoso');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Error al contactar con el servidor. Verifica tus credenciales.');
    }
  }

  /**
   * Método para cerrar sesión.
   */
  logout(): void {
    this.isAuthenticated = false;
    this.afAuth.signOut();
    console.log('Sesión cerrada y datos eliminados del almacenamiento local.');
  }

  /**
   * Verificar si existen credenciales almacenadas.
   * Retorna true si hay sesión activa o credenciales válidas.
   */
  async checkStoredCredentials(): Promise<boolean> {
    const session = localStorage.getItem('userSession');
    if (session) {
      this.isAuthenticated = true;
      console.log('Sesión activa encontrada en localStorage.');
      return true;
    }

    const savedCredentials = this.storageService.get('userCredentials');
    if (savedCredentials) {
      console.log('Credenciales recuperadas:', savedCredentials);
      this.isAuthenticated = true;
      return true;
    }

    this.isAuthenticated = false;
    return false;
  }

  /**
   * Método para enviar un correo de recuperación de contraseña.
   */
  sendPasswordResetEmail(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  /**
   * Método para registrar un nuevo usuario.
   */
  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(async (userCredential) => {
      if (userCredential.user) {
        // Guardar datos iniciales del usuario en Firestore
        await this.firestore.collection('usuarios').doc(userCredential.user.uid).set({
          email,
          createdAt: new Date().toISOString(),
        });

        // Guardar credenciales en localStorage
        await this.storageService.set('userCredentials', { email, password });
        console.log('Usuario registrado y credenciales almacenadas.');
      }
    });
  }
}
