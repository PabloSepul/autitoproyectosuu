import { Component, OnInit, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ViajeService } from '../../services/viaje.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-choferprogviaje',
  templateUrl: './choferprogviaje.page.html',
  styleUrls: ['./choferprogviaje.page.scss'],
})
export class ChoferprogviajePage implements OnInit, AfterViewInit {
  map: mapboxgl.Map | undefined;
  destination: mapboxgl.LngLat | undefined;
  destinationName: string = '';
  asientos: number = 0;
  precio: number = 0;
  patente: string = '';
  nombreConductor: string = '';
  numeroContacto: string = '';
  readonly startingPoint = new mapboxgl.LngLat(-73.0625728, -36.795331);
  userId: string | undefined;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private viajeService: ViajeService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    (mapboxgl as any).accessToken = environment.mapboxKey;

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.cargarPerfilUsuario();
      } else {
        console.warn('Usuario no autenticado, redirigiendo a inicio.');
        this.router.navigate(['/home']);
      }
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.startingPoint,
      zoom: 13,
    });

    new mapboxgl.Marker({ color: 'blue' })
      .setLngLat(this.startingPoint)
      .addTo(this.map);

    this.map.on('click', (event: mapboxgl.MapMouseEvent & { lngLat: mapboxgl.LngLatLike }) => {
      this.selectDestination(event.lngLat.lng, event.lngLat.lat);
    });
  }

  private selectDestination(lng: number, lat: number) {
    this.destination = new mapboxgl.LngLat(lng, lat);
    new mapboxgl.Marker({ color: 'red', className: 'destination-marker' })
      .setLngLat(this.destination)
      .addTo(this.map as mapboxgl.Map);

    if (this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom: 15,
        essential: true,
      });

      setTimeout(() => {
        this.map?.resize();
      }, 300);
    }

    this.reverseGeocode(lng, lat);
  }

  private reverseGeocode(lng: number, lat: number) {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${environment.mapboxKey}`)
      .then((response) => response.json())
      .then((data) => {
        this.destinationName = data.features[0]?.place_name || 'Destino desconocido';
      })
      .catch((error) => {
        console.error('Error en la geocodificación inversa:', error);
        this.destinationName = 'Error al identificar el destino';
      });
  }

  private cargarPerfilUsuario() {
    if (this.userId) {
      this.firestore
        .doc(`usuarios/${this.userId}/perfil/datos`)
        .valueChanges()
        .subscribe((perfil: any) => {
          if (perfil) {
            this.patente = perfil.patente || '';
            this.nombreConductor = perfil.nombreConductor || '';
            this.numeroContacto = perfil.numeroContacto || '';
          } else {
            console.warn('No hay información de perfil disponible.');
          }
        });
    }
  }

  async programarViaje() {
    if (!this.isFormValid()) {
      alert('Por favor, completa toda la información y selecciona un destino en el mapa.');
      return;
    }
  
    const viajeData = {
      origen: 'Duoc UC - Concepción',
      destino: this.destinationName,
      asientos: this.asientos,
      asientosDisponibles: this.asientos,
      precio: this.precio,
      patente: this.patente,
      nombreConductor: this.nombreConductor,
      numeroContacto: this.numeroContacto,
      pasajeros: [],
      creadorId: this.userId, // Identifica al creador del viaje
      fechaCreacion: new Date().toISOString(), // Campo necesario para ordenar
    };
  
    try {
      await this.firestore.collection('viajes').add(viajeData);
      console.log('Viaje creado exitosamente:', viajeData);
      alert('Viaje creado exitosamente.');
      this.router.navigate(['/choferprogconfirmar']);
    } catch (error) {
      console.error('Error al crear el viaje:', error);
      alert('Error al crear el viaje. Inténtalo nuevamente.');
    }
  }
  

  isFormValid(): boolean {
    const valid =
      this.asientos > 0 &&
      this.patente.trim().length > 0 &&
      this.nombreConductor.trim().length > 0 &&
      this.numeroContacto.trim().length > 0 &&
      this.precio > 0 &&
      this.destinationName.trim().length > 0;
  
    // Imprimir resultado de validación para depuración
    console.log('Formulario válido:', valid);
    return valid;
  }
}
