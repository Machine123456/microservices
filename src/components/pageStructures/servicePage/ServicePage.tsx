import React from "react";
import { hasAuthorities } from "../../../context/UserContext";
import "./ServicePage.css";
import { Navigate, Outlet, RouteObject, createBrowserRouter, useNavigate, useOutlet } from "react-router-dom";
import App from "../../../App";
import MainPage from "../mainPage/MainPage";
import { SimpleBtn1 } from "../../utils/buttons/customBtn/CustomBtn";
import RequireAuthoritiesRoute from "./RequireRoleRoute";
import { FetchDataType, MappedAuthority, User } from "../../../utils/models";
import DataList from "./dataList/DataList";
import DataDetails from "./dataDetails/DataDetails";

export const ServicesList = ["Authentication", "Product"] as const;
export type Service = (typeof ServicesList)[number];


const SERVICES_PATH_NAME = "service";

export type ServiceData = {
  name: string
  element: JSX.Element
  serviceImgPath?: string
  requiredAuthorities: string[][] | string[]

  isPage: boolean
  views?: ServiceData[];
};

const defaultServiceData: ServiceData = {
  name: "",
  element: <Outlet />,
  serviceImgPath: undefined,
  requiredAuthorities: [],
  isPage: true,
  views: undefined,

}

const getDataTypeView = (dataType: FetchDataType): ServiceData => {
  return {
    ...defaultServiceData,
    name: dataType,
    requiredAuthorities: ["READ_" + dataType.toUpperCase()],
    element: <DataList dataType={dataType} />,
    views: [
      {
        ...defaultServiceData,
        name: ":id",
        requiredAuthorities: ["READ_" + dataType.toUpperCase()], //TODO change to "read details" or something
        element: <DataDetails dataType={dataType} />
      },
    ]
  }

}


export const servicesData: { [service in Service]: ServiceData } = {
  Authentication: {
    ...defaultServiceData,
    name: "authentication",
    isPage: true,
    serviceImgPath: "/authicon.png",
    requiredAuthorities: [[MappedAuthority.READ_USER],[MappedAuthority.READ_ROLE],[MappedAuthority.READ_AUTHORITY]],
    views: [
      getDataTypeView("user"),
      getDataTypeView("role"),
      getDataTypeView("authority"),
      { 
        ...defaultServiceData,
        name: "admin",
        requiredAuthorities: [MappedAuthority.ROLE_ADMIN],
        element: <div>admin</div>
      },
    ]
  },
  Product: {
    ...defaultServiceData,
    name: "product",
    isPage: false,
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

export const getUserServiceLinks = (user: User, service: Service): string[] => {

  const aux = (data: ServiceData, path: string, isHidden: boolean): string[] => {
    {
      const newPath = path + "/" + data.name;

      let links: string[] = [];

      isHidden ||= data.name.startsWith(":");

      if (data.isPage && !isHidden)
        links.push(newPath);

      data.views?.forEach((viewData: ServiceData) => {
        if (hasAuthorities(user, ...viewData.requiredAuthorities))
          links = [...links, ...aux(viewData, newPath, isHidden)]
      })
      return links;
    }
  }

  return aux(servicesData[service], SERVICES_PATH_NAME, false);
}

const mapToRouteObject = (data: ServiceData, returnPath: string, path: string): RouteObject => {

  //
  const currentPath: string = path + "/" + data.name;
  const nextReturnPath = data.isPage ? currentPath : returnPath;

  const dataViews = data.views ?
    data.views.map((viewData) => mapToRouteObject(viewData, nextReturnPath, currentPath))
    : undefined;

  const children = dataViews ?
    !data.isPage ?
      [
        {
          path: "",
          element: <Navigate to="/" />
        },
        ...dataViews,
      ] :
      dataViews
    : undefined;


  return {
    path: data.name,
    element: <ServiceWrapper data={data} returnPath={returnPath} />,
    children
  }
}

const serviceRouteObj: RouteObject[] = Object.entries(servicesData).map(([_, serviceData]) => mapToRouteObject(serviceData, "/", "/" + SERVICES_PATH_NAME));


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainPage />
      },
      {
        path: "/" + SERVICES_PATH_NAME,
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <Navigate to="/" />
          },
          ...serviceRouteObj
        ]
      },
      {
        path: "*",
        element: <Navigate to="/" />
      },

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


type ServiceWrapperProps = {
  data: ServiceData
  returnPath: string
}

function ServiceWrapper({ data, returnPath }: ServiceWrapperProps) {

  //TODO use relative path to ..
  const navigate = useNavigate();

  //console.log(returnPath);

  return data.isPage ?
    <ParentService>
      <SimpleBtn1 onClick={() => navigate(returnPath)} />
      <RequireAuthoritiesRoute viewName={data.name} authorities={data.requiredAuthorities}> {data.element} </RequireAuthoritiesRoute>
    </ParentService> : data.element
}

type ParentServiceProps = {
  children: React.ReactNode
}

function ParentService({ children }: ParentServiceProps) {
  const outlet = useOutlet()

  return <div>{outlet || children}</div>

}

type ServicePageProps = {
  children: React.ReactNode
}


export default function ServicePage({ children }: ServicePageProps) {

  return <div className="service-page">
    {children}
  </div>;
}








