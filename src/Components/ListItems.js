import HostessItem from "../HostessItem";
import { useEffect } from "react";
import { useLazyQuery, useQuery, updateQuery, useSubscription } from '@apollo/client';
import gql from 'graphql-tag';



const HOSTESS_BOOKED = gql`
  subscription hostessBooked {
    hostessBooked {
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

function hostessNotFound(props, h) {
    const notAMatch = (curr) => h.name !== curr.name;
    const noMatchFound = props.requestedHostesses.every(notAMatch);
    return noMatchFound;
}


export default function ListItems({ props }) {
    function subscribeToHostessBookings(){
        subscribeToMore({
          document: HOSTESS_BOOKED,
          variables: {},
          updateQuery: (prev, { subscriptionData }) => {


            if (!subscriptionData.data){
                return prev;
            }
            return Object.assign({}, prev, {
                merge(existing, incoming) {
                    return [...existing, ...incoming];
                  },
            });

          }
        })
      }

    useEffect(() => subscribeToHostessBookings(), []);

    const client = props.client;

    const { data,
        loading,
        error,
        subscribeToMore } = useQuery(gql
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
        `, { client});


    if (loading) return <p>Loading ...</p>;
    if (error) return `Error! ${error.message}`;


    const firstRender = props.ref.current;


    if (firstRender) {
        props.ref.current = false;
        props.setCurrentHostess(data.hostesses[0]);

    }


    const allHostesses = data.hostesses.map(h =>
        <HostessItem hostess={h}
            hoverHostess={(value) => {
                if (!firstRender) {
                    props.setCurrentHostess(value);
                }
            }}
            requestHostess={
                (value) => {
                    if (hostessNotFound(props, value) === false) {
                        props.setRequestedHostesses(props.requestedHostesses.filter(o => o.name !== value.name));
                    } else if (props.requestedHostesses.length === 2) {
                        alert("You cannot request anyone else.");
                    } else if (h.bookingStatus === 1){
                        alert("This hostess has already been booked.");
                    }
                    else {
                        props.setRequestedHostesses([value, ...props.requestedHostesses]);
                    }
                }
            }
            client={client}
        />
    );
    return (
        <ul>{allHostesses}</ul>);
}

