import { render } from '@/render';
import { Exercise } from '@/pages/Exercise';

const template = window.location.pathname.split('/').pop();

render(<Exercise template={template} />);
