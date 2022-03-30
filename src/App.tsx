import React, { useState } from 'react';
import AnnotationContainer from './components/annotation-container/AnnotationContainer';
import Grid from './components/grid/Grid';
import LayoutSelector from './components/layout-selector/LayoutSelector';

function App() {
  const [columnsNumber, setColumnsNumber] = useState(1);

  return (
    <div className="App" style={{ color: 'white', fontSize: '18px' }}>
      <LayoutSelector
        columnOptionsArray={[1, 2]}
        onLayoutChange={(columnOption) => setColumnsNumber(columnOption)}
      />

      <Grid columns={columnsNumber}>
        {[...Array(columnsNumber).keys()].map((el, index) => (
          <AnnotationContainer key={index} />
        ))}
      </Grid>
    </div>
  );
}

export default App;
