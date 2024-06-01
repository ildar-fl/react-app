import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

const Title = styled.h1<SpaceProps>`
  font-size: 28px;
  font-weight: 600;
  padding: 0;
  margin: 0;

  ${space};
`;

export default Title;
