import React from 'react';
import DateDivider from '../components/DateDivider';
import {render, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

const testDate = "Wed January 22, 2020";

test('should match snapshot', ()=>{
    const {container} = render(<DateDivider date={testDate} />)
    expect(container).toMatchSnapshot();
});

test('should display the test date', ()=>{
    const {container} = render(<DateDivider date={testDate} />)
    expect(container).toHaveTextContent(testDate);
})