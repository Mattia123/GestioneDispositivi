import axios from 'axios';

const DISPOSITIVI_REST_API_URL = 'http://localhost:8090/api/dispositivi';

class DispositiviService{
	
	getAll(){
		return axios.get(DISPOSITIVI_REST_API_URL);
	}
	getAvailabale(){
		return axios.get(DISPOSITIVI_REST_API_URL+"/disponibili");
	}
	insert(requestBody){
		return axios.post(DISPOSITIVI_REST_API_URL, requestBody);
	}
	delete(id){
		return axios.post(DISPOSITIVI_REST_API_URL+"/id="+id);
	}
	updateToDisponibile(id){
		return axios.post(DISPOSITIVI_REST_API_URL+"/iddispdaaggiornare="+id);
	}
	findByCode(code){
		return axios.get(DISPOSITIVI_REST_API_URL+"/code="+code);
	}
}

export default new DispositiviService();