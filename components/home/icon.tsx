import AIcon from '../svg/landing-page/core/a';
import BIcon from '../svg/landing-page/core/b';
import CIcon from '../svg/landing-page/core/c';
import DIcon from '../svg/landing-page/core/d';
import EIcon from '../svg/landing-page/core/e';

export default function RenderIcon(code: string) {
  switch (code) {
    default:
      return null;
  }
}

export function RenderCoreIcon(code: string) {
  switch (code) {
    case '1':
      return <AIcon />;
    case '2':
      return <BIcon />;
    case '3':
      return <CIcon />;
    case '4':
      return <DIcon />;
    case '5':
      return <EIcon />;

    default:
      return null;
  }
}
