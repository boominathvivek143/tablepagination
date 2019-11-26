 
import axios from "axios";
 export function getTestData(page, pageSize, sorted, filtered, requestData){
    let url = "http://5ddccce7f40ae700141e8700.mockapi.io/api/gettabledata"
    let postObject = {
        page: page,
        pageSize: pageSize,
        sorted: sorted,
        filtered: filtered,
    }; 
  
    return post(url, postObject).then(response => requestData(page, pageSize, sorted, filtered,response)).catch(response => console.log(response));
  }
  
  const post = (url, params = {}) => {
    return axios.post(url, params)
  }