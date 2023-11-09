import "./App.css";

import ServicesHeader from "./components/pageStructures/servicesHeader/ServicesHeader";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { LanguageProvider } from "./context/LanguageContext";
import MainPage from "./components/pageStructures/mainPage/MainPage";

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

  return (
    <>
      <ServicesHeader />
      <MainPage/>
    </>

  );
}
