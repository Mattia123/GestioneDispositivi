package com.example.gestionedispositivi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.gestionedispositivi.entity.Dipendenti;

public interface DipendentiRepository extends JpaRepository<Dipendenti, Long> {
	@Query(value="SELECT * FROM dipendenti WHERE cf=?1",nativeQuery = true)
	Dipendenti getByCf(String cf);
}
