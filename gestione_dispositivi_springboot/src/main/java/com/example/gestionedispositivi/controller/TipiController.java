package com.example.gestionedispositivi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gestionedispositivi.entity.Tipi;
import com.example.gestionedispositivi.repository.TipiRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tipi")
public class TipiController {
	@Autowired
	private TipiRepository tipiRepository;
	
	@GetMapping
	public List<Tipi> getAll(){
		return this.tipiRepository.findAll();
	}
	
	@PostMapping
	public Tipi insert(@RequestBody Tipi tipi) {
		return this.tipiRepository.save(tipi);
	}
	
	@GetMapping("/descrizione={descrizione}")
	public List<Tipi> getByDescrizione(@PathVariable (value= "descrizione") String descrizione){
		return this.tipiRepository.getByDescrizione(descrizione);
	}
}
