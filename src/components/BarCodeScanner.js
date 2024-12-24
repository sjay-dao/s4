import {useState} from 'react';
import {BarcodeScanner} from '@thewirv/react-barcode-scanner';

const BarcodeScannerC = () => {
  const [data, setData] = useState('No result');

  return (
    <>
      <BarcodeScanner
        onSuccess={(text) => {setData(text); console.log("Scamned")}}
        onError={(error) => {
          if (error) {
            console.error(error.message);
          }
        }}
        onLoad={() => console.log('Video feed has loaded!')}
        containerStyle={{width: '30%'}}
      />
      <p>{data}</p>
    </>
  );
};

export default BarcodeScannerC;