import './App.css';
import HostessItem from './HostessItem.js';
import React, { useReducer, useState, useEffect, useRef } from 'react';
import CurrentItem from './CurrentItem.js';
import { ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink, useMutation, from, useSubscription } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useQuery, useLazyQuery, gql } from "@apollo/client"
import Login from './Components/Login';
import ListItems from './Components/ListItems';
import useToken from './Components/UseToken';
import { onError } from "@apollo/client/link/error";


const httpLink = new HttpLink({
  uri: 'http://' + window.location.hostname + ':4000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://' + window.location.hostname + ':4000/graphql',
}));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

console.log(splitLink)
const client = new ApolloClient({
  link: splitLink,
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
      bookingStatus
    }
  }
`;

// Define mutation
const BOOK_HOSTESS = gql`
  mutation bookHostess ($id: Int!) {
    bookHostess(id: $id) {
      message
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

  const [allHostesses, setAllHostesses] = useState([]);

  const [requestedHostesses, setRequestedHostesses] = useState([]);
  const [currentHostess, setCurrentHostess] = useState([]);
  // create a custom hook that can be called, rather than
  // const [token, setToken] = useState(getToken());

  const { token, setToken } = useToken();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");


  const [bookHostess, { data, loading, error }] = useMutation(BOOK_HOSTESS, { client: client });


  
  

  useEffect(() => {
    printRequestedHostesses();
    if (requestedHostesses.length > 2 || requestedHostesses.length < 0) {
      throw new Error("Hostesses list cannot be > 2 or < 0");
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
    allHostesses: allHostesses,
    setAllHostesses: setAllHostesses,
    // token: token,
    // saveToken: saveToken,
    username: username,
    setUserName: setUserName,
    password: password,
    setPassword: setPassword
  };


  function printRequestedHostesses() {
    console.log("State change with length " + requestedHostesses.length);
    requestedHostesses.forEach(function (arrayItem) {
      var x = arrayItem;
      console.log(x);
    });
  }



  function handleConfirmHostesses() {
    if (requestedHostesses.length < 2) {
      alert("Please select 2 hostesses.")
    }

    requestedHostesses.forEach(function (arrayItem) {
      var x = arrayItem;
      bookHostess({ variables: { id: parseInt(x.id) } });

    });
  }


  /**
  * Clears all hostesses
  */
  function handleClearHostesses() {
    setRequestedHostesses([]);
  }



  function CartSum() {
    return <div className="cart-sum"><img src={images["blank.png"]}></img>
      <p>{requestedHostesses.length}/2</p>
    </div>;

  }


  function CheckTotal() {
    const sum = requestedHostesses.reduce((accumulator, object) => {
      return accumulator + object.price;
    }, 0);
    return (<div className="check"><p className="check-label">Check:</p> <p id="check-val">{sum}</p></div>);
  }


  if (!token) {
    return <Login setToken={setToken} setUserName={setUserName} setPassword={setPassword} username={username} password={password} />
  } else
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header>
            <link rel="stylesheet" href="../../font-awesome-4.7.0/css/font-awesome.min.css" />
          </header>
          <div className="full-view">
            <div className="left_view">
              <div id="header">
                <h1>Please request a Hostess.</h1>
              </div>
              <div className="menu_container">
                <ListItems props={listItemsProps} />
              </div>

              <button id="clear-hostesses" onClick={() => handleClearHostesses()}>Clear Hostesses?</button>
              <button id="confirm-hostesses" onClick={() => handleConfirmHostesses()}>Confirm Hostesses?</button>
              <div className="horizontal-totals">
                <CartSum />
                <CheckTotal />
              </div>

            </div>
            <CurrentItem item={currentHostess} />
          </div>

        </div>
      </ApolloProvider>
    );
}


export default App;
