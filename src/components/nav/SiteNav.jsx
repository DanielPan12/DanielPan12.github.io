import { useLocation } from 'react-router-dom';
import PillNav from './PillNav';
import { NAV_ITEMS } from '../../config/navItems';
import './SiteNav.css';

const SiteNav = () => {
  const location = useLocation();

  return (
    <PillNav
      items={NAV_ITEMS}
      activeHref={location.pathname}
      baseColor="#c7d0dc"
      pillColor="#0f1626"
      pillTextColor="#eef2f7"
      hoveredPillTextColor="#0b1220"
      ease="power3.easeOut"
    />
  );
};

export default SiteNav;
