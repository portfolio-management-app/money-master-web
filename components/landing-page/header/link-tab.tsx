import {Tab} from '@mui/material'

interface LinkTabProps {
    label?: string;
    href?: string;
  }
  
 export default  function LinkTab(props: LinkTabProps) {
    return (
      <Tab
        component="a"
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          event.preventDefault();
        }}
        {...props}
      />
    );
  }