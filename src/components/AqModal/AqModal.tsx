import {
    ConfirmModal,
    ConfirmModalProps,
    Modal,
    ModalProps,
    OverlayRefProps,
} from '@auraxy/react-modal'
import React, { useEffect, useRef } from 'react'
import './AqModal.scss'

function useVisible(visible: boolean) {
    const ref = useRef<OverlayRefProps>(null)

    useEffect(() => {
        if (visible) ref.current!.open()
        else ref.current!.close()
    }, [visible])

    return ref
}

export interface AqModalProps extends ModalProps {
    visible: boolean
}

export const AqModal: React.FC<AqModalProps> = ({ visible, ...rest }) => {
    const ref = useVisible(visible)

    return <Modal ref={ref} {...rest} />
}

export interface AqConfirmModalProps extends ConfirmModalProps {
    visible: boolean
}

export const AqConfirmModal: React.FC<AqConfirmModalProps> = ({
    visible,
    ...rest
}) => {
    const ref = useVisible(visible)

    return <ConfirmModal ref={ref} {...rest} />
}
