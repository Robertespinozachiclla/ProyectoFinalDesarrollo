package epiis.unamba.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.Model.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    boolean existsByUsername(String username);

}
