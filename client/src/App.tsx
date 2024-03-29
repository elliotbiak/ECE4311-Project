import React, { useState } from 'react';
import './App.css';
import { Button, TextField, Typography, Container } from '@mui/material';
import { server_link } from "./constants"

interface AuthenticationResults {
  result: boolean
  id: number
  message: string
}

function App() {
  
  const [username, setUsername] = useState<string>("test_name");
  const [password, setPassword] = useState<string>("test_pass");
  const [auth, setAuth] = useState<boolean>(false);
  
  const fileInput = React.createRef<HTMLInputElement>();
  const [photo, setPhoto] = useState("");

  // Test authentication from fields
  const submit_authentication = () => {
    // Construct URL params
    let credentials = new URLSearchParams();
    credentials.append("username", username);
    credentials.append("password", password);

    // Send authentication credentials
    const postData = async () => {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: credentials
        };
        const response = await fetch(server_link + '/authenticate', requestOptions);
        const json: AuthenticationResults =  await response.json();
        setAuth(json.result);
        // Do something with the ID and Message here
    }
    postData();
  }

  // Submit photo when read in
  const submit_photo = () => {
    // Construct URL params with photo
    let credentials = new URLSearchParams();
    credentials.append("username", username);
    credentials.append("password", password);
    credentials.append("image", photo);

    // Send authentication credentials
    const postData = async () => {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: credentials
        };
        const response = await fetch(server_link + '/file', requestOptions);
        console.log(response);
    }
    postData();
  }

    // Create User Button Function
    const create_user = () => {
      // Goal: Write code to submit a new user to the database at http://localhost:55657/user 
      // Note: You can hard coded link or the server_link + '/user' notation
      // Steps if you need help
      // 1. Make a new button next to the login button (<Button ... >Create User </Button>)
      // 2. Connect the click functionality of that button to call this function
      // 3. Make a POST request to the endpoint and look at the response (see submit_authentication function)
      // Optional: Look at the different responses if user is already existing or if its entirely a new user, and do something with it


    }


  // Display client photo
  async function displayPhoto() {
    if (fileInput.current?.files == null) return null;
    const file: File | null = fileInput?.current?.files[0]
      ? fileInput.current.files[0]
      : null;
    if (file == null) return null;
    let reader = new FileReader();
    reader.readAsDataURL(file);

    console.log("set");
    reader.onload = async () => {
      setPhoto(reader.result as string);
      console.log(reader.result as string);
    };
  }

  return (
    <div className="App">
      <header className="App-header">
      <Typography variant="h4" justifySelf={"center"} color="primary">
                Server Logins
              </Typography>
      <TextField id="standard-basic" sx={{pb:2.5}} type="text" label="Username" color="primary" variant="filled"  defaultValue="test_name"
        onChange={event => {
          const { value } = event.target;
          setUsername(value);
        }}
      />
      <Typography variant="h5" justifySelf={"center"} color="primary">
        Welcome {username}!
      
      </Typography>
      <br/>
      <TextField id="standard-basic" sx={{pb:2.5}} type="text" label="Password" color="primary" variant="filled" defaultValue="test_pass"
        onChange={event => {
          const { value } = event.target;
          setPassword(value);
        }}
      />
      <Typography variant="h5" justifySelf={"center"} color="primary">
        Your password: {password}!
      
      </Typography>
    <Button  color="primary" variant="contained"   onClick={() => {
      submit_authentication();
    }}>Login</Button>
    
      <Typography variant="h5" justifySelf={"center"} color="primary">
        {
          auth?
          <>
          You have been authenticated
            <br/>
          File upload here
          Show current file that is uploaded from server
          <br/>
          <Container>
            {photo != "" ? <img src={photo}/> : <></>}

            </Container>
            <input onChange={displayPhoto} type="file" ref={fileInput} name="upload_file"/>
            <Button 
            color="primary" variant="contained" 
            onClick={() => {
              if(fileInput) 
              {
                console.log(fileInput);
                submit_photo();
              }
            }}>Submit file</Button>
          </>
          
          :
          <>You are not authenticated</>
        }
      </Typography>


      </header>
    </div>
  );
}

export default App;
