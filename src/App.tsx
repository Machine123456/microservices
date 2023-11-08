import { useEffect } from "react";
import "./App.css";
import Info from "./components/pageStructures/info/Info";
import Panel1 from "./components/pageStructures/panel/panel1/Panel1";
import Panel2 from "./components/pageStructures/panel/panel2/Panel2";
import Panel3 from "./components/pageStructures/panel/panel3/Panel3";

import ServicesHeader from "./components/pageStructures/serviceHeader/ServicesHeader";
import { ThemeData, ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { useTheme } from "./hooks/useCustomContext";
import { LanguageProvider } from "./context/LanguageContext";

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

  let { theme } = useTheme();

  useEffect(() => {
    updateTheme(theme)
  }, [theme]);


  function updateTheme(theme: ThemeData) {
    var root: HTMLElement | null = document.querySelector(':root');

    if (root) {
      var rootStyle = root.style;
      rootStyle.setProperty('--main-color', theme.mainColor);
      rootStyle.setProperty('--details-color', theme.detailsColor);
      rootStyle.setProperty('--main-color2', theme.mainColor2);
      rootStyle.setProperty('--details-color2', theme.detailsColor2);
    }
  }

  return (
    <>
      <ServicesHeader />
      <div className="page">
        <div className="left-body">
          <Panel1 />
          <Panel2 />
          <Panel3 />
        </div>
        <div className="right-body">
          <Info />
        </div>
      </div>
    </>

  );
}
