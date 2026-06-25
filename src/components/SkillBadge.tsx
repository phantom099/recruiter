type Props = {
    name: string;
    status: 'found' | 'indirect' | 'not_found';
    className?: string;
  };
  
  function SkillBadge({ name, status, className }: Props) {
    return (
      <div 
      className={`skill skill--${status} ${className ?? ''}`}
      role="status"
      aria-label={`Skill ${name} is ${status}`}>
        {name}
      </div>
    );
  }
  
  export default SkillBadge;