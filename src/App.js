import './App.css';
// import hostess_data from './hostess_data.js';
import HostessItem from './HostessItem.js';
import React, { useState, useEffect, useRef } from 'react';
import CurrentItem from './CurrentItem.js';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import {useQuery, gql} from "@apollo/client"
import Login from './Components/Login';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const GET_HOSTESSES = gql
`query {
    hostesses{
      id
      name
      price
      likes
      dislikes
      description
      imageUrl
      hostessClub
    }
  }
`;



function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}


const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

function App() {
  const ref = useRef(true);
  const [requestedHostesses, setRequestedHostesses] = useState([]);
  const [currentHostess, setCurrentHostess] = useState([]);
  const [token, setToken] = useState("");
  const [username, setUserName] = useState("asdfsdf");
  const [password, setPassword] = useState("hello");
  console.log("setUsername is " + setUserName);
  console.log("setPassword is " + setPassword);
    useEffect(() => {
      if (requestedHostesses.length > 2 || requestedHostesses.length < 0){
        throw new Error ("Hostesses list cannot be > 2 or < 0");
      }
 
    });
  

  

 
  function printRequestedHostesses(){
    console.log("State change with length " + requestedHostesses.length);
    requestedHostesses.forEach(function (arrayItem) {
      var x = arrayItem;
      console.log(x);
  });
  }
  /**
   * Select hostesses to speak to
   */
  function handleConfirmHostesses(){
    if (requestedHostesses.length<2){
      alert("Please select 2 hostesses.")
    }
  }


  function hostessNotFound(h){
    const notAMatch = (curr) => h.name !== curr.name;
    const noMatchFound = requestedHostesses.every(notAMatch);
    return noMatchFound;
  }
 
  /**
  * Clears all hostesses
  */
  function handleClearHostesses(){
    setRequestedHostesses([]); 
  }


  function ListItems(){
    const {error, data, loading} = useQuery(GET_HOSTESSES);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    console.log(data.hostesses);
    const firstRender = ref.current;

    if (firstRender) {
      ref.current = false;
      setCurrentHostess(data.hostesses[0]);
    } 
      const allHostesses = data.hostesses.map( h =>
        <HostessItem hostess = {h} 
        hoverHostess = {(value) => {
          if (!firstRender){
           setCurrentHostess(value);
          console.log("setting current hostess to " + value.name);
          }
        }}
        requestHostess= {
          (value) => {
          if (hostessNotFound(value) === false){
            setRequestedHostesses(requestedHostesses.filter(o => o.name !== value.name));
          } else if (requestedHostesses.length === 2){
            alert ("You cannot request anyone else.");
          } 
            else {
              setRequestedHostesses([value, ...requestedHostesses]);
            }
          }
        }
      />
    );
      return (
      <ul>{allHostesses}</ul>);
  }

  function CartSum(){
    return <div className="cart-sum"><img src={images["blank.png"]}></img>
    <p>{requestedHostesses.length}/2</p>
    </div>;
    
  }
  

  function CheckTotal(){
    const sum = requestedHostesses.reduce((accumulator, object) => {
      return accumulator + object.price;
    }, 0);
    return (<div className="check"><p className = "check-label">Check:</p> <p id = "check-val">{sum}</p></div>);
  }


if(!token) {
  return <Login setToken={setToken} setUserName={setUserName} setPassword={setPassword} username={username} password={password}/>
} else
  return (

    <ApolloProvider client = {client}>
    <div className="App">
          <header>
          <link rel="stylesheet" href="../../font-awesome-4.7.0/css/font-awesome.min.css"/>
          
          </header>
          <div className="full-view">
            <div className = "left_view">
              <div id="header">
                <h1>Please request a Hostess.</h1>
              </div>
              <div className="menu_container">
                <ListItems/>
              </div>

              <button id="clear-hostesses" onClick={() => handleClearHostesses()}>Clear Hostesses?</button>
              <button id = "confirm-hostesses" onClick={() => handleConfirmHostesses({requestedHostesses})}>Confirm Hostesses?</button>
              <div className="horizontal-totals">
                <CartSum/>
                <CheckTotal/>                
              </div>

            </div>
            <CurrentItem item = {currentHostess}/>

          </div>

    </div>
    </ApolloProvider>
  );
}


export default App;
