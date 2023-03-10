import './Hostess.css';
import { useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}


const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

// const HOSTESS_BOOKED = gql`
//   subscription OnHostessBooked {
//     hostessBooked {
//       id
//     }
//   }
// `;


function HostessItem({ hostess, hoverHostess, requestHostess, client }) {


//   const { subscriptionData, subscriptionLoading } = useSubscription(
//     HOSTESS_BOOKED,
//     { client }
// );


  var bookingStatus = hostess.bookingStatus;
  // if booked, gray out, else it's black
  const stylesObj = {
    backgroundColor: "#000000"
  };

  if (bookingStatus === 1){
    stylesObj.backgroundColor = '#808080';
  } 

  return (
    <li key={hostess.id} className="card" style = {stylesObj} onClick={() => requestHostess(hostess)} onMouseOver={() => hoverHostess(hostess)}>
      <div className="triangle"></div>
      <img id="hostess_img" src={images[hostess.imageUrl]} />
      <div className="hostess-price"><p>¥{hostess.price}</p></div>
    </li>
  );
}



export default HostessItem;