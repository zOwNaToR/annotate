import React, { useState } from 'react';
import Grid from '@/components/grid/Grid';
import LayoutSelector from '@/components/layout-selector/LayoutSelector';
import { ThemeContext, ITheme, LIGHT_THEME } from '@/context/theme';

function App() {
  const [theme, setTheme] = useState<ITheme>(LIGHT_THEME);
  const [columnsNumber, setColumnsNumber] = useState(1);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="App">
        <LayoutSelector
          columnOptionsArray={[1, 2]}
          onLayoutChange={(columnOption) => setColumnsNumber(columnOption)}
        />

        <Grid columns={columnsNumber} />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
