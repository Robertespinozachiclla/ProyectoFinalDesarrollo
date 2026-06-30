package epiis.unamba.DTO;

import epiis.unamba.Model.Rol;

public class RegisterRequest {
	private String username;
    private String password;
    private Rol rol;
    

    public RegisterRequest() {
    	
    }


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public Rol getRol() {
		return rol;
	}


	public void setRol(Rol rol) {
		this.rol = rol;
	}
    
    
}
