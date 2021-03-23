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
@Table(name="tipi")
public class Tipi {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@Column(name="descrizione")
	private String descrizione;
	
	@OneToMany (targetEntity = Dispositivi.class, mappedBy = "tipo",cascade=CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Dispositivi> dispositivi= new ArrayList<>();
	
	public Tipi() {}
	
	public Tipi(String descrizione) {
		super();
		this.descrizione=descrizione;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	
}
