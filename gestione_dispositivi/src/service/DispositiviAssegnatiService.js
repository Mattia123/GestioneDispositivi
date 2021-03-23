import axios from 'axios';

const DISPOSITIVIASSEGNATI_REST_API_URL = 'http://localhost:8090/api/dispositiviassegnati';

class DipendentiService{
	
	getAll(){
		return axios.get(DISPOSITIVIASSEGNATI_REST_API_URL)
	}

	getByDipendenteId(dipendenteid){
		return axios.get(DISPOSITIVIASSEGNATI_REST_API_URL+"/iddipendente="+dipendenteid)
	}

	getAssegnazioniAttive(){
		return axios.get(DISPOSITIVIASSEGNATI_REST_API_URL+"/assegnazionicorrenti")
	}
	insert(requestBody){
		return axios.post(DISPOSITIVIASSEGNATI_REST_API_URL, requestBody)
	}

	delete(id){
		return axios.post(DISPOSITIVIASSEGNATI_REST_API_URL+"/id="+id);
	}
}

export default new DipendentiService();