// add custom dynamic background as starwars
import JobForm from './JobForm';
import AppTheme from './theme/AppTheme';
import Space from './Space.js';

function App(props) {
  return (
    <AppTheme {...props}>
      <div className="App">
        <Space>
          <JobForm />
        </Space>
      </div>
    </AppTheme>
  );
}

export default App;
