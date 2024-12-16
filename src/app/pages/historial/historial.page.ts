import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  historial: any[] = []; // Almacena el historial de viajes del usuario
  userId: string | null = null; // ID del usuario autenticado

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.cargarHistorial();
      } else {
        console.error('Usuario no autenticado.');
      }
    });
  }

  /**
   * Cargar el historial de viajes del usuario actual.
   */
  cargarHistorial() {
    if (!this.userId) {
      console.error('Usuario no autenticado, no se puede cargar el historial.');
      return;
    }

    this.firestore
      .collection(`usuarios/${this.userId}/historial`, (ref) =>
        ref.orderBy('fechaFinalizacion', 'desc')
      )
      .valueChanges()
      .subscribe((historial: any[]) => {
        this.historial = historial;
        console.log('Historial cargado:', this.historial);
      });
  }
}
