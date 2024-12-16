import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  /**
   * Guardar un valor en localStorage.
   * @param key Clave para almacenar el valor.
   * @param value Valor a almacenar.
   */
  async set(key: string, value: any): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve();
    });
  }

  /**
   * Recuperar un valor desde localStorage.
   * @param key Clave del valor a recuperar.
   * @returns Valor almacenado o null si no existe.
   */
  get(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Eliminar un valor de localStorage.
   * @param key Clave del valor a eliminar.
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Limpiar todo el almacenamiento local.
   */
  clear(): void {
    localStorage.clear();
  }
}
