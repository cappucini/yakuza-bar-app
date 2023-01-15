import HostessItem from "../HostessItem";
import { useLazyQuery , useQuery} from '@apollo/client';
import gql from 'graphql-tag';

function hostessNotFound(props, h){
    const notAMatch = (curr) => h.name !== curr.name;
    const noMatchFound = props.requestedHostesses.every(notAMatch);
    return noMatchFound;
  }
 
export default function ListItems({props}){

    const client = props.client;
    const { loading, error, data} = useQuery(gql
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
        `, { client });

    if (loading) return <p>Loading ...</p>;
    if (error) return `Error! ${error.message}`;

    const firstRender = props.ref.current;

    if (firstRender) {
        props.ref.current = false;
      props.setCurrentHostess(data.hostesses[0]);
    } 
    
      const allHostesses = data.hostesses.map( h =>
        <HostessItem hostess = {h} 
        hoverHostess = {(value) => {
          if (!firstRender){
            props.setCurrentHostess(value);
          console.log("setting current hostess to " + value.name);
          }
        }}
        requestHostess= {
          (value) => {
          if (hostessNotFound(props, value) === false){
            props.setRequestedHostesses(props.requestedHostesses.filter(o => o.name !== value.name));
          } else if (props.requestedHostesses.length === 2){
            alert ("You cannot request anyone else.");
          } 
            else {
                props.setRequestedHostesses([value, ...props.requestedHostesses]);
            }
          }
        }
      />
    );
      return (
      <ul>{allHostesses}</ul>);
  }

