export function capitalizeFirstLetter(str?: string): string{
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  export function getHeadOfPath(path: string) {
    const parts = path.split("/");
    return parts.length > 1 ? parts[parts.length - 1] : path;
  }