import React, { useState } from 'react';
import Grid from '@/components/grid/Grid';
import { ITheme, LIGHT_THEME, ThemeContext } from '@/context/theme';
import FloatingContainer from '@/components/floating-container/FloatingContainer';
import GridSelector from '@/components/grid-selector/GridSelector';
import ThemeToggle from '@/components/theme-toggler/ThemeToggle';
import '@/utils/prototype-extensions/array/implementation';
import '@/utils/prototype-extensions/string/implementation';

const columnOptionsArray = [1, 2];

function App() {
  const [theme, setTheme] = useState<ITheme>(LIGHT_THEME);
  const [columnsNumber, setColumnsNumber] = useState(1);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="App">
        <FloatingContainer>
          <div>
            {columnOptionsArray.map((columnOption) => (
              <GridSelector
                key={columnOption}
                colNumber={columnOption}
                onClick={() => setColumnsNumber(columnOption)}
              />
            ))}
          </div>

          <ThemeToggle />
        </FloatingContainer>

        <Grid columns={columnsNumber} />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
