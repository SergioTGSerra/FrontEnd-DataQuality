import axios from "axios";
import JwtService from "@/core/services/JwtService";

/**
 * @description service to call HTTP request via Axios
 */
class AuthService {
 
  public static async getToken(credentials: any) {

    const url = import.meta.env.VITE_APP_KEYCLOAK_URL + '/realms/master/protocol/openid-connect/token';
  
    const data = {
      client_id: 'backend-app',
      username: credentials.username,
      password: credentials.password,
      grant_type: 'password'
    };
  
    const formData = new URLSearchParams(data);
  
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;

    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
  }

  public static async refreshToken() {
    const url = import.meta.env.VITE_APP_KEYCLOAK_URL + '/realms/master/protocol/openid-connect/token';
  
    const data = {
      client_id: 'backend-app',
      refresh_token: JwtService.getRefreshToken(),
      grant_type: 'refresh_token'
    };
  
    const formData = new URLSearchParams(data);
  
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;

    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
  }

}

export default AuthService;