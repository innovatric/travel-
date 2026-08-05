import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../common/Input';

export default function PasswordInput({
  label = 'Password',
  error,
  value,
  onChange,
  name = 'password',
  placeholder = 'Enter your password',
  autoComplete = 'current-password',
  id,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        id={id || name}
        label={label}
        type={visible ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        error={error}
        className="pr-12"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-[2.125rem] rounded-lg p-1 text-text-muted transition-colors hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
