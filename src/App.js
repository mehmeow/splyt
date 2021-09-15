import React, { useState } from 'react';
import { MapScreen, Offices } from './components';

const officesList = {
  'SG': {branch:'Singapore',coordinate:[1.285194, 103.8522982],address:'13-1 Robinson Rd, Singapore 068877'},
  'LD': {branch:'United Kingdom',coordinate:[51.5049375, -0.0964509],address:'44-46 Southwark St, London SE1 1UN, United Kingdom'}
};

function App() {
  const [selectedBranch, setBranch] = useState('LD');
  const [getTaxi, setGetTaxi] = useState(false);
  const [taxiAt, setTaxiAt] = useState('office'); // office || user
  const [count, setCount] = useState(5);

  return (
    <div className="App">
      <Offices {...{officesList, selectedBranch, setBranch, getTaxi, setGetTaxi, count, setCount}} />
      <MapScreen {...{officesList, selectedBranch, setBranch, getTaxi, setGetTaxi, count, taxiAt}} />
    </div>
  );
}

export default App;
