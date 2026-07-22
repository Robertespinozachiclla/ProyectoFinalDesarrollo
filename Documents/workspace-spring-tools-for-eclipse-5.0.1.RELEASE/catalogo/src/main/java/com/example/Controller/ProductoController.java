package com.example.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Service.ProductoService;
import com.example.model.*;
@RestController
@RequestMapping("/api/Producto")
public class ProductoController {

	@Autowired
    private ProductoService prodService;

    @GetMapping
    public List<Producto> listar() {
        return prodService.listar();
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto producto) {

        return new ResponseEntity<>(
                prodService.guardar(producto),
                HttpStatus.CREATED
        );
    }
}
