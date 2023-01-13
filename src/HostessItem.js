import './Hostess.css';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

function HostessItem({hostess, hoverHostess, requestHostess}) {
 
    
  return(
      // <div className="card" onClick = {()=>requestHostess(hostess)} onMouseOver ={() => hoverHostess(hostess)}>
        <li key={hostess.id}  className="card" onClick = {()=>requestHostess(hostess)} onMouseOver ={() => hoverHostess(hostess)}>
          <div className="triangle"></div>
          <img id="hostess_img" src = {images[hostess.imageUrl]}/>
          <div className="hostess-price"><p>¥{hostess.price}</p></div>
        </li>
        // </div>
    );
  }

export default HostessItem;