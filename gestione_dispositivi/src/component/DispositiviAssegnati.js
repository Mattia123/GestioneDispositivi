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

import Background from '../immagini/dispositivi-assegnati.jpg';
import reactDomProductionMin from "react-dom/cjs/react-dom.production.min";

class DispositiviAssegnati extends Component{

	constructor(props){
		super(props);
		
		this.state={
			dispositiviAssegnatiColumnDef:[
				{headerName: "Nome", field:"nome"},
				{headerName: "Cognome", field:"cognome"},
				{headerName: "Tipo", field:"tipo"},
				{headerName: "Modello", field:"modello"},
				{headerName: "Memoria", field:"memoria"},
				{headerName: "Data Inizio", field:"data_inizio"},
				{headerName: "Data Fine", field:"data_fine"}
			],
			rowData:[],
			dispositiviAssegnatiTotRowData:[],
			dispositiviAssegnatiAttiviRowData:[],
			dispositiviAssegnatiTerminatiRowData:[],
			background:"immagini/dispositivi-assegnati.jpg",
			response:null,
			file:null,
		}
	}

	componentDidMount(){
		DispositiviAssegnatiService.getAll().then(
			(response) => {this.setState({dispositiviAssegnatiTotRowData:response.data})}
		);
		DispositiviAssegnatiService.getAssegnazioniAttive().then(
			(response) => {this.setState({dispositiviAssegnatiAttiviRowData:response.data})}
		);
	}

	rowDataMaker(assegnazioniRowData){
		var rowData=[];
		var row;
		for (var i=0; i<assegnazioniRowData.length; i++){
			row={nome:assegnazioniRowData[i].dipendente.nome, 
				cognome:assegnazioniRowData[i].dipendente.cognome, 
				tipo:assegnazioniRowData[i].dispositivo.tipo.descrizione, 
				modello:assegnazioniRowData[i].dispositivo.modello,
				memoria:assegnazioniRowData[i].dispositivo.memoria,
				data_inizio:assegnazioniRowData[i].data_inizio,
				data_fine:assegnazioniRowData[i].data_fine,
				id_dipendente:assegnazioniRowData[i].dipendente.id,
				id_dispositivo:assegnazioniRowData[i].dispositivo.id,
				id: assegnazioniRowData[i].id
			}
			rowData.push(row);
		}
		//this.gridApi.setRowData(rowData);
		
		return rowData;
	}

	rowDataMakerUpdate(assegnazioniRowData){
		this.gridApi.setRowData(this.rowDataMaker(assegnazioniRowData));
	}
	deleteAssegnazione(){
		if (this.state.data_fine){
			var confronto=true;
			var data_fine=this.formDataGenerator(this.state.data_fine);
			var assegnazioniSelezionate=this.gridApi.getSelectedNodes();
			//verifico che i record selezionati non facciano riferimento ad una assegnazione già terminata
			for (var i=0; i<assegnazioniSelezionate.length; i++){
					confronto=confronto && (assegnazioniSelezionate[i].data.data_fine==null)
				}
			if (confronto){
				//verifico che data_fine>data_inizio per tutti i record selezionati
				for (var i=0; i<assegnazioniSelezionate.length; i++){
					confronto=confronto && (data_fine.getTime>(this.formDataGenerator(assegnazioniSelezionate[i].data.data_inizio)).getTime())
				}
				if (confronto){
					try{
						for (var i=0; i<assegnazioniSelezionate.length; i++){
							debugger;
							assegnazioniSelezionate[i].data.data_fine=this.formDataGenerator(this.state.data_fine);
							DispositiviAssegnatiService.insert(assegnazioniSelezionate[i].data)
							DispositiviService.updateToDisponibile(assegnazioniSelezionate[i].data.id_dispositivo)
						}
						window.location.reload();
					}catch(error){}
				}else{
					alert("Data non valida! La date di fine deve essere maggiore della data inizio di tutti i record selezionati");
				}
			}else{
				alert("Attenzione! Sembra che una delle assegnazioni selezionate sia già terminata!");
				this.closeModaleCancellazione();
			}
		}else{
			alert("Devi prima selezionare una data!");
		}
	}

	handleFileUpload(e){
		e.preventDefault()
		const reader = new FileReader()
		var data;
		var requiredColumns=["code","cf","tipo"];//colonne che DEVONO essere presenti nel CSV
		var checkRequiredColumns=true;
		var columns;
		var rawRows=[];
		var rows=[];
		var nonInsertableRow=[];
		var response;
		reader.onload = async (e) => { 
			data= (e.target.result.split("\n"));
			columns=data[0].split(",");

			//controllo che tutte le colonne richieste siano presenti
			for (var i=0; i<requiredColumns.length; i++){
				checkRequiredColumns=checkRequiredColumns && columns.includes(requiredColumns[i]);
			}
			if (!checkRequiredColumns){
				//interrompo l'esecuzione dell'upload e restituisco un messaggio di notifica
				alert("Il file CSV fornito non è valido! Le seguenti colonne devono essere presenti: code, cf, tipo")
				return 0;
			}
			//trasformato le righe del CSV in un array di oggetti JSON
			for (var i=1; i<data.length; i++){
				rawRows.push(data[i].split(","));
			}

			for (var i=0; i<rawRows.length; i++){

				var obj={};
				for (var j=0; j<columns.length; j++){
					obj[columns[j].trim()]=rawRows[i][j];
				}
				//memoirzzio i record
				if (obj.code!="" && obj.cf!="" && obj.tipo!=""){
					rows.push(obj);
				}else{
					nonInsertableRow.push(obj); //righe non valide per l'insert, queste righe verrano stampate al termine dell'import
				}
			}
			//utilizzo questi JSON per creare i nuovi DIPENDENTI, i nuovi DISPOSITIVI e le associazioni DIPENDENTE-DISPOSITIVO
			for (var i=0; i<rows.length;i++){
			//controllo l'esistenza del DIPENDENTE prima di inserirlo l'associazione 
				var dipendente=DipendentiService.findByCf(rows[i].cf).then(response => {
					//se il dipendente non esiste lo inserisco
					if (response.data==""){
						return DipendentiService.insert({nome: rows[i].nome, cognome: rows[i].cognome, cf:rows[i].cf}).then(
							response => {return response.data.id}
						);
					//se esiste ne ritorno l'ID
					}else{
						return response.data.id;
					}
				});
				var tipo=await TipiService.findByDescrizione(rows[i].tipo).then(response => {
					if (response.data ==""){
						return TipiService.insert({descrizione:rows[i].tipo}).then(
							response => {return response.data.id;}
						);
					}else{return response.data[0].id;}

				});
				//controllo l'esistenza del DISPOSITIVO prima di inserire l'associazione 
				var dispositivo =DispositiviService.findByCode(rows[i].code).then(response => {
					//se il dispositivo non esiste lo inserisco
					if (response.data==""){
						var disponibile;
						//se non conosco la data_fine allora il dispositivo è attualmente assegnato
						if (rows[i].data_fine==""){
							disponibile="N";
						}else{
							disponibile="Y"
						}
						debugger;
						return DispositiviService.insert({modello: rows[i].modello, memoria: rows[i].memoria, id_tipo:tipo, disponibile:disponibile, code: rows[i].code, }).then(
							response => {return response.data.id}
						);
					//se esiste ne ritorno l'ID
					}else{
						var disponibile;
						if (rows[i].data_fine==""){
							disponibile="N";
						}else{
						//assegnazioni con data_fine != null non devono cambiare la disponibilità del dispositivo 
							disponibile=response.data.disponibile;
						}
						debugger;
						return DispositiviService.insert({id:response.data.id, modello: rows[i].modello, memoria: rows[i].memoria, id_tipo:tipo, disponibile:disponibile, code: rows[i].code, }).then(
							response => {return response.data.id}
						);
						
					}
				});
				//inserisco l'ASSOCIAZINE
				DispositiviAssegnatiService.insert({id_dipendente:await dipendente, id_dispositivo:await dispositivo, data_inizio:this.dataGenerator(rows[i].data_inizio), data_fine:this.dataGenerator(rows[i].data_fine)}).then(response => {
					var messaggio="Import completato! \nSono stati trovati "+nonInsertableRow.length+" errori! \nNon è stato possibile inserire " + nonInsertableRow.length + " record perchè non validi:\n";
					/*for (var i=0; i<nonInsertableRow.length; i++){

						messaggio+= JSON.stringify(nonInsertableRow[i]) + '\n';
					}
					
					*/
					for(var elem in nonInsertableRow){
						var key = elem;
						var val = nonInsertableRow[elem];
						for(var j in val){
							var sub_key = j;
							var sub_val = val[j];
							messaggio+= sub_key+": " + sub_val+ ", ";
						}
						messaggio+="\n";
					}

					alert(messaggio);
					window.location.reload();
				});
			}
		};
		reader.readAsText(e.target.files[0]);
	}

	handleChange(event) {debugger;
		this.state[event.target.name]= event.target.value.toString();
	}

	findDindenteByCf(cf){
		DipendentiService.findByCf(cf).then(
			(response) => { this.setState({response:response.data})}
		);
		return this.state.response
	}

	//gg/mm/aaaa || gg/mm/aa
	dataGenerator(date){
		if (date!=""){
			try{
				var newDate= date.split(/[\s-,/ ]+/);
				if(newDate[2].length==2){
					newDate[2]="20"+""+newDate[2];
				}
			}catch(e){return null}
		}else{
			return null;
		}
		if (isNaN(new Date(newDate[2], newDate[1]-1, newDate[0]))){
			return null;
		}else{
			return new Date(newDate[2], newDate[1]-1, newDate[0]);
		}
	}

	formDataGenerator(date){
		//la data arriva nel formato anno mese giorno
		var newDate= date.split(/[\s-,/ ]+/);
		if(newDate[2].length==2)
		return new Date(newDate[0], newDate[1]-1, newDate[2]);
	}

	closeModaleImport(event){
		var modal = document.getElementById("modaleImport");
		modal.style.display = "none";
	}

	viewModaleImport(event){
		var modal = document.getElementById("modaleImport");
		modal.style.display = "block";
	}

	closeModaleCancellazione(event){
		var modal = document.getElementById("modaleCancellazione");
		modal.style.display = "none";
	}

	viewModaleCancellazione(event){
		if (this.gridApi.getSelectedNodes().length==0){
			alert("Devi prima selezionare dei record!")
		}else{
		var modal = document.getElementById("modaleCancellazione");
		modal.style.display = "block";
		}
	}

	render(){
		return(

			<div className="full">
				<div className="full" style={{float:"none"}}>
					<div className="ag-grid-intestazione" style={{backgroundColor :"#77CFF3", height:"auto"}}>
						<div className="one-third" style={{padding :"1%", textAlign:"left"}} onClick={this.viewModaleImport.bind(this)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-file-earmark-spreadsheet" viewBox="0 0 16 16">
								<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h3v1a1 1 0 0 1-1 1h-2zm3-3h-3v-2h3v2zm-7 0v-2h3v2H6z"/>
							</svg>
						</div>
						<div className="one-third" style={{padding :"1%"}}>
							<p>Lista Assegnazioni</p>
						</div>
						<div className="radio-button-in-title" style={{padding :"1%"}}>
							<div className="test">
								<div class="form-check form-check-inline">
									<label class="form-check-label" for="inlineRadio1" style={{marginRight:"10px"}}>Attive </label>
									<input class="form-check-input" type="radio" name="filtraDispositivi" onClick={() => this.rowDataMakerUpdate(this.state.dispositiviAssegnatiAttiviRowData)} />
								</div>
								<div class="form-check form-check-inline">
									<label class="form-check-label" for="inlineRadio2" style={{marginRight:"10px"}}>Tutte </label>
									<input class="form-check-input" type="radio" name="filtraDispositivi" onClick={() => this.rowDataMakerUpdate(this.state.dispositiviAssegnatiTotRowData)}/>
								</div>
							</div>
						</div>				
					</div>
					<div className="adapt-divsize-to-gridsize-450">
						
						<div className="ag-theme-alpine" style={{ height: 380, width: '90%' }}>
							<AgGridReact 
								columnDefs={this.state.dispositiviAssegnatiColumnDef}
								rowData={this.rowDataMaker(this.state.dispositiviAssegnatiTotRowData)}
								onGridReady={params=>this.gridApi=params.api}
								rowSelection="multiple">
							</AgGridReact>
						</div>
					</div>

					<div className="add no-grayscale" style={{backgroundImage: `url(${Background})`}}>
					</div>

					<div className="add" style={{backgroundColor:"#B3071B", marginTop:"2%", height:"80px"}} onClick={this.viewModaleCancellazione.bind(this)}>
						<div className="add-text" style={{height:"80%",paddingBottom:"10px"}}>
							Cancella Selezionati <i class="bi bi-trash-fill"></i>
							<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
								<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
							</svg>
						</div>
					</div>

					<div className="modal" id="modaleImport">
						<div className="modal-content-insert" style={{width:"40%",marginLeft: "30%"}}>
							<div className="modal-insert-header" style={{backgroundImage: 'url("http://localhost:3000/static/media/dispositivi-assegnati.3c792958.jpg")'}} >
								<div className="modal-insert-header-body">
									Importa Assegnazioni da CSV
								</div>
							</div>
							<div className="modal-insert-body" style={{width:"80%", textAlign:"left"}}>
								<div class="modal-text">
									<p>Affinchè l'upload da CSV vada a buon fine è necessario che siano presenti le seguenti colonne: </p>
									<ul>
										<li>cf : codice fiscale del dipendente assegnatario</li>
										<li>code : codice univoco che identifica il dispositivo</li>
										<li>tipo: la tipologia del dispositivo</li>
									</ul>

									<p>Seleziona il file da importare: (una volta selezionato il file avrà inizio l'upload)</p>
									<input type="file" id="file-selector" onChange={this.handleFileUpload.bind(this)}></input>
								</div>
							</div>
							<div className="modal-bottom-button">
								<div className="mid">
									<div className="modal-button" onClick={this.closeModaleImport.bind(this)}>Esci</div>
								</div>
							</div>
							<div className="modal-insert-footer" style={{backgroundColor :"#77CFF3"}}>
							</div>
						</div>
					</div>

					<div className="modal" id="modaleCancellazione">
						<div className="modal-content-insert" style={{width:"40%",marginLeft: "30%"}}>
							<div className="modal-insert-header" style={{backgroundImage: 'url("http://localhost:3000/static/media/dispositivi-assegnati.3c792958.jpg")'}} >
								<div className="modal-insert-header-body">
									Conferma Cancellazione
								</div>
							</div>
							<div className="modal-insert-body" style={{width:"80%", textAlign:"left"}}>
								<div class="modal-text">
									<p>Seleziona la data di termine delle assegnazionei prima di procedere alla cancellazione dei record</p>
									<input type="date" class="form-control" name="data_fine" onChange={this.handleChange.bind(this)}/>
								</div>
							</div>
							<div className="modal-bottom-button">
								<div className="mid">
									<div className="modal-button" onClick={this.deleteAssegnazione.bind(this)}>Conferma</div>
								</div>
								<div className="mid">
									<div className="modal-button" onClick={this.closeModaleCancellazione.bind(this)}>Esci</div>
								</div>
							</div>
							<div className="modal-insert-footer" style={{backgroundColor :"#77CFF3"}}>
							</div>
						</div>
					</div>

				</div>
		</div>
		);
	}
}

export default DispositiviAssegnati;