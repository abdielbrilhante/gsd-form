import React, { Component } from 'react'

import Fields from './Fields'
import formats from '../format'
import Feedback from '../Feedback/Feedback'

class FieldComponent extends Component {

  onChanges (value) {
    const { setFieldValue, handleChanges, item: { name, format } } = this.props
    const values = format ? formats[format](value) : value
    setFieldValue(name, values)
    handleChanges(name, values)
  }

  render () {
    const { error, item: { label, fieldClass } } = this.props
    const classes = [
      'gsd-form-field',
      fieldClass ? fieldClass : '',
      error ? 'gsd-form-error' : '',
    ].join(' ').trim()
    return (
      <div className={classes}>
        <label>{ label }</label>
        <Fields onChanges={e => this.onChanges(e)} {...this.props} />
        <Feedback errors={error} />
      </div>
    )
  }
}

export default FieldComponent
