import React from 'react'
import PropTypes from 'prop-types'
import { Popup } from 'devextreme-react'
import { useModal } from '../../contexts'
import { ToolbarItem } from 'devextreme-react/popup'
import { BaseModal } from './base-modal'


export const BaseEditModal = (props) => {
    const modal = useModal();

    return (
        <BaseModal modalId={props.modalId}>
            {props.children}
            { props.handleSave && <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{icon: 'save',
                    type: 'success',
                    text: 'Kaydet',
                    onClick: (e) =>  props.handleSave(e)
                }}
            />}
        </BaseModal>
  )
}

BaseEditModal.propTypes = {}

