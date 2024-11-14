import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuesp',
  templateUrl: './usuesp.page.html',
  styleUrls: ['./usuesp.page.scss'],
})
export class UsuespPage {

  estimadoLlegada: string;

  constructor(private alertController: AlertController, private router: Router) {
    this.estimadoLlegada = '15:30';
  }

  async confirmarFinViaje() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro de finalizar el viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            this.mensajeLlegada();
          }
        }
      ]
    });

    await alert.present();
  }

  async mensajeLlegada() {
    const alert = await this.alertController.create({
      header: 'Bienvenido a tu destino',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['/historial']);
        }
      }]
    });

    await alert.present();
  }
}
