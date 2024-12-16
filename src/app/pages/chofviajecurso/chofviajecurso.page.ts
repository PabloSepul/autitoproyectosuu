import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ViajeService } from '../../services/viaje.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-chofviajecurso',
  templateUrl: './chofviajecurso.page.html',
  styleUrls: ['./chofviajecurso.page.scss'],
})
export class ChofviajecursoPage implements OnInit {
  userId: string | null = null; // Almacena el ID del usuario autenticado
  viaje: any = {}; // Objeto para guardar los datos del viaje en curso
  pasajeros: any[] = []; // Lista de pasajeros que se unieron al viaje

  constructor(
    private firestore: AngularFirestore, // Servicio para interactuar con Firestore
    private afAuth: AngularFireAuth, // Servicio para manejar autenticación de Firebase
    private router: Router, // Servicio para redirigir entre rutas
    private alertController: AlertController, // Controlador para mostrar alertas
    private viajeService: ViajeService // Servicio personalizado para gestionar viajes
  ) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación del usuario
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid; // Obtener el ID del usuario autenticado
        this.loadUltimoViaje(); // Cargar los datos del último viaje en curso
      } else {
        console.error('Usuario no autenticado');
        this.router.navigate(['/home']); // Redirigir al usuario a la página de inicio si no está autenticado
      }
    });
  }

  /**
   * Cargar el último viaje activo del conductor desde Firestore.
   */
  loadUltimoViaje() {
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
          this.viaje = viajes[0]; // Obtenemos el último viaje activo del conductor
          this.pasajeros = this.viaje.pasajeros || []; // Cargamos la lista de pasajeros
          console.log('Viaje en curso cargado:', this.viaje);
        } else {
          console.warn('No se encontraron viajes activos para el usuario actual.');
        }
      });
  }

  /**
   * Finalizar el viaje actual y guardarlo en el historial.
   */
  async finalizarViaje() {
    if (!this.viaje?.id) {
      console.warn('No se encontró un ID válido para finalizar el viaje.');
      return;
    }
  
    const historialData = { ...this.viaje, fechaFinalizacion: new Date().toISOString() };
  
    try {
      // Obtener nombres de los pasajeros desde la subcolección 'perfil/datos'
      const nombresPasajeros: string[] = await Promise.all(
        (this.viaje.pasajeros || []).map(async (pasajeroId: string) => {
          try {
            console.log('Pasajero ID:', pasajeroId);
            const pasajeroRef = this.firestore
              .doc(`usuarios/${pasajeroId}/perfil/datos`) // Acceder a la ruta específica
              .get();
            const pasajeroSnapshot = await lastValueFrom(pasajeroRef);
  
            if (pasajeroSnapshot.exists) {
              const pasajeroData = pasajeroSnapshot.data() as { nombreConductor?: string };
              console.log('Pasajero Data:', pasajeroData);
              return pasajeroData?.nombreConductor || 'No Registrado';
            } else {
              console.log(`No se encontró el documento del pasajero ${pasajeroId}`);
              return 'No Registrado';
            }
          } catch (error) {
            console.error(`Error al obtener datos del pasajero ${pasajeroId}:`, error);
            return 'No Registrado';
          }
        })
      );
  
      // Agregar los nombres al historial
      historialData.nombresPasajeros = nombresPasajeros;
  
      // Guardar en el historial del conductor
      await this.firestore.collection(`usuarios/${this.userId}/historial`).add(historialData);
  
      console.log('Viaje finalizado y guardado en el historial correctamente.');
  
      // Eliminar el viaje activo
      await this.firestore.doc(`viajes/${this.viaje.id}`).delete();
      console.log('Viaje activo eliminado correctamente.');
  
      this.router.navigate(['/choferben']);
    } catch (error) {
      console.error('Error al finalizar el viaje:', error);
      alert('Hubo un problema al finalizar el viaje. Inténtalo nuevamente.');
    }
  }
}
