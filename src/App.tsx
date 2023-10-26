import "./App.css";
import ServicesHeader from "./components/serviceHeader/ServicesHeader";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <ServicesHeader />
    </UserProvider>
  );
}

export default App;
