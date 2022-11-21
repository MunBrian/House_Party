import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateRoomPage from "./components/CreateRoomPage";
import RoomJoinPage from "./components/RoomJoinPage";
import Room from "./components/Room";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route exact path="/room/:roomCode" element={<Room />} />
        <Route path="/join" element={<RoomJoinPage />} />
      </Routes>
    </Router>
  );
};

export default App;
