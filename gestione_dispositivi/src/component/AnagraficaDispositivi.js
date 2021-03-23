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
import TipiService from '../service/TipiService'

class AnagraficaDispositivi extends Component{

	constructor(props){
		super(props);
		this.state={
			dispositiviColumnDef:[
				{headerName: "Id", field:"id"},
				{headerName: "Tipo", field:"descrizioneTipo"},
				{headerName: "Modello", field:"modello"}
			],
			dispotiviDisponibiliRowData:[],
			dispotiviTotaliRowData:[],
			dispositiviRowData:[],
			tipi:[],
			tipo:5,
			modello:null,
			memoria:null,
			codice:null
		}
	}

	componentDidMount(){
		DispositiviService.getAll().then(
			(response) => {this.setState({dispositiviRowData:response.data})}
		);
		DispositiviService.getAll().then(
			(response) => {this.setState({dispotiviTotaliRowData:response.data})}
		);
		DispositiviService.getAvailabale().then(
			(response) => {this.setState({dispotiviDisponibiliRowData:response.data})}
		);
		TipiService.getAll().then(
			(response) => {this.setState({tipi:response.data})}
		);
	}

	insertDispositivo(){
		var obj={
			id_tipo:this.state.tipo,
			modello:this.state.modello,
			memoria:this.state.memoria,
			code:this.state.codice,
			disponibile:"Y"
		}
		DispositiviService.insert(obj);
		window.location.reload();
	}

	handleChange(event) {debugger;
		this.state[event.target.name]= event.target.value.toString();
	}
	/*
	dispositiviRowDataMaker(){
		debugger;
		for (var i=0; i<this.state.dispositiviRowData.length; i++){
			this.state.dispositiviRowData[i]["descrizioneTipo"]=this.state.dispositiviRowData[i].tipo.descrizione;
		}
		return this.state.dispositiviRowData;
	}*/
	loadRowData(dispositivi){
		for (var i=0; i<dispositivi.length; i++){
			dispositivi[i]["descrizioneTipo"]=dispositivi[i].tipo.descrizione;
		}
		return dispositivi;
	}
	dispositiviRowDataMaker(dispositivi){
		debugger;
		for (var i=0; i<dispositivi.length; i++){
			dispositivi[i]["descrizioneTipo"]=dispositivi[i].tipo.descrizione;
		}
		this.gridApi.setRowData(dispositivi);
	}

	viewModaleInserisciDispositivo(){
		var modal = document.getElementById("modaleNuovoDispositivo");
		modal.style.display = "block";
	}
	closeModaleInserisciDispositivo(){
		var modal = document.getElementById("modaleNuovoDispositivo");
		modal.style.display = "none";
	}

	prova(){
		try{
			var dispositiviSelezionati=this.gridApi.getSelectedNodes();
			for (var i=0; i<dispositiviSelezionati.length; i++){
				DispositiviService.delete(dispositiviSelezionati[i].data.id)
			}
			window.location.reload();
		}catch(error){}
	}
	render(){
		return(
			<div className="full">
				<div className="mid" style={{float:"none"}}>
					<div className="ag-grid-intestazione" style={{backgroundColor:"#F08C2A", height:"auto"}}>
						<div className="large">
							<p>Lista dispositivi</p>
						</div>
						<div className="radio-button-in-title">
							<div className="test">
								<div class="form-check form-check-inline">
									<label class="form-check-label" for="inlineRadio1" style={{marginRight:"10px"}}>Disponibili </label>
									<input class="form-check-input" type="radio" name="filtraDispositivi"  onClick={() => this.dispositiviRowDataMaker(this.state.dispotiviDisponibiliRowData)} />
								</div>
								<div class="form-check form-check-inline">
									<label class="form-check-label" for="inlineRadio2" style={{marginRight:"10px"}}>Tutti </label>
									<input class="form-check-input" type="radio" name="filtraDispositivi"  onClick={() => this.dispositiviRowDataMaker(this.state.dispotiviTotaliRowData)} />
								</div>
							</div>
						</div>				
					</div>
					<div className="adapt-divsize-to-gridsize-450">
						
						<div className="ag-theme-alpine" style={{ height: 400, width: '90%' }}>
							<AgGridReact 
								columnDefs={this.state.dispositiviColumnDef}
								rowData={this.loadRowData(this.state.dispositiviRowData)}
								onGridReady={params=>this.gridApi=params.api}
								rowSelection="multiple">
							</AgGridReact>
						</div>
					</div>
					
					<div className="add" style={{backgroundImage: 'url("http://localhost:3000/static/media/dispositivi2.feb58b35.jpg")'}} onClick={this.viewModaleInserisciDispositivo.bind(this)}>
						<div className="add-text">
							Aggiungi Dispositivo
						</div>
					</div>
					<div className="add" style={{backgroundColor:"#B3071B", marginTop:"2%"}} onClick={this.prova.bind(this)}>
						<div className="add-text">
							Cancella Selezionati 
							<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
								<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
							</svg>
						</div>
					</div>
					
				</div>

				<div className="modal" id="modaleNuovoDispositivo">
					<div className="modal-content-insert">
						<div className="modal-insert-header" style={{backgroundImage: 'url("http://localhost:3000/static/media/dispositivi2.feb58b35.jpg")'}} >
							<div className="modal-insert-header-body">
								Inserisci dispositivo
							</div>
						</div>
						<div className="modal-insert-body" style={{width:"80%"}}>
							<div className="form-row">
								<label className="label-properties label-in-column" for="Tipo">Tipo</label>
								<select className="form-select form-select-sm" aria-label=".form-select-sm example" name="tipo" style={{width: "70%", borderRadius: "5px"}} onChange={this.handleChange.bind(this)}>
									{
										this.state.tipi.map(
										tipo => 
										<option value={tipo.id}>{tipo.descrizione}</option>
										)
									}
								</select>
							</div>
							<div className="form-row">
								<label className="label-properties label-in-column" for="Modello">Modello</label>
								<input className="input-properties" type="text" name="modello" value={this.state.surname} onChange={this.handleChange.bind(this)} />
							</div>
							<div className="form-row">
								<label className="label-properties label-in-column" for="Memoria" >Memoria</label>
								<input className="input-properties" type="number" name="memoria" value={this.state.cf} onChange={this.handleChange.bind(this)} />
							</div>
							<div className="form-row">
								<label className="label-properties label-in-column" for="Codice" >Codice</label>
								<input className="input-properties" type="number" name="codice" value={this.state.codice} onChange={this.handleChange.bind(this)} />
							</div>	
						</div>
						<div className="modal-bottom-button">
							<div className="mid">
								<div className="modal-button" style={{backgroundColor: "#F08C2A", border:"2px solid #EE8420"}} onClick={this.insertDispositivo.bind(this)}>Inserisci</div>
							</div>
							<div className="mid">
								<div className="modal-button" onClick={this.closeModaleInserisciDispositivo.bind(this)}>Esci</div>
							</div>
						</div>
						<div className="modal-insert-footer" style={{backgroundColor :"#F08C2A"}}>
						</div>
					</div>
				</div>

			</div>
		);
	}
}

export default AnagraficaDispositivi;