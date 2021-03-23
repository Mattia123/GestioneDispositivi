package com.example.gestionedispositivi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.gestionedispositivi.entity.Tipi;

public interface TipiRepository extends JpaRepository<Tipi, Long>{
	@Query(value="SELECT * FROM tipi WHERE descrizione=?1",nativeQuery = true)
	List<Tipi> getByDescrizione(String descrizione);
}
