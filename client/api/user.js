import axios from 'axios';
require('dotenv').config();

const headers = {'Content-Type': 'application/json'};

export function LoginUser(data){
    axios.post(process.env.VUE_APP_API_LOGIN_URL, data, { headers: headers }
     ).then((response) => {
       const token = response.data.token;
       localStorage.setItem('token', token);
       return token;
     }).catch(err => {
        return console.log(err);
     });
}
export function SingUp(data){
  axios.post(process.env.VUE_APP_API_SIGNUP_URL, data, { headers: headers }
    ).then((response) => {
      const message =JSON.stringify(response)
      console.log(message.data.message);
    }).catch(err => {
       return console.log(err.message);
    });

}
export function GetQrCode(data) {
  const token = localStorage.getItem('token');
  const authHeader = {'Authorization': `Bearer ${token}`};
  axios.post(process.env.VUE_APP_API_QRCODE_URL, data, { headers: authHeader }
  ).then((response) => {
    const message = response.message;
    return console.log(message);
  }).catch(err => {
     return console.log(err);
  });

}
