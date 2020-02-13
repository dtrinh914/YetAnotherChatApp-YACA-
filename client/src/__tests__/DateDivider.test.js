import React from 'react';
import DateDivider from '../components/DateDivider';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const testDate = "Wed January 22, 2020";

describe('<DateDivider/> with testDate', () =>{
    const {container} = render(<DateDivider date={testDate} />);

    it('should match snapshot', ()=>{
        expect(container).toMatchSnapshot();
        expect(container).toHaveTextContent(testDate);
    });
});

