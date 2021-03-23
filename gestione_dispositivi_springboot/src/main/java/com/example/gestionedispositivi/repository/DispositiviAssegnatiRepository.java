package com.example.gestionedispositivi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.gestionedispositivi.entity.DispositiviAssegnati;

public interface DispositiviAssegnatiRepository extends JpaRepository<DispositiviAssegnati, Long> {
	@Query(value="SELECT * FROM gestione_dispositivi.dispositivi_assegnati da JOIN gestione_dispositivi.dispositivi d ON d.id=da.id_dispositivo WHERE da.id_dipendente=?1 AND da.data_fine IS NULL",nativeQuery = true)
	List<DispositiviAssegnati> getDispositiviByDipendenteId(Long iddipendente);
	
	@Query(value="SELECT * FROM gestione_dispositivi.dispositivi_assegnati da JOIN gestione_dispositivi.dispositivi d ON d.id=da.id_dispositivo WHERE da.data_fine IS NULL",nativeQuery = true)
	List<DispositiviAssegnati> getAssegnazioniCorrenti();
}
