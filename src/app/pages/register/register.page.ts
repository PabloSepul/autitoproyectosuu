import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
  ) {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  register() {
    this.authService.register(this.email, this.password)
      .then(() => {
        console.log('Registro exitoso');
        this.presentAlert('Registro exitoso', 'Tu cuenta ha sido creada exitosamente.');
        this.router.navigate(['/home']);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          this.presentAlert('Error', 'El correo ya está registrado. Intente iniciar sesión o recupere su contraseña.');
        } else {
          console.error('Error en registro:', error);
          this.presentAlert('Error', 'Ocurrió un error en el registro. Intente nuevamente.');
        }
      });
  }
}
