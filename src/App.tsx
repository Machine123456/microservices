import "./App.css";

import ServicesHeader from "./components/pageStructures/servicesHeader/ServicesHeader";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Outlet } from "react-router-dom";
import ServicePage from "./components/pageStructures/servicePage/ServicePage";
import { CacheProvider } from "./context/CacheContext";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>

        <CacheProvider>
          <UserProvider>

            <ServicesHeader />
            <ServicePage>
              <Outlet />
            </ServicePage>

          </UserProvider>
        </CacheProvider>

      </LanguageProvider>
    </ThemeProvider>
  );
}