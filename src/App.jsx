import './App.css';
import {Route, Routes} from "react-router";
import RedirectComponent from "./components/RedirectComponent";
import Layout from "./components/Layout";
import Auth from "./components/Auth";
import MainRedirect from "./components/MainRedirect";
import DoctorView from "./components/DoctorView";
import PatientVisitsView from "./components/PatientVisitsView";
import PatientVisitView from "./components/PatientVisitView";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<RedirectComponent/>} />

          <Route element={<Layout/>}>
              <Route path="/login" element={<Auth/>} />
              <Route path="/main" element={<MainRedirect/>} />
              <Route path="/doctor/:id" element={<DoctorView/>} />
              <Route path="/visits" element={<PatientVisitsView/>} />
              <Route path="/visit/view" element={<PatientVisitView/>} />

          </Route>

      </Routes>
    </div>
  );
}

export default App;
