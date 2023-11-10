import "./App.css";

import ServicesHeader from "./components/pageStructures/servicesHeader/ServicesHeader";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { LanguageProvider } from "./context/LanguageContext";
import MainPage from "./components/pageStructures/mainPage/MainPage";
import ServicePage from "./components/pageStructures/servicePage/ServicePage";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <Inner />
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function Inner() {

  console.log("Rerender");
  

  return (
    <>

      <ServicesHeader />
      <ServicePage />
      <div className="page-body">
        <MainPage/>
      </div>
    </>

  );
}
