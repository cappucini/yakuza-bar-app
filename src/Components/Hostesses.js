// import React, { useEffect } from "react";
import {useQuery, gql} from "@apollo/client"
import HostessItem from '../HostessItem.js';
import React, { useState, useEffect } from 'react';

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
    }
  }
`;

// export default function Hostesses(){
//     console.log("HEY")
//     const {error, data, loading} = useQuery(GET_HOSTESSES);

//       if (loading) return 'Loading...';
//       if (error) return `Error! ${error.message}`;
        
//     console.log(data.hostesses);
//    if (loading){

//    }
//     // return <div></div>;
//     return data.hostesses;
//     ;
// }


