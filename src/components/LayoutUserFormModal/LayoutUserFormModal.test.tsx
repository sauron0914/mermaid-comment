import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import LayoutUserFormModal from './LayoutUserFormModal'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <BrowserRouter>
            <LayoutUserFormModal onClose={() => ''} visible />
        </BrowserRouter>,
        div,
    )
    ReactDOM.unmountComponentAtNode(div)
})
