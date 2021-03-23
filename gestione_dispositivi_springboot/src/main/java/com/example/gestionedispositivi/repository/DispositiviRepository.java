package com.example.gestionedispositivi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.gestionedispositivi.entity.Dispositivi;

public interface DispositiviRepository extends JpaRepository<Dispositivi, Long>{
	@Query(value="SELECT * FROM dispositivi WHERE disponibile='Y'",nativeQuery = true)
	List<Dispositivi> getDisponibili();
	
	@Query(value="SELECT * FROM dispositivi WHERE code=?1",nativeQuery = true)
	Dispositivi getByCode(String id);
	
	@Modifying
	@Query(value = "UPDATE dispositivi  SET disponibile='Y' WHERE id = ?1", nativeQuery = true)
	 void updateToNonDisponibile(long id);
}
