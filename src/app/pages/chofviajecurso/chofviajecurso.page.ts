import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ViajeService } from '../../services/viaje.service';

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
    if (!this.userId) {
      console.error('No se puede finalizar el viaje. Usuario no autenticado.');
      return;
    }

    // Crear una alerta para confirmar la finalización del viaje
    const alert = await this.alertController.create({
      header: 'Finalizar Viaje',
      message: '¿Estás seguro de que deseas finalizar el viaje?',
      buttons: [
        {
          text: 'Cancelar', // Botón para cancelar la acción
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Finalización del viaje cancelada.');
          },
        },
        {
          text: 'Finalizar', // Botón para confirmar la finalización
          handler: async () => {
            try {
              const viajeFinalizado = {
                ...this.viaje, // Copiar los datos del viaje actual
                fechaFinalizacion: new Date().toISOString(), // Agregar la fecha de finalización
              };
              await this.viajeService.agregarViajeAlHistorial(this.userId!, viajeFinalizado); // Guardar en el historial
              console.log('Viaje finalizado y guardado en el historial.');

              // Eliminar el viaje activo después de moverlo al historial
              await this.firestore.doc(`viajes/${this.viaje.id}`).delete();
              console.log('Viaje activo eliminado correctamente.');

              this.router.navigate(['/historial']); // Redirigir al historial de viajes
            } catch (error) {
              console.error('Error al finalizar el viaje:', error);

              // Mostrar una alerta en caso de error
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Ocurrió un error al finalizar el viaje. Inténtalo nuevamente.',
                buttons: ['OK'],
              });
              await errorAlert.present();
            }
          },
        },
      ],
    });

    await alert.present(); // Mostrar la alerta al usuario
  }
}
