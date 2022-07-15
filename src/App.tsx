import { Player } from "@remotion/player";
import { useEffect, useState } from "react";
import './App.css';
import { Bird } from "./bird";

function App() {

  const [color1, setColor1] = useState<string>('#777777')
  const [color2, setColor2] = useState<string>('#333333')
  const [name, setName] = useState<string>('Anónimo')

  useEffect(() => {
    name === '' ? setName('Anónimo') : setName(name)
  }, [name])


  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Player
        component={Bird}
        durationInFrames={150}
        compositionWidth={605}
        compositionHeight={720}
        fps={30}
        autoPlay
        loop
        inputProps={{ color1: color1, color2: color2, name: name }}
      />
      <div className="colorPicker1" style={{ marginTop: '20px', display: 'flex', gap: '15px', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5em', fontWeight: '600' }}>Color 1</span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#FF33CC', cursor: 'pointer' }} onClick={() => setColor1('#FF33CC')}></span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#33CCFF', cursor: 'pointer' }} onClick={() => setColor1('#33CCFF')}></span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#FFBB00', cursor: 'pointer' }} onClick={() => setColor1('#FFBB00')}></span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#FF0000', cursor: 'pointer' }} onClick={() => setColor1('#FF0000')}></span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#22FF00', cursor: 'pointer' }} onClick={() => setColor1('#22FF00')}></span>
      </div>
      <div className="colorPicker2" style={{ marginTop: '20px', display: 'flex', gap: '15px', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5em', fontWeight: '600' }}>Color 2</span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#FF33CC', cursor: 'pointer' }} onClick={() => setColor2('#FF33CC')}></span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#33CCFF', cursor: 'pointer' }} onClick={() => setColor2('#33CCFF')}></span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#FFBB00', cursor: 'pointer' }} onClick={() => setColor2('#FFBB00')}></span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#FF0000', cursor: 'pointer' }} onClick={() => setColor2('#FF0000')}></span>
        <span style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#22FF00', cursor: 'pointer' }} onClick={() => setColor2('#22FF00')}></span>
      </div>
      <input style={{ marginTop: '20px', fontFamily: 'Inter, sans-serif', fontSize: '1.5em', height: '40px', width: 'auto', border: 'none', borderRadius: '10px', backgroundColor: '#EEE', padding: '0px 10px' }} placeholder='Tu nombre' onChange={(e) => setName(e.target.value)}></input>
    </div>
  );
}

export default App;
