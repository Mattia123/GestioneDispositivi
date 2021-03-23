import axios from 'axios';

const TIPO_REST_API_URL = 'http://localhost:8090/api/tipi';

class TipiService{

	getAll(){
		return axios.get(TIPO_REST_API_URL);
	}

	findByDescrizione(descrizione){
		return axios.get (TIPO_REST_API_URL+"/descrizione="+descrizione)
	}

	insert(requestBody){
		return axios.post(TIPO_REST_API_URL, requestBody)
	}

}

export default new TipiService();