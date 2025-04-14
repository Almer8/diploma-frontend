import './App.css';
import {Route, Routes} from "react-router";
import RedirectComponent from "./components/RedirectComponent";
import Layout from "./components/Layout";
import Auth from "./components/Auth";
import MainRedirect from "./components/MainRedirect";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<RedirectComponent/>} />

          <Route element={<Layout/>}>
              <Route path="/login" element={<Auth/>} />
              <Route path="/main" element={<MainRedirect/>} />

          </Route>

      </Routes>
    </div>
  );
}

export default App;
