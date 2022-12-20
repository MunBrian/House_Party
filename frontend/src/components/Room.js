import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";

const Room = () => {
  const params = useParams();
  const navigate = useNavigate();

  let roomCode = params.roomCode;

  const [initialState, setInitialState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });

  const handleLeaveRoom = async () => {
    const requestOptions = {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
    };
    await fetch("/api/leave-room", requestOptions);

    //redirect to home page
    navigate("/");
  };

  useEffect(() => {
    const getRoomDetails = async () => {
      const res = await fetch(`/api/get-room?code=${roomCode}`);
      const data = await res.json();

      if (res.status == 404) {
        navigate("/");
      } else {
        //update state
        setInitialState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      }
    };

    return () => getRoomDetails();
  }, []);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {initialState.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest can Pause: {initialState.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {initialState.isHost.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Room;
