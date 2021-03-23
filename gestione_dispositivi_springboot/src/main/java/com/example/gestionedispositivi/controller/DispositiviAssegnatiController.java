package com.example.gestionedispositivi.controller;

import java.util.List;
import java.util.Optional;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gestionedispositivi.entity.DispositiviAssegnati;
import com.example.gestionedispositivi.repository.DispositiviAssegnatiRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/dispositiviassegnati")
public class DispositiviAssegnatiController {

	@Autowired
	private DispositiviAssegnatiRepository dispositiviAssegnatiRepository;
	
	@GetMapping
	public List<DispositiviAssegnati> getAll(){
		return this.dispositiviAssegnatiRepository.findAll();
	}
	
	@GetMapping("id={id}")
	public Optional<DispositiviAssegnati> getById(@PathVariable(value= "id") Long id) {
		return this.dispositiviAssegnatiRepository.findById(id);
	}
	
	@GetMapping("iddipendente={iddipendente}")
	public List<DispositiviAssegnati> assegnazioniDipendentiDispositivi(@PathVariable(value= "iddipendente") Long iddipendente){
		return this.dispositiviAssegnatiRepository.getDispositiviByDipendenteId(iddipendente);
	}
	
	@GetMapping("assegnazionicorrenti")
	public List<DispositiviAssegnati> assegnazioniCorrenti(){
		return this.dispositiviAssegnatiRepository.getAssegnazioniCorrenti();
	}
	
	@PostMapping
	public DispositiviAssegnati insert(@RequestBody DispositiviAssegnati dispositiviAssegnati) {
		return this.dispositiviAssegnatiRepository.save(dispositiviAssegnati);
	}
	
	@PostMapping("/id={id}")
	public void delete(@PathVariable(value= "id") Long id) {
		this.dispositiviAssegnatiRepository.deleteById(id);
	}
}
