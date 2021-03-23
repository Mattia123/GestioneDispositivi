import React from 'react'
import AnagraficaDipendenti from './component/AnagraficaDipendenti';
import AnagraficaDispositivi from './component/AnagraficaDispositivi';
import DispositiviAssegnati from './component/DispositiviAssegnati'
import Home from './component/Home'
import NavBar from './NavBar';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App(){
	return (
		<Router>
			<div>
				<NavBar/>
				<Switch>
					<Route path="/dipendenti" component={AnagraficaDipendenti}/>
					<Route path="/dispositivi" component={AnagraficaDispositivi}/>
					<Route path="/dispositiviassegnati" component={DispositiviAssegnati}/>
					<Route path="/" component={Home}/>
				</Switch>
			</div>
		</Router>
	) 
}
 
export default App;