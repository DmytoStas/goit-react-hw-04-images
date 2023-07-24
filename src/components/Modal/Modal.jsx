import PropTypes from 'prop-types';
import css from './Modal.module.css';

import { createPortal } from 'react-dom';
import { useEffect } from 'react';

const modalRoot = document.querySelector('#modal-root');

function Modal({ dataModal, onClose }) {
  const { largeImageURL, tags } = dataModal;

  useEffect(() => {
    window.addEventListener('keydown', handleOnClose);

    return () => window.removeEventListener('keydown', handleOnClose);
  });

  const handleOnClose = e => {
    if (e.code === 'Escape' || e.currentTarget === e.target) {
      onClose();
    }
  };

  return createPortal(
    <div className={css.overlay} onClick={handleOnClose}>
      <div className={css.modal}>
        <img src={largeImageURL} alt={tags} />
      </div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  dataModal: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
