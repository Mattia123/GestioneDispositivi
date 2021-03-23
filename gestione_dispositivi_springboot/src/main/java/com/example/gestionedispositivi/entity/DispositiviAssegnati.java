package com.example.gestionedispositivi.entity;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="dispositivi_assegnati")
public class DispositiviAssegnati {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@ManyToOne()
	@JoinColumn(name="id_dipendente", insertable = false, updatable = false)
	private Dipendenti dipendente;
	
	@ManyToOne()
	@JoinColumn(name="id_dispositivo", insertable = false, updatable = false)
	private Dispositivi dispositivo;
	
	@Column(name="id_dispositivo")
	private long id_dispositivo;
	
	@Column(name="id_dipendente")
	private long id_dipendente;
	
	@Temporal(TemporalType.DATE)
	@Column(name="data_inizio")
	private Date data_inizio;
	
	@Temporal(TemporalType.DATE)
	@Column(name="data_fine")
	private Date data_fine;
	
	public DispositiviAssegnati() {}
	
	public DispositiviAssegnati(Dipendenti dipendente, Dispositivi dispositivo, long id_dispositivo, long id_dipendente, Date data_inizio, Date data_fine) {
		super();
		this.dipendente=dipendente;
		this.dispositivo=dispositivo;
		this.id_dispositivo=id_dispositivo;
		this.id_dipendente=id_dipendente;
		this.data_inizio=data_inizio;
		this.data_fine=data_fine;
	}

	public Date getData_inizio() {
		return data_inizio;
	}

	public void setData_inizio(Date data_inizio) {
		this.data_inizio = data_inizio;
	}

	public Date getData_fine() {
		return data_fine;
	}

	public void setData_fine(Date data_fine) {
		this.data_fine = data_fine;
	}

	public long getId_dispositivo() {
		return id_dispositivo;
	}

	public void setId_dispositivo(long id_dispositivo) {
		this.id_dispositivo = id_dispositivo;
	}

	public long getId_dipendente() {
		return id_dipendente;
	}

	public void setId_dipendente(long id_dipendente) {
		this.id_dipendente = id_dipendente;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Dipendenti getDipendente() {
		return dipendente;
	}

	public void setDipendente(Dipendenti dipendente) {
		this.dipendente = dipendente;
	}

	public Dispositivi getDispositivo() {
		return dispositivo;
	}

	public void setDispositivo(Dispositivi dispositivo) {
		this.dispositivo = dispositivo;
	}
	
}
