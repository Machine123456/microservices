export interface CookieOptions {
  expires?: Date | string;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export function addCookie(name: string, value: string, options: CookieOptions = {}) {
  options = options || {};

  // Construct the cookie string with name and value
  let cookieString = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  // Set optional cookie attributes
  if (options.expires) {
    const expires = new Date(options.expires);

    // Set the 'expires' attribute as a UTC string
    cookieString += `; expires=${expires.toUTCString()}`;
  }
  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }
  if (options.path) {
    cookieString += `; path=${options.path}`;
  }
  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }
  if (options.secure) {
    cookieString += `; secure`;
  }
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;

}

export function getCookie(name: string): string | undefined {
  const cookieName = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();

    if (cookie.startsWith(cookieName)) {
      const cookieValue = decodeURIComponent(cookie.substring(cookieName.length));
      return cookieValue;
    }
  }

  return undefined;
}


export function removeCookie(name: string): void {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function updateCookie(name: string, value: string | undefined) {
  if (value) {
    const cookieLifeTime = 3600; // 1 hour in seconds
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() + cookieLifeTime * 1000); // Convert seconds to milliseconds

    let options: CookieOptions = {
      maxAge: cookieLifeTime, // Set the maximum age to the cookieLifeTime
      expires: expirationTime, // Set 'expires' for compatibility
      path: "/", // Set the path as needed
    };

    addCookie(name, value, options);

  } else removeCookie(name);
}