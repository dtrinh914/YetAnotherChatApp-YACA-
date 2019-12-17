import React from 'react';
import { render } from '@testing-library/react';
import ChatInput from './ChatInput';

test('renders ChatInput', () => {
  const input = render(<ChatInput />);
  expect(input.toJSON()).toMatchSnapsot();
});
