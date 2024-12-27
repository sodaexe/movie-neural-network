import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import MovieNeuralNetwork from './MovieNeuralNetwork.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="m-auto">
      <MovieNeuralNetwork />
    </main>
  </StrictMode>
);
