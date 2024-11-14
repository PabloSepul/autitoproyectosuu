import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-chofviajecurso',
  templateUrl: './chofviajecurso.page.html',
  styleUrls: ['./chofviajecurso.page.scss'],
})
export class ChofviajecursoPage implements OnInit {
  userId: string | undefined;
  viaje$: Observable<any> | undefined;
  origen: string = '';
  destino: string = '';
  asientosTotales: number = 0;  // Cambiado de `asientos` a `asientosTotales`
  pasajeros: any[] = [];
  fechaViaje: string | undefined;

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
      this.firestore
        .doc(`usuarios/${this.userId}/viajes/viaje1`)
        .valueChanges()
        .subscribe((viajeData: any) => {
          if (viajeData) {
            this.origen = typeof viajeData['origen'] === 'string' ? viajeData['origen'] : '';
            this.destino = typeof viajeData['destino'] === 'string' ? viajeData['destino'] : '';
            this.asientosTotales = typeof viajeData['asientosDisponibles'] === 'number' ? viajeData['asientosDisponibles'] : 0;  // Cambiado a `asientosDisponibles`
            this.pasajeros = Array.isArray(viajeData['pasajeros']) ? viajeData['pasajeros'] : [];
            this.fechaViaje = typeof viajeData['fecha'] === 'string' ? viajeData['fecha'] : '';
            console.log('Datos del viaje cargados:', this.origen, this.destino, this.asientosTotales, this.pasajeros, this.fechaViaje);
          } else {
            console.warn('No se encontraron datos para el viaje.');
          }
        }, error => {
          console.error('Error al obtener los datos del viaje:', error);
        });
    } else {
      console.warn('Usuario no autenticado o ID no válido.');
    }
  }

  async finalizarViaje() {
    if (this.userId) {
      const alert = await this.alertController.create({
        header: 'Finalizar Viaje',
        message: '¿Estás seguro de que deseas finalizar el viaje?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Finalización del viaje cancelada.');
            }
          },
          {
            text: 'Finalizar',
            handler: () => {
              this.guardarViajeEnHistorial();
            }
          }
        ]
      });

      await alert.present();
    } else {
      console.error('No se pudo finalizar el viaje. Usuario no autenticado.');
    }
  }

  private guardarViajeEnHistorial() {
    if (this.userId) {
      const historialRef = this.firestore.collection(`usuarios/${this.userId}/historial`);
      const fechaActual = new Date().toLocaleString();

      const viajeFinalizado = {
        origen: this.origen,
        destino: this.destino,
        asientosTotales: this.asientosTotales,
        pasajeros: this.pasajeros,
        fecha: fechaActual,
      };

      historialRef.add(viajeFinalizado)
        .then(() => {
          console.log('Viaje guardado en el historial');
          this.router.navigate(['/historial']);
        })
        .catch(error => {
          console.error('Error al guardar el viaje en el historial:', error);
        });
    }
  }
}
