export const ServicesList = ["Authentication", "Product"] as const;
export type Service = (typeof ServicesList)[number];

export const getServiceUrl = (service: Service): string => {
  switch (service) {
    case "Authentication":
      return import.meta.env.VITE_AUTH_SERVICE;
    case "Product":
      return import.meta.env.VITE_PRODUCT_SERVICE;
  }
};

type ServiceData = {
  serviceImgPath: string;
  serviceViews: readonly string[];
};

export const servicesData: { [service in Service]: ServiceData } = {
  Authentication: {
    serviceImgPath: "/authicon.png",
    serviceViews: ["users", "admin"],
  },
  Product: {
    serviceImgPath: "/producticon.png",
    serviceViews: ["products", "admin"],
  },
};
