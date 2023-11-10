import { UserRole } from "../../../context/UserContext";
import "./ServicePage.css";
import { Service } from "../../../utils/servicesData";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

type ViewInfo = {
  requiredRole: UserRole,
  location: string,
}

export const getServiceViewInfo = (
  service: Service,
  viewName: string
): ViewInfo => {
  switch (service) {
    case "Authentication": {
      switch (viewName) {
        case "users": return {
          location: "/authentication/users",
          requiredRole: UserRole.None
        }
        case "admin": return {
          location: "/authentication/admin",
          requiredRole: UserRole.Admin
        }
      }
      break;
    }
    case "Product": {
      break;
    }
  }
  return {
    location: "/",
    requiredRole: UserRole.None
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Main</div>,
  },
  {
    path: "/authentication/users",
    element: <div>users</div>,
  },
  {
    path: "/authentication/admin",
    element: <div>admin</div>,
  },
]);


export default function ServicePage() {


  return <div className="service-page">
 <RouterProvider router={router} />
    
  </div>;
}
