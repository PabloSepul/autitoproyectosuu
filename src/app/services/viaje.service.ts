import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storageService: StorageService
  ) {}

  /**
   * Guardar datos de un viaje en Firestore y localStorage.
   * @param userId ID del usuario.
   * @param viajeData Datos del viaje.
   */
  async guardarViaje(userId: string, viajeData: any): Promise<void> {
    try {
      // Guardar en Firestore
      await this.firestore
        .collection('usuarios')
        .doc(userId)
        .collection('viajes')
        .doc('viaje1')
        .set(viajeData);

      // Guardar en localStorage
      await this.storageService.set('viajeActual', viajeData);
      console.log('Datos del viaje guardados exitosamente en Firestore y localStorage.');
    } catch (error) {
      console.error('Error al guardar los datos del viaje:', error);
      throw error;
    }
  }

  /**
   * Obtener datos de un viaje desde Firestore o localStorage.
   * @returns Observable con los datos del viaje.
   */
  obtenerViaje(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const userId = user.uid;
          return this.firestore
            .collection('usuarios')
            .doc(userId)
            .collection('viajes')
            .doc('viaje1')
            .valueChanges()
            .pipe(
              catchError(() => {
                // Si falla la conexión, recuperar de localStorage
                const viajeOffline = this.storageService.get('viajeActual');
                console.warn('Conexión fallida, cargando datos offline:', viajeOffline);
                return of(viajeOffline);
              })
            );
        } else {
          console.warn('No hay usuario autenticado. Retornando datos offline.');
          const viajeOffline = this.storageService.get('viajeActual');
          return of(viajeOffline);
        }
      })
    );
  }

  /**
   * Agregar un viaje al historial en Firestore y localStorage.
   * @param userId ID del usuario.
   * @param viajeFinalizado Datos del viaje finalizado.
   */
  async agregarViajeAlHistorial(userId: string, viajeFinalizado: any): Promise<void> {
    try {
      // Guardar en Firestore
      await this.firestore
        .collection('usuarios')
        .doc(userId)
        .collection('historial')
        .add(viajeFinalizado);

      // Guardar en localStorage
      const historial = this.storageService.get('historialViajes') || [];
      historial.push(viajeFinalizado);
      await this.storageService.set('historialViajes', historial);

      console.log('Viaje agregado al historial exitosamente en Firestore y localStorage.');
    } catch (error) {
      console.error('Error al agregar el viaje al historial:', error);
      throw error;
    }
  }

  /**
   * Obtener el historial de viajes desde Firestore o localStorage.
   * @returns Observable con el historial de viajes.
   */
  obtenerHistorial(): Observable<any[]> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const userId = user.uid;
          return this.firestore
            .collection('usuarios')
            .doc(userId)
            .collection('historial')
            .valueChanges()
            .pipe(
              catchError(() => {
                // Recuperar historial de localStorage si falla la conexión
                const historialOffline = this.storageService.get('historialViajes') || [];
                console.warn('Conexión fallida, cargando historial offline:', historialOffline);
                return of(historialOffline);
              })
            );
        } else {
          console.warn('No hay usuario autenticado. Retornando historial offline.');
          const historialOffline = this.storageService.get('historialViajes') || [];
          return of(historialOffline);
        }
      })
    );
  }
}
