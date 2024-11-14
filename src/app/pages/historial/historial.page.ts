import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  userId: string | undefined;
  historial: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadHistorial();
      } else {
        console.error('Usuario no autenticado');
      }
    });
  }

  loadHistorial() {
    if (this.userId) {
      this.firestore
        .collection(`usuarios/${this.userId}/historial`)
        .valueChanges()
        .subscribe(historial => {
          this.historial = historial;
          console.log('Historial de viajes cargado:', this.historial);
        });
    }
  }
}
