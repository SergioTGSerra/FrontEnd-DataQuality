import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";
import router from '@/router';
import { useAuthStore } from "@/stores/auth";
/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getAccessToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    slug = "" as string
  ): Promise<AxiosResponse> {
    if(slug === "" || slug === null){
      const res = ApiService.vueInstance.axios.get(`${resource}`);
      return res.then((response) => {
        return response;
      }).catch((error) => {
        if(error.response.status === 401){
          router.push('/sign-in');
          useAuthStore().purgeAuth();
        }
        return error.response;
      });
    }
    return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(resource: string, params: any): Promise<AxiosResponse> {
    const res = ApiService.vueInstance.axios.post(`${resource}`, params);
    return res.then((response) => {
      return response;
    }).catch((error) => {
      if(error.response.status === 401){
        router.push('/sign-in'); 
        useAuthStore().purgeAuth();
      }
      return error.response;
    });
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse> {
    const res = ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
    return res.then((response) => {
      return response;
    }).catch((error) => {
      if(error.response.status === 401){
        router.push('/sign-in'); 
        useAuthStore().purgeAuth();
      }
      return error.response;
    });
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(resource: string, params: any): Promise<AxiosResponse> {
    const res = ApiService.vueInstance.axios.put(`${resource}`, params);
    return res.then((response) => {
      return response;
    }).catch((error) => {
      if(error.response.status === 401){
        router.push('/sign-in'); 
        useAuthStore().purgeAuth();
      }
      return error.response;
    });
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    const res = ApiService.vueInstance.axios.delete(resource);
    return res.then((response) => {
      return response;
    }).catch((error) => {
      if(error.response.status === 401){
        router.push('/sign-in'); 
        useAuthStore().purgeAuth();
      }
      return error.response;
    });
  }
}

export default ApiService;
