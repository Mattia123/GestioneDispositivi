package com.example.gestionedispositivi.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="dispositivi")
public class Dispositivi {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@Column(name="modello")
	private String modello;
	
	@Column(name="memoria")
	private int memoria;
	
	@Column(name="disponibile")
	private String disponibile;
	
	@Column(name="code")
	private String code;
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@ManyToOne()
	@JoinColumn(name="id_tipo", insertable = false, updatable = false)
	private Tipi tipo; 
	
	@Column(name="id_tipo")
	private long id_tipo;
	
	
	@OneToMany (targetEntity = DispositiviAssegnati.class, mappedBy = "dispositivo",cascade=CascadeType.ALL, fetch = FetchType.LAZY)
	private List<DispositiviAssegnati> dispositiviAssegnati= new ArrayList<>();
	
	public Dispositivi() {}
	
	public Dispositivi(String modello, int memoria, Tipi tipo, String disponibile, long id_tipo) {
		super();
		this.memoria=memoria;
		this.modello=modello;
		this.tipo=tipo;
		this.disponibile=disponibile;
		this.id_tipo=id_tipo;
	}

	public long getId_tipo() {
		return id_tipo;
	}

	public void setId_tipo(long id_tipo) {
		this.id_tipo = id_tipo;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getModello() {
		return modello;
	}

	public void setModello(String modello) {
		this.modello = modello;
	}

	public int getMemoria() {
		return memoria;
	}

	public void setMemoria(int memoria) {
		this.memoria = memoria;
	}

	public String getDisponibile() {
		return disponibile;
	}

	public void setDisponibile(String disponibile) {
		this.disponibile = disponibile;
	}

	public Tipi getTipo() {
		return tipo;
	}

	public void setTipo(Tipi tipo) {
		this.tipo = tipo;
	}

	
}
