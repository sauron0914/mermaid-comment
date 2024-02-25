import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import ClientSidebar from './ClientSidebar'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <BrowserRouter>
            <ClientSidebar />
        </BrowserRouter>,
        div,
    )
    ReactDOM.unmountComponentAtNode(div)
})
