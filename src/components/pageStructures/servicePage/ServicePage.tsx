import React from "react";
import { hasAuthorities } from "../../../context/UserContext";
import "./ServicePage.css";
import { Navigate, Outlet, RouteObject, createBrowserRouter, useNavigate } from "react-router-dom";
import App from "../../../App";
import MainPage from "../mainPage/MainPage";
import { CloseBtn1 } from "../../utils/buttons/customBtn/CustomBtn";
import RequireAuthoritiesRoute from "./RequireRoleRoute";
import { MappedAuthority, User } from "../../../utils/models";
import FetchDataPage from "./fetchDataPage/FetchDataPage";

export const ServicesList = ["Authentication", "Product"] as const;
export type Service = (typeof ServicesList)[number];

export type ServiceData = {
  name: string
  element: JSX.Element
  serviceImgPath?: string
  requiredAuthorities: MappedAuthority[]

  views?: ServiceData[];
};

const defaultServiceData = {
  name: "",
  element: <Outlet />,
  serviceImgPath: undefined,
  requiredAuthorities: [],
  views: undefined
}

const ServiceWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (<>
    <CloseBtn1 onClick={() => navigate("/")} />
    {children}
  </>);
}

export const servicesData: { [service in Service]: ServiceData } = {
  Authentication: {
    ...defaultServiceData,
    name: "authentication",
    element: <Outlet />,
    serviceImgPath: "/authicon.png",
    requiredAuthorities: [],
    views: [
      {
        ...defaultServiceData,
        name: "users",
        requiredAuthorities: [],
        element: <FetchDataPage dataType="user" />
      },
      {
        ...defaultServiceData,
        name: "roles",
        requiredAuthorities: [],
        element: <FetchDataPage dataType="role" />
      },
      {
        ...defaultServiceData,
        name: "authorities",
        requiredAuthorities: [],
        element: <FetchDataPage dataType="authority" />
      },
      {
        ...defaultServiceData,
        name: "admin",
        requiredAuthorities: [],
        element: <div>admin</div>
      },
    ]
  },
  Product: {
    ...defaultServiceData,
    name: "product",
    element: <Outlet />,
    serviceImgPath: "/producticon.png",
    requiredAuthorities: [MappedAuthority.ROLE_USER],
    views: [
      {
        ...defaultServiceData,
        name: "products",
        requiredAuthorities: [MappedAuthority.ROLE_USER],
        element: <div>products</div>
      },
      {
        ...defaultServiceData,
        name: "admin",
        requiredAuthorities: [MappedAuthority.ROLE_ADMIN],
        element: <div>admin</div>
      },],
  },
};



export const getUserServiceLinks = (user: User,service: Service): string[] => {

  const aux = (data: ServiceData, path: string): string[] => {
    {
      const newPath = path + "/" + data.name;
      if (!data.views)
        return [newPath];

      let links: string[] = [];
      data.views.forEach((viewData: ServiceData) => {
        if (hasAuthorities(user, ...viewData.requiredAuthorities))
          links = [...links, ...aux(viewData, newPath)]
      })
      return links;
    }
  }

  return aux(servicesData[service], "service");
}

const handleRoutes = (routes: RouteObject[]): RouteObject[] => [
  {
    path: "",
    element: <Navigate to="/" />
  },
  ...routes,
  {
    path: "*",
    element: <Navigate to="/" />
  },
]

const mapToRouteObject = (data: ServiceData): RouteObject => {
  return {
    path: data.name,
    element: <RequireAuthoritiesRoute authorities={data.requiredAuthorities}> {data.element} </RequireAuthoritiesRoute>,
    children: data.views ? handleRoutes(data.views.map((viewData) => mapToRouteObject(viewData))) : undefined
  }
}

const serviceRouteObj: RouteObject[] = Object.entries(servicesData).map(([_, serviceData]) => mapToRouteObject(serviceData));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainPage />
      },
      ...handleRoutes([{
        path: "/service",
        element: <ServiceWrapper><Outlet /></ServiceWrapper>,
        children: [
          ...handleRoutes(serviceRouteObj)
        ]
      }])
    ]
  },
]);

export const mapToLocale = (service: Service, viewName: string) => "/" + service.toString().toLowerCase() + "/" + viewName;
export const mapToServiceData = (locale: string): ServiceData | null => {

  const parts = locale.split("/");

  if (parts.length < 1)
    return null;

  try {
    const service: Service = (parts[0] as Service);
    return servicesData[service];
  } catch (err) {
    return null;
  }


}

type ServicePageProps = {
  children: React.ReactNode
}

export default function ServicePage({ children }: ServicePageProps) {

  return <div className="service-page">
    {children}
  </div>;
}








