package com.example.gestionedispositivi.controller;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gestionedispositivi.entity.Dispositivi;
import com.example.gestionedispositivi.repository.DispositiviRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/dispositivi")
public class DispositiviController {
	
	@Autowired
	private DispositiviRepository dispositiviRepository;
	
	@GetMapping
	public List<Dispositivi> getAll(){
		return this.dispositiviRepository.findAll();
	}
	@GetMapping("/code={code}")
	public Dispositivi getByCode(@PathVariable(value= "code") String code) {
		return this.dispositiviRepository.getByCode(code);
	}
	@GetMapping("/disponibili")
	public List<Dispositivi> getDisponibili(){	
		return this.dispositiviRepository.getDisponibili();
	}
	
	@PostMapping
	public Dispositivi insert(@RequestBody Dispositivi dispositivi) {
		return this.dispositiviRepository.save(dispositivi);
	}
	
	@PostMapping("/id={id}")
	public void delete(@PathVariable(value= "id") Long id) {
		this.dispositiviRepository.deleteById(id);
	}
	
	@Transactional
	@PostMapping("/iddispdaaggiornare={id}")
	public void updateToNotAvailable(@PathVariable(value="id") long id) {
		this.dispositiviRepository.updateToNonDisponibile(id);
	}
	
}
