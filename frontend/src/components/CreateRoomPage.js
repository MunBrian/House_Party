import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const CreateRoomPage = ({ update, guestCanPause, votesToSkip, roomCode }) => {
  const navigate = useNavigate();

  const defaultValue = {
    guestCanPause: true,
    votesToSkip: 2,
    update: false,
    roomCode: null,
  };

  const [initialState, setInitialState] = useState({
    guestCanPause: defaultValue.guestCanPause,
    votesToSkip: defaultValue.votesToSkip,
    success: "",
    error: "",
  });

  const handleVotesChange = (e) => {
    setInitialState((prevState) => ({
      ...prevState,
      votesToSkip: e.target.value,
    }));
  };

  const handleGuestCanPauseChange = (e) => {
    setInitialState((prevState) => ({
      ...prevState,
      guestCanPause: e.target.value === "true" ? true : false,
    }));
  };

  const handleCreateRoom = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        votes_to_skip: initialState.votesToSkip,
        guest_can_pause: initialState.guestCanPause,
      }),
    };

    const res = await fetch("/api/create-room", requestOptions);
    const data = await res.json();

    navigate(`/room/${data.code}`);
  };

  const handleUpdateRoom = async () => {
    setInitialState((prevState) => ({
      ...prevState,
      roomCode: roomCode,
    }));
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        votes_to_skip: initialState.votesToSkip,
        guest_can_pause: initialState.guestCanPause,
        code: roomCode,
      }),
    };

    const res = await fetch("/api/update-room", requestOptions);
    const data = await res.json();

    if (res.status === 200) {
      setInitialState((prevState) => ({
        ...prevState,
        success: "Room updated successfully",
      }));
    } else {
      setInitialState((prevState) => ({
        ...prevState,
        error: "Error updating room",
      }));
    }

    //updateRoomCallBack();
  };

  return (
    <>
      {update ? (
        <>
          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <Collapse
                in={initialState.error != "" || initialState.success != ""}
              >
                {initialState.success != "" ? (
                  <Alert
                    severity="success"
                    onClose={() => {
                      setInitialState((prev) => ({
                        ...prev,
                        success: "",
                      }));
                    }}
                  >
                    {initialState.success}
                  </Alert>
                ) : (
                  <Alert
                    severity="error"
                    onClose={() => {
                      setInitialState((prev) => ({
                        ...prev,
                        error: "",
                      }));
                    }}
                  >
                    {initialState.error}
                  </Alert>
                )}
              </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography component="h4" variant="h4">
                Update Room
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <FormControl component="fieldset">
                <FormHelperText>
                  <div align="center">Guest Control of Playback State</div>
                </FormHelperText>
                <RadioGroup
                  row
                  defaultValue={guestCanPause.toString()}
                  onChange={handleGuestCanPauseChange}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio color="primary" />}
                    label="Play/Pause"
                    labelPlacement="bottom"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio color="secondary" />}
                    label="No control"
                    labelPlacement="bottom"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
              <FormControl>
                <TextField
                  onChange={handleVotesChange}
                  required={true}
                  type="number"
                  defaultValue={votesToSkip}
                  inputProps={{
                    min: 1,
                    style: { textAlign: "center" },
                  }}
                />
                <FormHelperText>
                  <div align="center">Votes required to skip song.</div>
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                color="primary"
                variant="contained"
                onClick={handleUpdateRoom}
              >
                Update Room
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <Collapse
                in={initialState.error != "" || initialState.success != ""}
              >
                {initialState.success}
              </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography component="h4" variant="h4">
                {update ? "Update Room" : "Create a Room"}
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <FormControl component="fieldset">
                <FormHelperText>
                  <div align="center">Guest Control of Playback State</div>
                </FormHelperText>
                <RadioGroup
                  row
                  defaultValue={initialState.guestCanPause.toString()}
                  onChange={handleGuestCanPauseChange}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio color="primary" />}
                    label="Play/Pause"
                    labelPlacement="bottom"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio color="secondary" />}
                    label="No control"
                    labelPlacement="bottom"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
              <FormControl>
                <TextField
                  onChange={handleVotesChange}
                  required={true}
                  type="number"
                  defaultValue={initialState.votesToSkip}
                  inputProps={{
                    min: 1,
                    style: { textAlign: "center" },
                  }}
                />
                <FormHelperText>
                  <div align="center">Votes required to skip song.</div>
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                color="primary"
                variant="contained"
                onClick={handleCreateRoom}
              >
                Create a Room
              </Button>
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                color="secondary"
                variant="contained"
                to="/"
                component={Link}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default CreateRoomPage;
