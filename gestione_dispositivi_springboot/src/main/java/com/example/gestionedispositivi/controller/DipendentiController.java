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

import com.example.gestionedispositivi.entity.Dipendenti;
import com.example.gestionedispositivi.repository.DipendentiRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/dipendenti")
public class DipendentiController {

	@Autowired
	private DipendentiRepository dipendetiRepository;

	@GetMapping
	public List<Dipendenti> getAll() {
		return this.dipendetiRepository.findAll();
	}
	
	@GetMapping("/cf={cf}")
	public Dipendenti getByCf(@PathVariable(value="cf") String cf) {
		return this.dipendetiRepository.getByCf(cf);
	}
	
	@PostMapping
	public Dipendenti insert(@RequestBody Dipendenti dipendente) {
		return this.dipendetiRepository.save(dipendente);
	}
	
	@PostMapping("/id={id}")
	public void delete(@PathVariable(value= "id") Long id) {
		this.dipendetiRepository.deleteById(id);
	}
}
