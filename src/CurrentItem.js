import './CurrentItem.css';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

function CurrentItem({item}) {
  
  const triangleStyle = {
    alignSelf: "flex-start",
    borderWidth: "0 40px 40px 0"
  };

  const largerTriangleStyle = {
    alignSelf: "flex-start",
    borderWidth: "0 60px 60px 0",
    opacity: 0.5
  };

    return(
      <div className="current-item">
          <div className="triangle" style={triangleStyle}>

            <i className="fa fa-heartbeat" aria-hidden="true"></i>
          </div>
          <div className="triangle" style={largerTriangleStyle}></div>

          <img src = {images[item.imageUrl]}/>
          <p>{item.name}</p>

          <p>Description: {item.description}</p>
          <p>Likes: {item.likes}</p>
          <p>Dislikes: {item.dislikes}</p>
          <p>Price: {item.price}</p>
          Favorites:
      </div>
    );
  }

export default CurrentItem;