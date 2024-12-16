import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ViajeService } from '../../services/viaje.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  userId: string | null = null; // ID del usuario autenticado
  historialViajes: any[] = []; // Lista de viajes en el historial

  constructor(
    private afAuth: AngularFireAuth, // Servicio para manejar autenticación de Firebase
    private viajeService: ViajeService, // Servicio para gestionar viajes
    private router: Router // Servicio para redirigir entre rutas
  ) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación del usuario
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid; // Almacenar el ID del usuario autenticado
        this.loadHistorial(); // Cargar el historial de viajes
      } else {
        console.error('Usuario no autenticado');
        this.router.navigate(['/home']); // Redirigir a la página de inicio si no está autenticado
      }
    });
  }

  /**
   * Cargar el historial de viajes desde Firestore o localStorage.
   */
  loadHistorial() {
    this.viajeService.obtenerHistorial().subscribe((historial) => {
      if (historial && historial.length > 0) {
        this.historialViajes = historial; // Asignar los datos del historial
        console.log('Historial de viajes cargado:', this.historialViajes);
      } else {
        console.warn('No se encontraron viajes en el historial.');
        this.historialViajes = []; // Asegurar que la lista esté vacía si no hay datos
      }
    });
  }

  /**
   * Navegar a los detalles de un viaje seleccionado.
   * @param viaje Datos del viaje seleccionado.
   */
  verDetalles(viaje: any) {
    console.log('Detalles del viaje seleccionado:', viaje);
    // Aquí podrías implementar navegación a una página de detalles o mostrar un modal
  }
}
