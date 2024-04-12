import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import AuthService from "@/core/services/AuthService";

export interface User {
  name: string;
  surname: string;
  username: string;
  password: string;
  access_token: string;
  refresh_token: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({ name: '', surname: '', username: '', password: '', access_token: '', refresh_token: '' } as User);
  const isAuthenticated = ref(!!JwtService.getAccessToken());

  function setUsername(username: string) {
    user.value.username = username;
  }

  function setAuth(authUser: User) {
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
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyAccessToken();
    JwtService.destroyRefreshToken();
  }

  function decodeToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  function login(credentials: User) {
    return AuthService.getToken(credentials)
      .then((data) => {
        data = { ...data, username: decodeToken(data.access_token).preferred_username };
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response);
      });
  }

  function refreshToken() {
    if (JwtService.getRefreshToken()) {
      AuthService.refreshToken()
        .then((data) => {
          data = { ...data, username: decodeToken(data.access_token).preferred_username };
          setAuth(data);
        })
        .catch(() => {
          purgeAuth();
        });
    }
  }

  function logout() {
    return AuthService.logout()
      .then(() => {
        purgeAuth();
      })
      .catch(() => {
        purgeAuth();
      });
  }

  function register(credentials: User) {
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

  setInterval(() => {
    refreshToken();
  }, 50000);

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    refreshToken,
    verifyAuth,
    decodeToken,
    setUsername,
    purgeAuth
  };
});
