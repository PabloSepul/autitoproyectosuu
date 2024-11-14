import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showMenu = true;
  private hiddenMenuRoutes: string[] = ['/home', '/recuperar', '/confirmacion', '/restablecer', '/logrado', '/register'];

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !this.hiddenMenuRoutes.includes(event.url);
      }
    });
  }

  ngOnInit() {
    this.afAuth.signOut().then(() => {
      console.log('Sesión previa cerrada. Esperando autenticación del usuario.');

      this.afAuth.authState.subscribe(user => {
        if (user) {
          console.log('Usuario autenticado en app.component:', user.uid);
        } else {
          console.log('Usuario no autenticado, redirigiendo a la página de inicio de sesión');
          this.router.navigate(['/home']); 
        }
      });
    }).catch(error => {
      console.error('Error al cerrar sesión previa:', error);
    });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      console.log('Usuario deslogueado');
      this.router.navigate(['/home']); // Redirige a la página de inicio
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
