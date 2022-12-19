import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";

const Home = () => {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/user-in-room");
      const data = await res.json();

      setRoomCode(data.code);
    };

    checkUser();
  }, []);

  if (roomCode) {
    navigate(`room/${roomCode}`);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography variant="h3" component="h3">
          House Party
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" to="/join" component={Link}>
            Join a Room
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default Home;
