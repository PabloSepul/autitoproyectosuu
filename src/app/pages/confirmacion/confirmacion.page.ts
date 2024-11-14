import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
})
export class ConfirmacionPage {
  codigoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController
  ) {
    this.codigoForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Verificación',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  onConfirmar() {
    if (this.codigoForm.valid) {
      // Aquí debes comparar el código ingresado con el código enviado por correo
      console.log('Código verificado correctamente');
      this.router.navigate(['/restablecer']);
    } else {
      this.presentAlert('Código incorrecto. Intente nuevamente.');
    }
  }
}
