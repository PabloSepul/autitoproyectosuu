import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-usuconf',
  templateUrl: './usuconf.page.html',
  styleUrls: ['./usuconf.page.scss'],
})

export class UsuconfPage implements OnInit {
  conductor: any;
  tiempoRestante: string = '10:00';
  intervalo: any;

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {

    this.conductor = {
      nombre: 'Rocio',
      foto: 'assets/img/rocio.png',
      patente: 'ABC123'
    };


    this.iniciarContador(50 * 60); 
  }

  iniciarContador(duracion: number) {
    let segundosRestantes = duracion;

    this.intervalo = setInterval(() => {
      const minutos = Math.floor(segundosRestantes / 60);
      const segundos = segundosRestantes % 60;

      this.tiempoRestante = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

      if (segundosRestantes > 0) {
        segundosRestantes--;
      } else {
        clearInterval(this.intervalo);
        this.tiempoRestante = 'Tiempo agotado';
      }
    }, 1000);
  }

  async confirmarViaje(conductor: string) {
    const successAlert = await this.alertController.create({
      header: 'Confirmado',
      message: `Que tengas un buen viaje`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward('/usuesp');
          }
        }
      ]
    });

    await successAlert.present();
  }
}
