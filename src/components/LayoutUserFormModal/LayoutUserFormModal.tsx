import { projectName } from '@/config/config'
import { AqModal, AqModalProps } from '@components/AqModal/AqModal'
import React from 'react'
import './LayoutUserFormModal.scss'

interface LayoutUserFormModalProps extends AqModalProps {
    aside?: React.ReactNode
}

const LayoutUserFormModal: React.FC<LayoutUserFormModalProps> = ({
    aside,
    children,
    ...rest
}) => {
    return (
        <AqModal {...rest} className="layout-user-form-modal">
            <aside className="aside">
                {aside ? (
                    aside
                ) : (
                    <div className="default">
                        <h2 className="aside-h">欢迎使用</h2>
                        {projectName}
                    </div>
                )}
            </aside>
            <section className="form">{children}</section>
        </AqModal>
    )
}

export default LayoutUserFormModal
