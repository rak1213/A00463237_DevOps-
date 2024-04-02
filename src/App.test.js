import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import List from './components/List';
import Item from './components/item'; // If the filename is actually 'item.js'



describe('App component tests', () => {

// 1. Test that the App Component Renders Correctly
test('renders App component with menu and image', () => {
  render(<App />);
  
  // Check for Hello Canada heading
  expect(screen.getByText('Hello Canada')).toBeInTheDocument();
  
  // Check for Canada flag image
  expect(screen.getByAltText("Canada's Flag")).toBeInTheDocument();
  
  // Check for menu items
  expect(screen.getByText('Provinces')).toBeInTheDocument();
  expect(screen.getByText('Territories')).toBeInTheDocument();
});


// 2. Test Menu Interaction of Territories
test('menu interaction updates on click of Territories', async () => {
  render(<App />);
  await new Promise(resolve => setTimeout(resolve, 2000)); 
  
  fireEvent.click(screen.getByText('Territories'));
  
  await new Promise(resolve => setTimeout(resolve, 2000)); 
 
  expect(screen.getByText('Yukon')).toBeInTheDocument();

});

// 3. Test Item Component Toggle show capital button
test('Item component button toggles capital display',async () => {
  render(<App />);
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  
  // const toggleButton = screen.getByText('Show Capital')[1];
  const toggleButtons = document.querySelectorAll('.btn-capital-show');
  const toggleButton = toggleButtons[1];

  fireEvent.click(toggleButton);
  
  // Check that the capital is shown
  expect(screen.getByText('Quebec City')).toBeInTheDocument();
  
  // Click again to hide the capital
  fireEvent.click(toggleButton);
  
  // Check that the capital is no longer displayed
  expect(screen.queryByText('Quebec City')).not.toBeInTheDocument();
});


// 4. Test Menu Interaction of Provinces after clicking Territories
test('menu interaction updates on click of Provinces', async () => {
  render(<App />);
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  
  fireEvent.click(screen.getByText('Territories'));
  
  await new Promise(resolve => setTimeout(resolve, 1000)); 

  fireEvent.click(screen.getByText('Provinces'));
 
  await new Promise(resolve => setTimeout(resolve, 1000)); 

  expect(screen.getByText('Ontario')).toBeInTheDocument();

});



// 5. Test that Fetching Data Updates State
test('fetching data updates state with provinces', async () => {
  const fakeData = [{ name: 'Alberta', capital: 'Edmonton', flagUrl: '/alberta-flag.svg' }];
  global.fetch = jest.fn().mockImplementation(() => 
    Promise.resolve({ json: () => Promise.resolve(fakeData) })
  );

  render(<App />);
  
  // Wait for the fake data to be set
  await waitFor(() => expect(screen.getByText('Alberta')).toBeInTheDocument());
  
  // Clean up mock to prevent leak
  global.fetch.mockClear();
  delete global.fetch;
});

});