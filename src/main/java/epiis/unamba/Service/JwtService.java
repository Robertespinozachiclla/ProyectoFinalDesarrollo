package epiis.unamba.Service;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import java.util.Date;

import org.springframework.stereotype.Service;

import epiis.unamba.Model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Clave secreta (mínimo 32 caracteres)
    private static final String SECRET_KEY =
            "MiClaveSuperSecretaJWT2026ProyectoZapatos123456";

    // 24 horas
    private static final long EXPIRATION = 1000 * 60 * 60 * 24;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // Generar token
    public String generarToken(Usuario usuario) {

        return Jwts.builder()
                .subject(usuario.getUsername())
                .claim("rol", usuario.getRol().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey())
                .compact();
    }

    // Obtener username
    public String obtenerUsername(String token) {
        return obtenerClaims(token).getSubject();
    }

    // Obtener rol
    public String obtenerRol(String token) {
        return obtenerClaims(token).get("rol", String.class);
    }

    // Validar token
    public boolean validarToken(String token) {
        try {
            obtenerClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Obtener Claims
    private Claims obtenerClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}