type Props = {
    name: string;
    status: 'found' | 'indirect' | 'not_found';
  };
  
  function SkillBadge({ name, status }: Props) {
    return (
      <div className={`skill skill--${status}`}>
        {name}
      </div>
    );
  }
  
  export default SkillBadge;