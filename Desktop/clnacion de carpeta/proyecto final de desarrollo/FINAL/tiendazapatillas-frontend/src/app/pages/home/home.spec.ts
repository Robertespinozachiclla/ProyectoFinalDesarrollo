import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HomeComponent } from './home';
import { ProductoService } from '../../services/producto';
import { CategoriaService } from '../../services/categoria';
import { CarritoService } from '../../services/carrito';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: ProductoService,
          useValue: {
            getProductos: () => of([{ id: 1, nombre: 'Air Max', precio: 200, stock: 10 }]),
            getMarcas: () => of(['Nike']),
            getProductosPorGenero: () => of([]),
            getProductosPorMarca: () => of([]),
            getOfertas: () => of([])
          }
        },
        {
          provide: CategoriaService,
          useValue: {
            getCategorias: () => of([])
          }
        },
        {
          provide: CarritoService,
          useValue: {
            items$: of([]),
            agregarProducto: () => {},
            obtenerCantidadTotal: () => 0,
            obtenerTotal: () => 0,
            procesarCompra: () => Promise.resolve({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open detail modal when selecting a product', () => {
    const product = { id: 1, nombre: 'Air Max', precio: 200, stock: 10 };

    component.abrirDetalle(product as any);

    expect(component.productoSeleccionado).toEqual(product);
  });
});
