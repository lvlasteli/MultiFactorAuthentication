import axios from 'axios';
require('dotenv').config();

const headers = {'Content-Type': 'application/json'};

export function LoginUser(data){
    return axios.post(process.env.VUE_APP_API_LOGIN_URL, data, { headers: headers }
     ).then((response) => {
       const token = response.data.token;
       localStorage.setItem('token', token);
       localStorage.setItem('useremail', data.email);
       return response.data;
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
  const useremail= localStorage.getItem('useremail');
  const authHeader = {'Authorization': `${useremail} ${token}`};
  return axios.post(process.env.VUE_APP_API_QRCODE_URL, data, { headers: authHeader }
  ).then((response) => {
    return response.data;
  }).catch(err => {
     return err.message;
  });
}

export function Enable2FA(data) {
  const token = localStorage.getItem('token');
  const useremail= localStorage.getItem('useremail');
  const authHeader = {'Authorization': `${useremail} ${token}`};
  return axios.put(process.env.VUE_APP_API_ENABLE2FA, data, { headers: authHeader }
  ).then((response) => {
    return response;
  });
}

export function ValidateCode(data) {
  const token = localStorage.getItem('token');
  const useremail= localStorage.getItem('useremail');
  const authHeader = {'Authorization': `${useremail} ${token}`};
  console.log(process.env.VUE_APP_API_VALIDATE);
  return axios.post(process.env.VUE_APP_API_VALIDATE, data, { headers: authHeader }
  ).then((response) => {
    return response.data;
  });
}

export function ConfirmAuth(data) {
  const token = localStorage.getItem('token');
  const useremail= localStorage.getItem('useremail');
  console.log(process.env.VUE_APP_API_SUCCESS_URL);
  const authHeader = {'Authorization': `${useremail} ${token}`};
  return axios.put(process.env.VUE_APP_API_SUCCESS, data, { headers: authHeader }
    ).then((response) => {
    return response;
   });
}


export function ResetQRCode(data) {
  const token = localStorage.getItem('token');
  const useremail= localStorage.getItem('useremail');
  const authHeader = {'Authorization': `${useremail} ${token}`};
  console.log(process.env);
  return axios.put(process.env.RESETQRCODE_URL, data, { headers: authHeader }
    ).then((response) => {
      return response;
    });
}