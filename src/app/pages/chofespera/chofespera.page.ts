import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-chofespera',
  templateUrl: './chofespera.page.html',
  styleUrls: ['./chofespera.page.scss'],
})
export class ChofesperaPage implements OnInit {
  userId: string | undefined;
  viaje$: Observable<any> | undefined;
  origen: string = '';
  destino: string = '';
  asientos: number = 0;
  asientosDisponibles: number = 0;
  precio: number = 0;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadViajeData();
      } else {
        console.error('Usuario no autenticado');
      }
    });
  }

  loadViajeData() {
    if (this.userId) {
      this.viaje$ = this.firestore
        .doc(`usuarios/${this.userId}/viajes/viaje1`)
        .valueChanges();

      this.viaje$.subscribe(viajeData => {
        if (viajeData) {
          this.origen = viajeData.origen;
          this.destino = viajeData.destino;
          this.asientos = viajeData.asientos;
          this.asientosDisponibles = viajeData.asientosDisponibles;
          this.precio = viajeData.precio;
        }
      });
    }
  }

  async confirmarCancelacion() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: '¿Estás seguro de que quieres cancelar el viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancelación abortada');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.cancelarViaje(); 
          }
        }
      ]
    });

    await alert.present();
  }

  cancelarViaje() {
    if (this.userId) {
      this.firestore
        .doc(`usuarios/${this.userId}/viajes/viaje1`)
        .delete()
        .then(() => {
          console.log('Viaje cancelado correctamente');
          this.router.navigate(['/choferben']); 
        })
        .catch(error => {
          console.error('Error al cancelar el viaje:', error);
        });
    } else {
      console.error('No se pudo cancelar el viaje. Usuario no autenticado.');
    }
  }
}
