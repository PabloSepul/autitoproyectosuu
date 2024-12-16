import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chofespera',
  templateUrl: './chofespera.page.html',
  styleUrls: ['./chofespera.page.scss'],
})
export class ChofesperaPage implements OnInit {
  viaje: any = null; // Información del viaje
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
    if (!this.userId) {
      console.error('Usuario no autenticado, no se puede cargar el viaje.');
      return;
    }

    this.firestore
      .collection('viajes', (ref) =>
        ref.where('creadorId', '==', this.userId).orderBy('fechaCreacion', 'desc').limit(1)
      )
      .valueChanges({ idField: 'id' })
      .subscribe((viajes: any[]) => {
        if (viajes.length > 0) {
          this.viaje = viajes[0]; // Obtenemos el último viaje configurado
          console.log('Último viaje configurado cargado para chofespera:', this.viaje);
        } else {
          console.warn('No se encontraron datos de viaje para el usuario actual.');
        }
      });
  }

  /**
   * Finalizar el viaje actual y guardar los nombres de los pasajeros en el historial.
   */
  finalizarViaje() {
    if (!this.viaje?.id) {
      console.warn('No se encontró un ID válido para finalizar el viaje.');
      return;
    }

    const historialData = { ...this.viaje, fechaFinalizacion: new Date().toISOString() }; // Copiar datos del viaje

    // Obtener nombres de los pasajeros desde la colección "usuarios"
    const obtenerNombresPasajeros = async () => {
      const pasajerosConNombres = await Promise.all(
        (this.viaje.pasajeros || []).map(async (pasajeroId: string) => {
          try {
            // Buscar en la colección "usuarios" el ID del pasajero
            const pasajeroDoc = await this.firestore.doc(`usuarios/${pasajeroId}`).get().toPromise();
            const pasajeroData = pasajeroDoc?.data() as { nombreConductor?: string }; // Tipar explícitamente
            return pasajeroData?.nombreConductor || 'No Registrado'; // Extraer el nombre o usar "No Registrado"
          } catch (error) {
            console.error(`Error al obtener datos del pasajero ${pasajeroId}:`, error);
            return 'No Registrado';
          }
        })
      );
      return pasajerosConNombres;
    };

    obtenerNombresPasajeros().then((nombresPasajeros) => {
      historialData.pasajerosNombres = nombresPasajeros; // Agregar nombres de pasajeros al historial

      this.firestore
        .collection(`usuarios/${this.userId}/historial`) // Guardar en el historial del usuario
        .add(historialData)
        .then(() => {
          console.log('Viaje guardado en el historial correctamente con nombres de pasajeros.');

          // Eliminar el viaje activo
          return this.firestore.doc(`viajes/${this.viaje.id}`).delete();
        })
        .then(() => {
          console.log('Viaje activo eliminado correctamente.');
          this.router.navigate(['/choferben']); // Redirigir al menú principal
        })
        .catch((error) => {
          console.error('Error al finalizar el viaje:', error);
          alert('Hubo un problema al finalizar el viaje. Inténtalo nuevamente.');
        });
    });
  }
  confirmarCancelacion() {
    if (!this.viaje?.id) {
      console.warn('No se encontró un ID válido para cancelar el viaje.');
      return;
    }

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
