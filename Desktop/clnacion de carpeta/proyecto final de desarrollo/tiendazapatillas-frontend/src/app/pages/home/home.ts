import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  
  marcasColumnas = [
    {
      titulo: 'ADIDAS',
      items: ['TODO ADIDAS', 'adidas Samba', 'adidas Campus', 'adidas Superstar', 'adidas Forum', 'NUEVOS INGRESOS']
    },
    {
      titulo: 'NIKE',
      items: ['TODO NIKE', 'Nike Air Force 1', 'Nike Air Jordan', 'Nike Sb Dunk', 'Nike Air Max', 'NUEVOS INGRESOS']
    },
    {
      titulo: 'PUMA',
      items: ['TODO PUMA', 'Puma Suede', 'Puma Caven', 'Puma Palermo', 'NUEVOS INGRESOS']
    },
    {
      titulo: 'NEW BALANCE',
      items: ['TODO NEW BALANCE', 'New Balance 2000', 'New Balance 1000', 'New Balance 9060', 'NUEVOS INGRESOS']
    }
  ];

  tarjetasMarcas = [
    { nombre: 'ASICS', desc: 'Zapatillas urbanas que combinan diseño técnico con una estética moderna.' },
    { nombre: 'DFY', desc: 'Zapatillas que fusionan tecnología y estilo para expresar tu autenticidad.' },
    { nombre: 'VANS', desc: 'Explora la colección VANS. Modelos icónicos y esencia skate.' },
    { nombre: 'CREP PROTECT', desc: 'Soluciones innovadoras para proteger tus zapatillas en todo momento.' },
    { nombre: 'LIMITLESS', desc: 'Se caracteriza por su estilo vanguardista y diseños llamativos.' },
    { nombre: 'LEVI\'S', desc: 'Conoce la experiencia Levis a través de nuestra nueva línea de productos.' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
