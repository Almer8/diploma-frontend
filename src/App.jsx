import './App.css';
import {Route, Routes} from "react-router";
import Layout from "./components/Layout";
import Auth from "./components/Auth";
import MainRedirect from "./components/MainRedirect";
import DoctorView from "./components/DoctorView";
import AnonStoriesView from "./components/AnonStoriesView";
import EmotionSurvey from "./components/EmotionSurvey";
import Settings from "./components/Settings";
import RedirectComponent from "./components/RedirectComponent";
import VisitsRedirect from "./components/VisitsRedirect";
import VisitRedirect from "./components/VisitRedirect";
import DoctorPatientsView from "./components/DoctorPatientsView";
import PatientView from "./components/PatientView";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<RedirectComponent/>} />

          <Route element={<Layout/>}>
              <Route path="/login" element={<Auth/>} />
              <Route path="/main" element={<MainRedirect/>} />
              <Route path="/doctor/:id" element={<DoctorView/>} />
              <Route path="/visits" element={<VisitsRedirect/>} />
              <Route path="/visit/view" element={<VisitRedirect/>} />
              <Route path="/stories" element={<AnonStoriesView/>} />
              <Route path="/survey" element={<EmotionSurvey/>} />
              <Route path="/settings" element={<Settings/>} />
              <Route path="/patients" element={<DoctorPatientsView/>}/>
              <Route path="/patient/:id" element={<PatientView/>}/>
          </Route>

      </Routes>
    </div>
  );
}

export default App;
