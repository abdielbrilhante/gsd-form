import React, { Component } from 'react'
import { Formik } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'

import { FieldComponent } from '../Fields'
import schema from '../validate'

const formatData = data =>
  Object.entries(data).reduce((res, fieldData) =>
    res.concat({
      ...fieldData.pop(),
      field: fieldData.shift()
    }), [])

const formInitialValues = data =>
  Object.keys(data).reduce((acc, item) => ({
    ...acc,
    [item]: data[item].value
  }), {})

class InnerForm extends Component {

  onSubmit (e) {
    e.preventDefault()
    if (this.refs.recaptcha) {
      this.refs.recaptcha.execute()
    } else if (!this.props.data.recaptcha) {
      this.props.submitForm()
    }
  }

  formatValuesSubmit (recaptcha) {
    const params = {
      ...this.props.values,
      recaptcha,
    }
    this.props.setValues(params)
    this.props.submitForm()
    this.refs.recaptcha.reset()
  }

  render () {
    const {
      values,
      errors,
      touched,
      isSubmitting,
      data
    } = this.props

    return (
      <form className="gsd-form">
        {
          formatData(data.form.fields).map((item, key) =>
            <FieldComponent
              key={key}
              item={item}
              value={values[item.field]}
              error={touched[item.field] && errors[item.field]}
              {...this.props}
            />
          )
        }
        <button
          className="gsd-form-button"
          type="submit"
          disabled={isSubmitting}
          onClick={e => this.onSubmit(e)}
        >
          { data.form.submitButtonText || 'Submit' }
        </button>
        {
          data.recaptcha && data.recaptcha.sitekey &&
          <ReCAPTCHA
            ref="recaptcha"
            size={data.recaptcha.size || 'invisible'}
            sitekey={data.recaptcha.sitekey}
            onChange={captcha => this.formatValuesSubmit(captcha)}
          />
        }
      </form>
    )
  }
}

const GsdForm = ({ data, handleSubmit, handleChanges }) => (
  data && data.form ?
    <Formik
      initialValues={{ ...formInitialValues(data.form.fields) }}
      validationSchema={schema(data.form.fields)}
      onSubmit={values => handleSubmit(values)}
      render={props =>
        <InnerForm handleChanges={handleChanges} data={data} {...props} />
      }
    /> : <div />
)

export default GsdForm
