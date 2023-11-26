import { createContext, useRef } from "react";
import { ResponseContent } from "../hooks/useFetch";

type CacheValue =
  {
    data?: ResponseContent,
    errorMsg?: string,
    error: boolean
  } | null

type DataCacheType = {[key: string]: CacheValue}

type CacheContextValues = {
  get: (key: string) => CacheValue
  save: (key: string, data: CacheValue) => any
  clear: () => any
};

type CacheProviderProps = {
  children: React.ReactNode;
  // add any custom props, but don't have to specify `children`
};


const defaultContext: CacheContextValues = {
  get: () => null,
  save: () => { },
  clear: () => { }
};

export const CacheContext = createContext<CacheContextValues>(defaultContext);

export const CacheProvider = ({ children }: CacheProviderProps) => {

  const dataCacheRef = useRef<DataCacheType>({});

  const contextValues: CacheContextValues = {
    get: (key: string) => dataCacheRef.current[key],
    save: (key: string, data: CacheValue) => dataCacheRef.current = { ...dataCacheRef.current, [key]: data },
    clear: () => dataCacheRef.current = {}
  };

  return (
    <CacheContext.Provider value={contextValues}>
      {children}
    </CacheContext.Provider>
  );
};
