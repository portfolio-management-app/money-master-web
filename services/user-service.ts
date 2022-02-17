import Router from 'next/router';
import { httpError, mainConstant } from 'helpers';
import { cryptoService, httpService, storageService } from 'services';
import { userStore, authStore } from 'store';
import { firebaseService } from 'services';
import { UserInfo } from 'models';
export const userService = {
  register,
  login,
  logout,
  googleAuthentication,
  facebookAuthentication,
  isLoggedIn,
  fetchUserInfo,
  isAuthToken,
};

function isLoggedIn() {
  return (
    storageService.getLocalStorage(mainConstant.TOKEN_KEY) && userStore.user
  );
}

function isAuthToken() {
  return !!storageService.getLocalStorage(mainConstant.TOKEN_KEY);
}

async function register(params: { email: string; password: string }) {
  authStore.setAuthenticating(true);
  storageService.deleteLocalStorage(mainConstant.TOKEN_KEY);
  const url = '/user';
  const res: any = await httpService.post(url, {
    email: params.email,
    password: params.password,
  });
  if (!res.isError) {
    storageService.setLocalStorage(mainConstant.TOKEN_KEY, res.data.token);
  }
  return res;
}

async function login(params: { email: string; password: string }) {
  authStore.setAuthenticating(true);
  storageService.deleteLocalStorage(mainConstant.TOKEN_KEY);
  const url = '/authentication';
  const res: any = await httpService.post(url, {
    email: params.email,
    password: params.password,
  });
  if (!res.isError) {
    const encryptedToken = cryptoService.encrypt(res.data.token);
    storageService.setLocalStorage(mainConstant.TOKEN_KEY, encryptedToken);
    userStore.updateUser({ ...res.data });
  }
  authStore.setAuthenticating(false);
  return res;
}

async function googleAuthentication() {
  authStore.setAuthenticating(true);
  storageService.deleteLocalStorage(mainConstant.TOKEN_KEY);
  const response: any = await firebaseService
    .googleLogin()
    .then(async (data: any) => {
      /*const url = "/authentication/google";
      const res: any = await httpService.post(url, { token: data?.token });
      if (!res?.isError) {
        storageService.setLocalStorage(mainConstant.TOKEN_KEY, res.data.token);
      }*/
      return data;
    })
    .catch((error) => {
      return error;
    });
}

async function facebookAuthentication() {}

async function logout() {
  storageService.deleteLocalStorage(mainConstant.TOKEN_KEY);
  Router.push('/login');
}

async function fetchUserInfo() {
  authStore.setAuthenticating(true);
  const url = '/user/me';
  const res: any = await httpService.get(url);
  if (!res.isError) {
    userStore.updateUser({ ...res.data });
    authStore.setAuthenticating(false);
    return true;
  } else {
    const status = res.data?.status;
    authStore.setAuthenticating(false);
    if (status in [401, 500]) {
      return false;
    }
  }
  return true;
}
