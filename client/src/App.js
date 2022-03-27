import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Header from './components/header';
import SecretView from './components/secretview';
import SecretList from './components/secretlist';
import { useQuery, QueryClientProvider, QueryClient } from 'react-query';
import Container from './containers/container';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='/' element={<SecretList />} />
            <Route path='/view/:url' element={<SecretView />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </QueryClientProvider>
  );
}

export default App;
