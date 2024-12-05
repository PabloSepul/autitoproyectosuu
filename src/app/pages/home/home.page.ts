import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const isLoggedIn = await this.authService.checkStoredCredentials();
    if (isLoggedIn) {
      this.router.navigate(['/historial']);
    }
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/historial']);
    } catch (error: any) {
      this.showAlert('Error', error.message || 'Ocurrió un error al iniciar sesión');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
