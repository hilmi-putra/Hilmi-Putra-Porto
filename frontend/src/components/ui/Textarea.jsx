export const Textarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  name,
  rows = 4,
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
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-brand-orange transition-all duration-300 font-light placeholder-white/30 text-base resize-none"
        {...props}
      />
    </div>
  );
};
