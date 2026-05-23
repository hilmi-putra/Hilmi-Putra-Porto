export const Card = ({ 
  title, 
  description, 
  category, 
  imageUrl, 
  projectUrl, 
  githubUrl,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`glass rounded-2xl overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${className}`}
      {...props}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center text-text-secondary text-sm">
            Mockup Placeholder
          </div>
        )}
        <div className="absolute top-4 left-4 bg-brand-orange text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors duration-300">
          {title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2 font-light mb-6">
          {description}
        </p>
        
        <div className="flex items-center gap-4">
          {projectUrl && (
            <a 
              href={projectUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs uppercase tracking-wider font-semibold border-b border-white/20 pb-0.5 text-white hover:border-brand-orange hover:text-brand-orange transition-all"
            >
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs uppercase tracking-wider font-semibold border-b border-white/20 pb-0.5 text-text-secondary hover:border-white hover:text-white transition-all"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
