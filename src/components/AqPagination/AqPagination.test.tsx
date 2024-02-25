import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { generateTestCompRoute } from '@/router/Routes'
import AqPagination from './AqPagination'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <BrowserRouter>
            <BrowserRouter>{generateTestCompRoute(AqPagination)}</BrowserRouter>
            ,
        </BrowserRouter>,
        div,
    )
    ReactDOM.unmountComponentAtNode(div)
})
