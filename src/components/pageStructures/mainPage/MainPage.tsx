import "./MainPage.css";
import Info from "./info/Info";
import Panel1 from "./panel/panel1/Panel1";
import Panel2 from "./panel/panel2/Panel2";
import Panel3 from "./panel/panel3/Panel3";

export default function MainPage() {
  return (
    <div className="main-page">
      <div className="left-body">
        <Panel1 />
        <Panel2 />
        <Panel3 />
      </div>
      <div className="right-body">
        <Info />
      </div>
    </div>
  );
}
