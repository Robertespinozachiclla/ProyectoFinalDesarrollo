package epiis.unamba.DTO;

public class AuthResponse {

	private String token;
    private String tipo = "Bearer";
    private String username;
    private String rol;
    private String nombre;
    private String email;
    private String telefono;
    private String direccion;

    public AuthResponse() {
    }

    public AuthResponse(String token,
                        String username,
                        String rol) {
        this.token = token;
        this.username = username;
        this.rol = rol;
    }

    public AuthResponse(String token,
                        String username,
                        String rol,
                        String nombre,
                        String email) {
        this.token = token;
        this.username = username;
        this.rol = rol;
        this.nombre = nombre;
        this.email = email;
    }

    public AuthResponse(String token,
                        String username,
                        String rol,
                        String nombre,
                        String email,
                        String telefono,
                        String direccion) {
        this.token = token;
        this.username = username;
        this.rol = rol;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
    }

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
}
