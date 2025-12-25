import { InputHTMLAttributes, ReactNode } from 'react'
import '../App.css'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: ReactNode
}

export function FormField({ label, hint, className = '', ...props }: FormFieldProps) {
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      <input className={`form-input ${className}`.trim()} {...props} />
      {hint && <small className="form-hint">{hint}</small>}
    </label>
  )}
