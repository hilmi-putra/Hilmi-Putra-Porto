export const Button = ({ 
  children, 
  variant = 'solid', // solid, outline, dark, light
  onClick, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 ease-out focus:outline-none';
  
  const variants = {
    solid: 'bg-white text-text-dark hover:bg-opacity-95 hover:scale-[1.02] shadow-sm',
    outline: 'border border-white/20 text-white hover:bg-white hover:text-text-dark hover:border-white hover:scale-[1.02]',
    dark: 'bg-background-darker border border-white/10 text-white hover:bg-white hover:text-text-dark hover:scale-[1.02]',
    light: 'bg-background-cream text-text-dark hover:bg-opacity-90 hover:scale-[1.02]',
  };

  const sizes = 'px-8 py-3.5 text-sm uppercase tracking-wider';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
