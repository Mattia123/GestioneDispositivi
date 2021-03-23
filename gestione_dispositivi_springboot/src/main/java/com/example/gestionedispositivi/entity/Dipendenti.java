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
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="dipendenti")
public class Dipendenti {
	@Id
	@GeneratedValue(strategy =GenerationType.AUTO)
	private long id;
	
	@Column(name="nome")
	private String nome;
	
	@Column(name="cognome")
	private String cognome;
	
	@Column(name="cf")
	private String cf;
	
	@OneToMany (targetEntity = DispositiviAssegnati.class, mappedBy = "dipendente",cascade=CascadeType.ALL, fetch = FetchType.LAZY)
	private List<DispositiviAssegnati> dispositiviAssegnati= new ArrayList<>();
	
	public Dipendenti() {}
	
	public Dipendenti(String nome, String cognome, String cf) {
		this.nome=nome;
		this.cognome=cognome;
		this.cf=cf;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getCognome() {
		return cognome;
	}

	public void setCognome(String cognome) {
		this.cognome = cognome;
	}

	public String getCf() {
		return cf;
	}

	public void setCf(String cf) {
		this.cf = cf;
	}

	
}
