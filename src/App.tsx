import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventListScreen from "./pages/EventListScreen";
import EventDetailScreen from "./pages/EventDetailScreen";
import CreateEventScreen from "./pages/CreateEventScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventListScreen />} />
        <Route path="/event/:id" element={<EventDetailScreen />} />
        <Route path="/create" element={<CreateEventScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;