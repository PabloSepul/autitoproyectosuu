import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

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
    private alertController: AlertController
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
        // Aquí puedes redirigir o hacer otra acción después del registro exitoso
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
