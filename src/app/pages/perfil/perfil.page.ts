import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userId: string | undefined;
  nombreConductor: string = '';
  patente: string = '';
  numeroContacto: string = '';
  editMode = { nombre: false, patente: false, contacto: false };

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.cargarPerfil();
      } else {
        console.error('Usuario no autenticado');
      }
    });
  }

  private cargarPerfil() {
    if (this.userId) {
      this.firestore.doc(`usuarios/${this.userId}/perfil/datos`).valueChanges().subscribe(async (perfil: any) => {
        if (perfil) {
          this.nombreConductor = perfil.nombreConductor || '';
          this.patente = perfil.patente || '';
          this.numeroContacto = perfil.numeroContacto || '';
          this.editMode = { nombre: false, patente: false, contacto: false };

          await this.storageService.set('userProfile', perfil);
        } else {
          console.log('No hay información de perfil disponible');
        }
      });
    }
  }

  activarEdicion(campo: 'nombre' | 'patente' | 'contacto') {
    this.editMode[campo] = true;
  }

  async guardarPerfil() {
    if (!this.userId) {
      console.error('No se pudo guardar el perfil. Usuario no autenticado.');
      return;
    }

    const perfilData = {
      nombreConductor: this.nombreConductor,
      patente: this.patente,
      numeroContacto: this.numeroContacto,
    };

    try {
      await this.firestore
        .collection('usuarios')
        .doc(this.userId)
        .collection('perfil')
        .doc('datos')
        .set(perfilData, { merge: true });
      this.mostrarAlerta(
        'Perfil Actualizado',
        'La información del perfil se ha guardado correctamente.'
      );
      this.editMode = { nombre: false, patente: false, contacto: false };
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      this.mostrarAlerta(
        'Error',
        'No se pudo guardar la información del perfil. Inténtalo de nuevo.'
      );
    }
  }

  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
