import React, { useState } from 'react';
import UploadImage from './screens/UploadImage';
import FakebookFeed from './screens/FakebookFeed';

const App = () => {
  const [images, setImages] = useState([]);
  return (
    <div className="container">
      <div className="header">
          <h2>fakebook</h2>
      </div>
      <div className="content">
        {
          images.length > 0 ?
          <FakebookFeed images={images} resetImages={() => setImages([])} />
          :
          <UploadImage setImages={setImages} />
        }
      </div>
    </div>
  );
}

export default App;
