import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalWindow, Overlay } from './Modal.styled';

const modalRoot = document.querySelector('#root-modal');

export const Modal = ({ imgSrc, alt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = ({ code }) => {
      if (code === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOverayClick = ({ target, currentTarget }) => {
    if (target === currentTarget) onClose();
  };

  return createPortal(
    <Overlay onClick={handleOverayClick}>
      <ModalWindow>
        <img src={imgSrc} alt={alt} />
      </ModalWindow>
    </Overlay>,
    modalRoot
  );
};

Modal.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  alt: PropTypes.string,
  onClose: PropTypes.func,
};
