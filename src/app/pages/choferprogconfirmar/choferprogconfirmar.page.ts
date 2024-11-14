import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../services/viaje.service';

@Component({
  selector: 'app-choferprogconfirmar',
  templateUrl: './choferprogconfirmar.page.html',
  styleUrls: ['./choferprogconfirmar.page.scss'],
})
export class ChoferprogconfirmarPage implements OnInit {
  travelData: any;

  constructor(private viajeService: ViajeService) {}

  ngOnInit() {
    this.viajeService.obtenerViaje().subscribe(data => {
      if (data) {
        this.travelData = data;
        console.log('Datos del viaje en confirmación:', this.travelData);
      } else {
        console.warn('No se encontraron datos de viaje para el usuario actual.');
      }
    });
  }


  
}
