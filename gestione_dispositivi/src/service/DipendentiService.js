import axios from 'axios';

const DIPENDENTI_REST_API_URL = 'http://localhost:8090/api/dipendenti';

class DipendentiService{
	
	getAll(){
		return axios.get(DIPENDENTI_REST_API_URL)
	}

	insert(requestBody){
		return axios.post(DIPENDENTI_REST_API_URL, requestBody)
	}

	delete(id){
		return axios.post(DIPENDENTI_REST_API_URL+"/id="+id)
	}

	findByCf(cf){
		return axios.get(DIPENDENTI_REST_API_URL+"/cf="+cf)
	}
}

export default new DipendentiService();