import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-choferprogconfirmar',
  templateUrl: './choferprogconfirmar.page.html',
  styleUrls: ['./choferprogconfirmar.page.scss'],
})
export class ChoferprogconfirmarPage implements OnInit {
  viaje: any = null; // Información del viaje configurado
  userId: string | null = null; // ID del usuario autenticado

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.cargarUltimoViaje();
      } else {
        console.error('Usuario no autenticado.');
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
          console.log('Último viaje configurado cargado:', this.viaje);
        } else {
          console.warn('No se encontraron viajes configurados para el usuario actual.');
        }
      });
  }
}
