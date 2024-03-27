const ACCESS_TOKEN = "access_token" as string;
const REFRESH_TOKEN = "refresh_token" as string;

/**
 * @description get token form localStorage
 */
export const getAccessToken = (): string | null => {
  return window.localStorage.getItem(ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
  return window.localStorage.getItem(REFRESH_TOKEN);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveAccessToken = (token: string): void => {
  window.localStorage.setItem(ACCESS_TOKEN, token);
};

export const saveRefreshToken = (token: string): void => {
  window.localStorage.setItem(REFRESH_TOKEN, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyAccessToken = (): void => {
  window.localStorage.removeItem(ACCESS_TOKEN);
};

export const destroyRefreshToken = (): void => {
  window.localStorage.removeItem(ACCESS_TOKEN);
};

export default { getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken, destroyAccessToken, destroyRefreshToken};
