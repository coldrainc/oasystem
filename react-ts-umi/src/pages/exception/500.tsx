import React from 'react';
import Exception from '@/components/exception';
import { formatMessage } from 'umi-plugin-react/locale';
import { Link } from 'umi';

const Exception500: React.FC = () => (
  <Exception
    type="500"
    desc={formatMessage({ id: 'app.exception.description.500'})}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back'})}
  />
)

export default Exception500;