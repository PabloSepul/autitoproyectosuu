import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  recuperarForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router  // Inyecta el Router aquí
  ) {
    this.recuperarForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  onSubmit() {
    if (this.recuperarForm.valid) {
      const email = this.recuperarForm.value.email;

      // Llama al servicio para enviar el correo de restablecimiento de contraseña
      this.authService.sendPasswordResetEmail(email)
        .then(() => {
          // Muestra una alerta confirmando el envío del correo
          this.presentAlert(
            'Correo enviado',
            'Hemos enviado un enlace de recuperación de contraseña a tu correo electrónico.'
          );

          // Redirige a la página Home después de enviar el correo
          this.router.navigate(['/home']);
        })
        .catch(error => {
          if (error.code === 'auth/user-not-found') {
            this.presentAlert('Error', 'El correo ingresado no está registrado.');
          } else {
            console.error('Error al enviar el correo de restablecimiento:', error);
            this.presentAlert('Error', 'Ocurrió un problema al intentar enviar el correo. Intente nuevamente.');
          }
        });
    }
  }
}
