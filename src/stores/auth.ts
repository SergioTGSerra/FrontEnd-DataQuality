import { onMounted, onUnmounted, ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import AuthService from "@/core/services/AuthService";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  api_token: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<any>({} as any);
  const isAuthenticated = ref(!!JwtService.getAccessToken());

  function setAuth(authUser: any) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveAccessToken(user.value.access_token);
    JwtService.saveRefreshToken(user.value.refresh_token);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as any;
    errors.value = [];
    JwtService.destroyAccessToken();
  }

  function login(credentials: any) {
    return AuthService.getToken(credentials)
      .then((data) => {
        console.log(data);
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials: any) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    if (JwtService.getAccessToken()) {
      ApiService.setHeader();
      ApiService.post("verify_token", { Access_token: JwtService.getAccessToken() })
        .then(({ data }) => {
          setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors);
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  function refreshToken() {
    if(JwtService.getRefreshToken){
      return AuthService.refreshToken()
      .then((data) => {
        console.log(data);
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
        purgeAuth();
      });
    }
  }

  function refreshTokenInterval() {
    setInterval(refreshToken, 50000);
  }
  
  refreshTokenInterval();

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
  };
});
