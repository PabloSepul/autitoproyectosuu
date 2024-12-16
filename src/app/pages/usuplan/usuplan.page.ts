import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuplan',
  templateUrl: './usuplan.page.html',
  styleUrls: ['./usuplan.page.scss'],
})
export class UsuplanPage implements OnInit {
  viajes: any[] = []; // Lista de viajes disponibles
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
        this.actualizarViajes();
      } else {
        console.error('Usuario no autenticado.');
        this.router.navigate(['/home']);
      }
    });
  }

  /**
   * Actualizar la lista de viajes disponibles desde Firestore.
   */
  actualizarViajes() {
    this.firestore
      .collection('viajes', (ref) => ref.where('asientosDisponibles', '>', 0))
      .valueChanges({ idField: 'id' })
      .subscribe(
        (viajes: any[]) => {
          console.log('Viajes obtenidos de Firestore:', viajes); // Depuración
          this.viajes = viajes || [];
          if (this.viajes.length === 0) {
            console.warn('No se encontraron viajes disponibles.');
          }
        },
        (error) => {
          console.error('Error al cargar los viajes:', error);
        }
      );
  }
  

  /**
   * Confirmar si el usuario desea unirse a un viaje.
   * @param viajeId ID del viaje seleccionado.
   */
  async confirmarUnirseAViaje(viajeId: string) {
    if (!this.userId) {
      console.error('Error: Usuario no autenticado.');
      alert('Debes iniciar sesión para unirte a un viaje.');
      return;
    }
  
    try {
      const viajeRef = this.firestore.doc(`viajes/${viajeId}`);
      const viajeSnap = await viajeRef.get().toPromise();
  
      if (!viajeSnap?.exists) {
        alert('El viaje ya no está disponible.');
        return;
      }
  
      const viaje = viajeSnap.data() as any;
      if (viaje.asientosDisponibles <= 0) {
        alert('No hay asientos disponibles para este viaje.');
        return;
      }
  
      // Actualizar el viaje en Firestore
      viaje.asientosDisponibles -= 1;
      viaje.pasajeros.push(this.userId);
  
      await viajeRef.update({
        asientosDisponibles: viaje.asientosDisponibles,
        pasajeros: viaje.pasajeros,
      });
  
      console.log('Te has unido al viaje exitosamente:', viaje);
      alert('Te has unido al viaje exitosamente.');
  
      // Redirigir a la página de confirmación
      this.router.navigate(['/usuconf']);
    } catch (error) {
      console.error('Error al unirse al viaje:', error);
      alert('Hubo un problema al unirse al viaje. Inténtalo de nuevo.');
    }
  }
  
}
