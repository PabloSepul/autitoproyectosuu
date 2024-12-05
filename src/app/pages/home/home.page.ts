import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService) {}

    async ionViewWillEnter() {
      try {
        const storedUser = await this.authService.checkStoredCredentials();
        if (storedUser) {
          const isLoggedIn = await this.authService.isLoggedIn();
          if (isLoggedIn) {
            this.router.navigate(['/historial']);
          } else {
            this.authService.logout(); // Elimina credenciales si no hay sesión activa
          }
        }
      } catch (error) {
        console.error('Error al verificar credenciales:', error);
      }
    }
  
    async login() {
      try {
        await this.authService.login(this.email, this.password);
        this.router.navigate(['/historial']);
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error al iniciar sesión:', err.message);
        } else {
          console.error('Error al iniciar sesión:', err);
        }
      }
    }
  }