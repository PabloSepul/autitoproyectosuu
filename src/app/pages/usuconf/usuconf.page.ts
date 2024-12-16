import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-usuconf',
  templateUrl: './usuconf.page.html',
  styleUrls: ['./usuconf.page.scss'],
})
export class UsuconfPage implements OnInit {
  conductor: any = null; // Información del conductor
  tiempoRestante: string = ''; // Hora máxima de llegada
  userId: string | null = null; // ID del usuario autenticado
  llegadaConfirmada: boolean = false; // Estado de confirmación de llegada

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.cargarInformacionConductor();
      } else {
        console.error('Usuario no autenticado.');
      }
    });
  }

  /**
   * Cargar la información del conductor del viaje al que el usuario se unió.
   */
  cargarInformacionConductor() {
    if (!this.userId) {
      console.error('Usuario no autenticado, no se puede cargar el conductor.');
      return;
    }

    this.firestore
      .collection('viajes', (ref) =>
        ref.where('pasajeros', 'array-contains', this.userId)
      )
      .valueChanges({ idField: 'id' })
      .subscribe((viajes: any[]) => {
        if (viajes.length > 0) {
          const viaje = viajes[0]; // Asumimos que el usuario está en un único viaje
          this.conductor = {
            nombreConductor: viaje.nombreConductor,
            patente: viaje.patente,
            numeroContacto: viaje.numeroContacto,
            foto: viaje.foto || null, // Aseguramos que foto sea opcional
          };

          // Simulamos un tiempo de llegada
          this.tiempoRestante = '15 minutos';
          console.log('Conductor cargado:', this.conductor);
        } else {
          console.warn('No se encontraron viajes para este usuario.');
        }
      });
  }

  /**
   * Confirmar llegada al conductor.
   */
  confirmarLlegada() {
    this.llegadaConfirmada = true; // Cambiar el estado para deshabilitar el botón
    alert('Has confirmado tu llegada al conductor.');
    console.log('Llegada confirmada para el conductor:', this.conductor);
  }
}
