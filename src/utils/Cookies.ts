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
    let cookieString = encodeURIComponent(name)+"="+encodeURIComponent(value);
  
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
  
export function getCookie(name: string): string | null {
    const cookieName = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");
  
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
  
      if (cookie.startsWith(cookieName)) {
        const cookieValue = decodeURIComponent(cookie.substring(cookieName.length));
        return cookieValue;
      }
    }
  
    return null;
  }

  
export function removeCookie(name: string): void {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }