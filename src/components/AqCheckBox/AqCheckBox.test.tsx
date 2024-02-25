import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { generateTestCompRoute } from '@/router/Routes'
import AqCheckBox from './AqCheckBox'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <BrowserRouter>
            <BrowserRouter>{generateTestCompRoute(AqCheckBox)}</BrowserRouter>,
        </BrowserRouter>,
        div,
    )
    ReactDOM.unmountComponentAtNode(div)
})
