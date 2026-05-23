export const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  name,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label className="text-[11px] uppercase tracking-widest text-text-secondary mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-brand-orange transition-all duration-300 font-light placeholder-white/30 text-base"
        {...props}
      />
    </div>
  );
};
