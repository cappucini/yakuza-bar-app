import './App.css';
import HostessItem from './HostessItem.js';
import React, { useReducer, useState, useEffect, useRef } from 'react';
import CurrentItem from './CurrentItem.js';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import {useQuery, useLazyQuery, gql} from "@apollo/client"
import Login from './Components/Login';
import ListItems from './Components/ListItems';
import useToken from './Components/Token';

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

// function getToken() {
//   const tokenString =  sessionStorage.getItem('token');
//   const userToken = JSON.parse(tokenString);
//   return userToken?.token;
// };


function App() {

  const ref = useRef(true);
  // const [state, dispatch] = useReducer(reducer, initialState);

  const [requestedHostesses, setRequestedHostesses] = useState([]);
  const [currentHostess, setCurrentHostess] = useState([]);
  // const [token, setToken] = useState(getToken());
  const { token, setToken } = useToken();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");


    useEffect(() => {
      if (requestedHostesses.length > 2 || requestedHostesses.length < 0){
        throw new Error ("Hostesses list cannot be > 2 or < 0");
      }
    });
  
    const listItemsProps = {
      client: client,
      useQuery: useQuery,
      useLazyQuery: useLazyQuery,
      GET_HOSTESSES: GET_HOSTESSES,
      ref: ref,
      requestedHostesses: requestedHostesses,
      setRequestedHostesses: setRequestedHostesses,
      currentHostess: currentHostess,
      setCurrentHostess: setCurrentHostess,
      // token: token,
      // saveToken: saveToken,
      username: username,
      setUserName: setUserName,
      password: password,
      setPassword: setPassword
    };

 
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


 
  // function saveToken(userToken){
  //   sessionStorage.setItem('token', JSON.stringify(userToken));
  //   setToken(userToken.token);
  // }
  /**
  * Clears all hostesses
  */
  function handleClearHostesses(){
    setRequestedHostesses([]); 
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
                <ListItems props={listItemsProps} />
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
