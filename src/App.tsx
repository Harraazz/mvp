import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventListScreen from "./pages/EventListScreen";
import EventDetailScreen from "./pages/EventDetailScreen";
import CreateEventScreen from "./pages/CreateEventScreen";
import Register from "./pages/User/Register";
import Login from "./pages/User/Login";
import Dashboard from "./pages/User/Dasboard/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventListScreen />} />
        <Route path="/event/:id" element={<EventDetailScreen />} />
        <Route path="/create" element={<CreateEventScreen />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
