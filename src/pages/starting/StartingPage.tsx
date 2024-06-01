import { FC, useRef, useState } from 'react';
import styled from 'styled-components';

import { CenteredPage } from '../../layouts';
import {
  Button,
  Dropdown,
  Panel,
  Title,
  Tooltip,
} from '../../shared/components';

const ContextMenu = styled(Dropdown)`
  background: blue;
  gap: 5px;
`;

const StartingPage: FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <CenteredPage>
      <Panel width={500} height={500}>
        <Title>Стартовая страница</Title>
        <Tooltip title="Откроется модальное окно для заполнения данных">
          <Button ref={buttonRef} onClick={() => setIsOpen((prev) => !prev)}>
            Click me
          </Button>
        </Tooltip>
        <ContextMenu
          target={buttonRef.current}
          isOpen={isOpen}
          setOpen={setIsOpen}
        >
          <Button>Добавить анализ</Button>
          <Button>Добавить медкарта</Button>
          <Button>Добавить документ</Button>
          <Button>Добавить фото</Button>
          <Button>Добавить фото</Button>
          <Button>Добавить фото</Button>
          <Button>Добавить фото</Button>
          <Button>Добавить фото</Button>
          <Button>Добавить фото</Button>
        </ContextMenu>
      </Panel>
    </CenteredPage>
  );
};

export default StartingPage;
