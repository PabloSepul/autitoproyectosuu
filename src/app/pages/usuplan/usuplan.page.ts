import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-usuplan',
  templateUrl: './usuplan.page.html',
  styleUrls: ['./usuplan.page.scss'],
})
export class UsuplanPage implements OnInit {
  viajes: any[] = [];
  userId: string | undefined;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController
  ) {}
  
  ngOnInit() {
    // Verificación de autenticación
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      } else {
        console.warn('Usuario no autenticado. Redirigiendo al inicio de sesión.');
        this.router.navigate(['/home']); // Redirige al inicio de sesión si no está autenticado
      }
    });
  }

  ionViewWillEnter() {
    // Carga los viajes cada vez que el usuario entra a la vista
    this.obtenerViajes();
  }

  obtenerViajes() {
    // Lógica para obtener viajes en curso en tiempo real
    this.firestore.collectionGroup('viajes', ref => ref.where('asientosDisponibles', '>', 0))
      .snapshotChanges()
      .subscribe(snapshot => {
        this.viajes = snapshot.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data() as any
          };
        });
        console.log('Viajes obtenidos:', this.viajes);
      });
  }

  unirseAViaje(viajeId: string, redirigir: boolean = true) {
    if (!this.userId) return;
  
    const viajeRef = this.firestore.collection('usuarios').doc(this.userId).collection('viajes').doc(viajeId);
  
    this.firestore.firestore.runTransaction(async transaction => {
      const viajeDoc = await transaction.get(viajeRef.ref);
  
      if (!viajeDoc.exists) {
        console.error('El viaje no existe');
        return;
      }
  
      const viajeData = viajeDoc.data();
  
      if (viajeData && viajeData['asientosDisponibles'] > 0) {
        const nuevosPasajeros = [...viajeData['pasajeros'], this.userId];
        const asientosDisponiblesActualizados = viajeData['asientosDisponibles'] - 1;
  
        transaction.update(viajeRef.ref, {
          pasajeros: nuevosPasajeros,
          asientosDisponibles: asientosDisponiblesActualizados
        });
  
        console.log('Te has unido al viaje:', viajeId);
      } else {
        console.error('No hay asientos disponibles en este viaje');
      }
    }).then(() => {
      console.log('Transacción de unirse al viaje completada');
      if (redirigir) {
        this.router.navigate(['/chofviajecurso', { viajeId: viajeId }]);
      }
    }).catch(error => {
      console.error('Error al unirse al viaje:', error);
    });
  }
  

  actualizarViajes() {
    this.obtenerViajes();
  }

  actualizarViaje(viajeId: string) {
    this.unirseAViaje(viajeId, false);
  }

  async confirmarUnirseAViaje(viajeId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas unirte a este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Unión al viaje cancelada');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.unirseAViaje(viajeId);
          }
        }
      ]
    });
  
    await alert.present();
  }

}
