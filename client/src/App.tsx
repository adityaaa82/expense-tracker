import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Header from "./components/Header";

function App() {
  return (
    <div className="w-[80vw] max-sm:w-[90vw] mx-auto">
      <BrowserRouter>
        <Header />
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
