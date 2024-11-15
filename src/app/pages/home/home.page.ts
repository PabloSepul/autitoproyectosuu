import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router,private alertController: AlertController) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        console.log('Inicio de sesión exitoso');
        this.router.navigate(['/choferben']); 
      })
      .catch(error => {
        console.error('Error en inicio de sesión:', error);
        this.presentAlert('Usuario o contraseña incorrectos.'); 
      });
  }
  

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error de inicio de sesión',
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }
}
