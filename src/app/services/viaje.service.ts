// viaje.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  /**
   * Método para guardar los datos del viaje para un usuario específico en Firestore.
   * @param userId - ID del usuario autenticado.
   * @param viajeData - Objeto con los datos del viaje (origen, destino, asientos, etc.).
   * @returns Promise<void> - Promesa que se resuelve al completar la operación en Firestore.
   */
  async guardarViaje(userId: string, viajeData: any): Promise<void> {
    try {
      await this.firestore.collection('usuarios').doc(userId).collection('viajes').doc('viaje1').set(viajeData);
      console.log('Datos del viaje guardados exitosamente en Firestore.');
    } catch (error) {
      console.error('Error al guardar los datos del viaje:', error);
      throw error;  // Propaga el error para manejo externo
    }
  }

  /**
   * Método para recuperar los datos del viaje del usuario actual.
   * @returns Observable<any> - Observable con los datos del viaje o `null` si no hay usuario autenticado.
   */
  obtenerViaje(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          return this.firestore.collection('usuarios').doc(userId).collection('viajes').doc('viaje1').valueChanges();
        } else {
          console.warn('No hay usuario autenticado. Retornando null.');
          return of(null);
        }
      })
    );
  }

  /**
   * Método para agregar un viaje finalizado al historial del usuario.
   * @param userId - ID del usuario autenticado.
   * @param viajeFinalizado - Objeto con los datos del viaje para el historial.
   * @returns Promise<void> - Promesa que se resuelve cuando se agrega el viaje al historial.
   */
  async agregarViajeAlHistorial(userId: string, viajeFinalizado: any): Promise<void> {
    try {
      await this.firestore.collection('usuarios').doc(userId).collection('historial').add(viajeFinalizado);
      console.log('Viaje agregado al historial exitosamente.');
    } catch (error) {
      console.error('Error al agregar el viaje al historial:', error);
      throw error;
    }
  }
}
