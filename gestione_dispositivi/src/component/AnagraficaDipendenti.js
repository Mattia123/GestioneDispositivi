import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';

//react-grid
import { useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import DispositiviAssegnatiService from "../service/DispositiviAssegnatiService";
import DipendentiService from '../service/DipendentiService';
import DispositiviService from '../service/DispositiviService';

import BackgroundDipendenti from '../immagini/dipendenti.png'
import BackgroundAssegnati from '../immagini/dispositivi-assegnati.jpg'



class AnagraficaDipendenti extends Component{
	constructor(props){
		super(props);
		this.state={
			columnDipendenti:[
				{headerName: "Nome", field:"nome", editable:true},
				{headerName: "Cognome", field:"cognome", editable:true},
				{headerName: "CF", field:"cf", editable:true}
			],
			rowDipendenti:[],

			columnDispositivi:[
				{headerName: "Id Dispositivo", field:"id_dispositivo"},
				{headerName: "Modello", field:"modello"},
				{headerName:"Memoria", field:"memoria"}
			],
			columnDispositiviDisponibili:[
				{headerName: "Modello", field:"modello"},
				{headerName:"Memoria", field:"memoria"}
			],
			rowDataAssegnati:[],
			response:[],
			rowDispositiviDisponibili:[],
			dipendenteSelezionato:{
				nome:"",
				cognome:"",
				id:"",
				cf:""
			},
			rowsToUpdate:[]
		}
	}

	componentDidMount(){
		DipendentiService.getAll().then(
			(response) => {this.setState({rowDipendenti:response.data})}
		)
		DispositiviService.getAvailabale().then(
			(response) => {this.setState({rowDispositiviDisponibili:response.data})}
		)
		
	}

	//il contenuto scritto in un form viene salvato in state 
	handleChange(event) {debugger;
		this.state[event.target.name]= event.target.value.toString();
	}

	//da capire perchè dispositivi assegnati e vuoto finchè non esco dal metodo
	test(){
		try{
			this.state.dipendenteSelezionato=this.gridApi.getSelectedNodes()[0].data;
			const selectedNode=this.state.dipendenteSelezionato;
			DispositiviAssegnatiService.getByDipendenteId(selectedNode.id).then(
			(response) => {this.setState({response:response.data})}
		)}catch(error){}
		this.test2();
		}
		
	test2(){	
		
		var rowDataGenerated=[];
		var data=this.state.response;
		for (var i=0; i<data.length; i++){
			try{
				rowDataGenerated.push({id:data[i].id, id_dipendente: data[i].dipendente.id, data_inizio:data[i].data_inizio, data_fine:data[i].data_fine, id_dispositivo:data[i].dispositivo.id,modello:data[i].dispositivo.modello,memoria:data[i].dispositivo.memoria});
			}catch(error){}
		}
		this.setState({rowDataAssegnati : rowDataGenerated});
	}
	
	saveEditedCells(){
		this.gridApi.refreshView()
		var recordToUpdate=this.state.rowsToUpdate;
		debugger;
		//aggiorno i racord nel che sono stati modificati
		for (var i=0; i<recordToUpdate.length; i++){
			//this.gridApi.getDisplayedRowAtIndex(index) --> recupera i dati del record con index specificato 
			DipendentiService.insert(this.gridApi.getDisplayedRowAtIndex(recordToUpdate[i]).data)
		}
		window.location.reload()
	}

	viewModaleAggiungiDipendente(){
		var modal = document.getElementById("modaleAggiungiDipendente");
        modal.style.display = "block";
	}

	viewModaleAssegnaDispositivo(){
		if (this.state.dipendenteSelezionato.nome!=""){
			var modal = document.getElementById("modaleAssegnaDispositivo");
			modal.style.display = "block";
		}
		else{
			alert("Per poter assegnare un dispositivo devi prima selezionare un dipendente!");
		}
	}

	closeModaleAggiungiDipendente(){
		var modal = document.getElementById("modaleAggiungiDipendente");
		debugger;
        modal.style.display = "none";
	}

	closeModaleAssegnaDispositivo(){
		var modal = document.getElementById("modaleAssegnaDispositivo");
		modal.style.display = "none";
		}

	insertDipendente(){
		var obj={
			nome:this.state.nome,
			cognome:this.state.cognome,
			cf:this.state.cf
		};
		DipendentiService.insert(obj);
		var modal = document.getElementById("modaleAggiungiDipendente");
		modal.style.display = "none";
		window.location.reload();	
	}

	assegna(){
		if(this.state.data_inizio){
			this.insertAssegnazione();
		}else{
			alert("devi prima selezionare una data!")
		}
	}
	insertAssegnazione(){
		debugger;
		var obj={
			id_dipendente:this.state.dipendenteSelezionato.id,
			id_dispositivo:null,
			data_inizio:this.dataGenerator(this.state.data_inizio)
		}
		var dispositiviSelezionati=this.gridApiDisp.getSelectedNodes();
		for (var i=0; i<dispositiviSelezionati.length; i++){
			obj.id_dispositivo=dispositiviSelezionati[i].data.id;
			DispositiviAssegnatiService.insert(obj)
			dispositiviSelezionati[i].data.disponibile='N'
			DispositiviService.insert(dispositiviSelezionati[i].data)
		}
		window.location.reload();
	}

	deleteDipendente(){
		try{
			var dipendentiSelezionati=this.gridApi.getSelectedNodes();
			for (var i=0; i<dipendentiSelezionati.length; i++){
				DipendentiService.delete(dipendentiSelezionati[i].data.id)
			}
			window.location.reload();
		}catch(error){}
	}

	deleteAssegnazione(){
		try{
			var assegnazioniSelezionate=this.gridApiAssegnazioni.getSelectedNodes();
			for (var i=0; i<assegnazioniSelezionate.length; i++){
				debugger;
				assegnazioniSelezionate[i].data.data_fine=new Date();
				DispositiviAssegnatiService.insert(assegnazioniSelezionate[i].data)
				DispositiviService.updateToDisponibile(assegnazioniSelezionate[i].data.id_dispositivo)
			}
			window.location.reload();
		}catch(error){}
	}

	dataGenerator(date){
		//la data arriva nel formato anno mese giorno
		var newDate= date.split(/[\s-,/ ]+/);
		if(newDate[2].length==2)
		return new Date(newDate[0], newDate[1]-1, newDate[2]);
	}
	rowEditHandle(){
		if (!this.state.rowsToUpdate.includes(this.gridApi.getFocusedCell().rowIndex)){
			this.state.rowsToUpdate.push(this.gridApi.getFocusedCell().rowIndex)
		}
	}

	render(){
		return (
			<div className="full">
				<div className="mid">
					<div className="ag-grid-intestazione" style={{backgroundColor:"#7DCDCC"}}>
						<div className="one-third" onClick={this.saveEditedCells.bind(this)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save2-fill" viewBox="0 0 16 16">
								<path d="M8.5 1.5A1.5 1.5 0 0 1 10 0h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h6c-.314.418-.5.937-.5 1.5v6h-2a.5.5 0 0 0-.354.854l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5A.5.5 0 0 0 10.5 7.5h-2v-6z"/>
							</svg>
						</div>
						<div className="one-third">
							Lista dipendenti 
						</div>
						<div className="one-third">
						</div>
					</div>
					<div className="adapt-divsize-to-gridsize-450">
						<div className="ag-theme-alpine" style={{ height: 400, width: '90%' }} onClick={this.test.bind(this)}>
							<AgGridReact 
								columnDefs={this.state.columnDipendenti}
								rowData={this.state.rowDipendenti}
								onGridReady={params=>this.gridApi=params.api}
								rowSelection="multiple"
								editType = 'fullRow'
								
								//events
								onCellEditingStarted = {params => this.rowEditHandle()} >
							</AgGridReact>
						</div>
					</div>
					
					<div className="add" style={{backgroundImage: `url(${BackgroundDipendenti})`}} onClick={this.viewModaleAggiungiDipendente.bind(this)}>
						<div className="add-text">
							Aggiungi Dipendente
						</div>
					</div>

					<div className="add" style={{backgroundColor:"#B3071B", marginTop:"2%"}} onClick={this.deleteDipendente.bind(this)}>
						<div className="add-text">
							Cancella Selezionati 
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
								<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
							</svg>
						</div>
					</div>
					
				</div>

				<div className="mid">
					<div class="ag-grid-intestazione" style={{backgroundColor :"#77CFF3"}}>
						Dispostivi Assegnati a {this.state.dipendenteSelezionato.nome}
					</div>
					<div className="adapt-divsize-to-gridsize-450">
						<div className="ag-theme-alpine" style={{ height: 400, width: '90%' }}>
							<AgGridReact
								columnDefs={this.state.columnDispositivi}
								rowData={this.state.rowDataAssegnati}
								onGridReady={params=>this.gridApiAssegnazioni=params.api}
								rowSelection="multiple">
							</AgGridReact>
						</div>
					</div>
					<div className="add" style={{backgroundImage: `url(${BackgroundAssegnati})`}} onClick={this.viewModaleAssegnaDispositivo.bind(this)}>
						<div className="add-text">
							Assegna Dispositivo
						</div>
					</div>

					<div className="add" style={{backgroundColor:"#B3071B", marginTop:"2%"}} onClick={this.deleteAssegnazione.bind(this)}>
						<div className="add-text">
							Cancella Selezionati 
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
								<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
							</svg>
						</div>
					</div>
				</div>

				<div className="modal" id="modaleAggiungiDipendente">
					<div className="modal-content-insert">
						<div className="modal-insert-header">
							<div className="modal-insert-header-body">
								Aggiungi Dipendente
							</div>
						</div>
						<div className="modal-insert-body">
							<div className="form-row">
								<label className="label-properties label-in-column" name="name">Nome</label>
								<input className="input-properties" type="text" name="nome" value={this.state.name} onChange={this.handleChange.bind(this)}/>
							</div>
							<div className="form-row">
								<label className="label-properties label-in-column" for="cognome">Cognome</label>
								<input className="input-properties" type="text" name="cognome" value={this.state.surname} onChange={this.handleChange.bind(this)} />
							</div>
							<div className="form-row">
								<label className="label-properties label-in-column" for="cf" >C. Fiscale</label>
								<input className="input-properties" type="text" name="cf" value={this.state.cf} onChange={this.handleChange.bind(this)} />
							</div>	
						</div>
						<div className="modal-bottom-button">
							<div className="mid">
								<div className="modal-button" onClick={this.insertDipendente.bind(this)} style={{backgroundColor: "#7DCDCC", border:"2px solid #45C7C5"}}>Inserisci</div>
							</div>
							<div className="mid">
								<div className="modal-button" onClick={this.closeModaleAggiungiDipendente.bind(this)}>Esci</div>
							</div>
						</div>
						<div className="modal-insert-footer">
						</div>
					</div>
				</div>

				<div className="modal" id="modaleAssegnaDispositivo">
					<div className="modal-content-insert">
						<div className="modal-insert-header" style={{backgroundImage: 'url("http://localhost:3000/static/media/dispositivi-assegnati.3c792958.jpg")'}} >
							<div className="modal-insert-header-body">
								Assegna Dispositivo
							</div>
						</div>
						<div className="modal-insert-body" style={{width:"80%"}}>
							<div class="modal-text">
								Seleziona i dispositivi da assegnare a {this.state.dipendenteSelezionato.nome} {this.state.dipendenteSelezionato.cognome}
							
								<div className="ag-theme-alpine" style={{ height: 350, width: '100%' }}>
									<AgGridReact
										columnDefs={this.state.columnDispositiviDisponibili}
										rowData={this.state.rowDispositiviDisponibili}
										onGridReady={params=>this.gridApiDisp=params.api}
										rowSelection="multiple">
									</AgGridReact>
								</div>
							</div>
						</div>
						<div className="modal-bottom-button">
							<div className="full">
								<label for="exampleInputEmail1">Inserisci data di assegnazione</label>
								<input type="date" class="form-control" name="data_inizio" onChange={this.handleChange.bind(this)}/>
							</div>
							<div className="mid">
								<div className="modal-button" style={{backgroundColor: "#77CFF3", border:"2px solid #77CFF3"}} onClick={this.assegna.bind(this)}>Assegna</div>
							</div>
							<div className="mid">
								<div className="modal-button" onClick={this.closeModaleAssegnaDispositivo.bind(this)}>Esci</div>
							</div>
						</div>
						<div className="modal-insert-footer" style={{backgroundColor :"#77CFF3"}}>
						</div>
					</div>
				</div>

			</div>
			
		);
	}
}

export default AnagraficaDipendenti;