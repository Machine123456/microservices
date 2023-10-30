import { useEffect } from "react";
import "./App.css";
import Info from "./components/info/Info";
import Panel1 from "./components/panel/panel1/Panel1";
import Panel2 from "./components/panel/panel2/Panel2";
import Panel3 from "./components/panel/panel3/Panel3";



import ServicesHeader from "./components/serviceHeader/ServicesHeader";
import { ThemeData, ThemeProvider, useThemeContext } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Inner />
      </UserProvider>
    </ThemeProvider>
  );
}

function Inner() {

  let { theme } = useThemeContext();

  useEffect(() => {
    updateTheme(theme)
  }, [theme]);


  function updateTheme(theme: ThemeData) {
    var root: HTMLElement | null = document.querySelector(':root');

    if (root) {
        var rootStyle = root.style;
        rootStyle.setProperty('--main-color', theme.mainColor);
        rootStyle.setProperty('--details-color', theme.detailsColor);
    }
}

  return (
    <div className="page">
      <div className="left-body">
        <ServicesHeader />
        <Panel1 />
        <Panel2/>
        <Panel3/>
      </div>
      <div className="right-body">
        <Info />
      </div>
    </div>
  );
}
