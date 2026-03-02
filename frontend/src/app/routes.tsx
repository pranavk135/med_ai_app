import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { HealthAI } from "./components/HealthAI";
import { EmergencyAssistant } from "./components/EmergencyAssistant";
import { Telemedicine } from "./components/Telemedicine";
import { PatientRecords } from "./components/PatientRecords";
import { Auth } from "./components/Auth";
import { Profile } from "./components/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "health-ai",
        Component: HealthAI,
      },
      {
        path: "records",
        Component: PatientRecords,
      },
      {
        path: "emergency",
        Component: EmergencyAssistant,
      },
      {
        path: "telemedicine",
        Component: Telemedicine,
      },
      {
        path: "auth",
        Component: Auth,
      },
      {
        path: "profile",
        Component: Profile,
      }
    ],
  },
]);
