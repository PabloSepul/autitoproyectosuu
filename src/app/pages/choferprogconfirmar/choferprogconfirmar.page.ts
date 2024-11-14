import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../services/viaje.service';

@Component({
  selector: 'app-choferprogconfirmar',
  templateUrl: './choferprogconfirmar.page.html',
  styleUrls: ['./choferprogconfirmar.page.scss'],
})
export class ChoferprogconfirmarPage implements OnInit {
  travelData: any; // Declaramos travelData para almacenar los datos del viaje

  constructor(private viajeService: ViajeService) {}

  ngOnInit() {
    // Obtenemos los datos del viaje del servicio y los asignamos a travelData
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
