// src/routes/index.ts
import { createBrowserRouter, RouteObject } from "react-router-dom";

import AssignmentList from "../pages/Assignments/AssignmentList"; // Ensure AssignmentList is a valid React component
import CreateAssignment from "../pages/Assignments/CreateAssignment";
import { Navigate } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/assignments" replace />,
  },
  {
    path: "/assignments",
    // element: <MainLayout />,
    children: [
      { path: "", element: <AssignmentList /> },
      { path: "create", element: <CreateAssignment /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
