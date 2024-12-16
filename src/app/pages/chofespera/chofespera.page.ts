import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

interface Usuario {
  nombreConductor: string; // Definimos explícitamente la propiedad
}

@Component({
  selector: 'app-chofespera',
  templateUrl: './chofespera.page.html',
  styleUrls: ['./chofespera.page.scss'],
})
export class ChofesperaPage implements OnInit {
  viaje: any = null; // Información del viaje actual
  userId: string | null = null; // ID del usuario autenticado

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.cargarUltimoViaje();
      } else {
        console.error('Usuario no autenticado.');
        this.router.navigate(['/home']);
      }
    });
  }

  /**
   * Cargar el último viaje configurado por el usuario actual.
   */
  cargarUltimoViaje() {
    if (!this.userId) return;

    this.firestore
      .collection('viajes', (ref) =>
        ref.where('creadorId', '==', this.userId).orderBy('fechaCreacion', 'desc').limit(1)
      )
      .valueChanges({ idField: 'id' })
      .subscribe((viajes: any[]) => {
        if (viajes.length > 0) {
          this.viaje = viajes[0];
          console.log('Viaje actual:', this.viaje);
        } else {
          console.warn('No se encontró un viaje activo.');
        }
      });
  }

  /**
   * Finalizar el viaje y obtener los nombres de los pasajeros.
   */
  async finalizarViaje() {
    if (!this.viaje?.id) return;

    const historialData = { ...this.viaje, fechaFinalizacion: new Date().toISOString() };

    // Obtener nombres de los pasajeros desde la colección "usuarios"
    const nombresPasajeros = await Promise.all(
      (this.viaje.pasajeros || []).map(async (pasajeroId: string) => {
        try {
          const pasajeroDoc = await this.firestore.doc(`usuarios/${pasajeroId}`).get().toPromise();
          const pasajeroData = pasajeroDoc?.data() as Usuario | undefined; // Casteo explícito
          return pasajeroData?.nombreConductor || 'No Registrado';
        } catch {
          return 'No Registrado';
        }
      })
    );

    historialData['pasajerosNombres'] = nombresPasajeros;

    // Guardar en el historial del chofer
    this.firestore
      .collection(`usuarios/${this.userId}/historial`)
      .add(historialData)
      .then(() => {
        console.log('Viaje finalizado y guardado en el historial correctamente.');
        this.firestore.doc(`viajes/${this.viaje.id}`).delete(); // Eliminar el viaje activo
        this.router.navigate(['/choferben']);
      })
      .catch((error) => {
        console.error('Error al finalizar el viaje:', error);
        alert('No se pudo finalizar el viaje. Inténtalo nuevamente.');
      });
  }
  /**
 * Confirmar la cancelación del viaje actual.
 */
confirmarCancelacion() {
  if (!this.viaje?.id) {
    console.warn('No se puede cancelar el viaje. No se encontró un ID válido.');
    return;
  }

  if (!this.userId) {
    console.warn('No se puede cancelar el viaje. Usuario no autenticado.');
    return;
  }

  // Confirmación visual al usuario
  if (confirm('¿Estás seguro de que deseas cancelar el viaje?')) {
    this.firestore
      .doc(`viajes/${this.viaje.id}`)
      .delete()
      .then(() => {
        console.log('Viaje cancelado correctamente.');
        this.router.navigate(['/choferben']); // Redirigir al menú principal
      })
      .catch((error) => {
        console.error('Error al cancelar el viaje:', error);
        alert('No se pudo cancelar el viaje. Inténtalo nuevamente.');
      });
  }
}

}
