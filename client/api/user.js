import axios from 'axios';
require('dotenv').config();

const headers = {'Content-Type': 'application/json'};

export function LoginUser(data){
    return axios.post(process.env.VUE_APP_API_LOGIN_URL, data, { headers: headers }
     ).then((response) => {
       const token = response.data.token;
       localStorage.setItem('token', token);
       return response.data.message;
     }).catch(err => {
        return err.message;
     });
}
export async function SingUp(data){
  return axios.post(process.env.VUE_APP_API_SIGNUP_URL, data, { headers: headers }
    ).then((response) => {
      return response.data.message;
    }).catch(err => {
       return err.message;
    });

}
export function GetQrCode(data) {
  const token = localStorage.getItem('token');
  const authHeader = {'Authorization': `Bearer ${token}`};
  return axios.post(process.env.VUE_APP_API_QRCODE_URL, data, { headers: authHeader }
  ).then((response) => {
    return response.data.message;
  }).catch(err => {
     return err.message;
  });

}