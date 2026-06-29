package epiis.unamba.DTO;

public class AuthResponse {

	private String token;
    private String tipo = "Bearer";
    private String username;
    private String rol;

    public AuthResponse() {
    }

    public AuthResponse(String token,
                        String username,
                        String rol) {

        this.token = token;
        this.username = username;
        this.rol = rol;
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
}
