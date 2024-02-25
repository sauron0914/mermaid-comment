import { generateTestCompRoute } from '@/router/Routes'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import PwdForm from './PwdForm'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <BrowserRouter>
            <BrowserRouter>{generateTestCompRoute(PwdForm)}</BrowserRouter>,
        </BrowserRouter>,
        div,
    )
    ReactDOM.unmountComponentAtNode(div)
})
