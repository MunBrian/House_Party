import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Room = () => {
  const params = useParams();

  let roomCode = params.roomCode;

  const [initialState, setInitialState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });

  const getRoomDetails = async () => {
    const res = await fetch(`/api/get-room?code=${roomCode}`);
    const data = await res.json();

    //update state
    setInitialState({
      votesToSkip: data.votes_to_skip,
      guestCanPause: data.guest_can_pause,
      isHost: data.is_host,
    });
  };

  useEffect(() => {
    getRoomDetails();
  }, []);

  return (
    <div>
      <h1>{roomCode}</h1>
      <p>Guest can Pause: {initialState.guestCanPause.toString()}</p>
      <p>Votes: {initialState.votesToSkip}</p>
      <p>Host: {initialState.isHost.toString()}</p>
    </div>
  );
};

export default Room;
