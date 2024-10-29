import { Routes, Route } from '@solidjs/router';
import MainForm from './MainForm';
import PreviewPage from './PreviewPage';

function App() {
  return (
    <Routes>
      <Route path="/" component={MainForm} />
      <Route path="/preview" component={PreviewPage} />
    </Routes>
  );
}

export default App;