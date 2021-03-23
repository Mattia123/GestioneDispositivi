import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom'

import DipendentiService from '../service/DipendentiService';
import ReactDOM from 'react-dom';

//react-grid
import { useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import BackgroundDispositivi from '../immagini/dispositivi2.jpg'
import BackgroundDipendenti from '../immagini/dipendenti.png'
import BackgroundAssegnati from '../immagini/dispositivi-assegnati.jpg'



class Home extends Component{
	render(){
		return(
			<div className="full">
				<Link to='./dipendenti'>
					<div className="square" style={{backgroundImage: `url(${BackgroundDipendenti})`}}>
							<div className="square-testo">
								Dipendenti
							</div>
					</div>
				</Link>
				<Link to='./dispositivi'>
					<div className="square" style={{backgroundImage: `url(${BackgroundDispositivi})`,}}>
							<div className="square-testo">
								Dispositivi
							</div>
					</div>
				</Link>
				<Link to='./dispositiviassegnati'>
					<div className="square" style={{backgroundImage: `url(${BackgroundAssegnati})`,}}>
							<div className="square-testo">
								Dispositivi assegnati
							</div>
					</div>
				</Link>
			</div>
		);
	}
}

export default Home;