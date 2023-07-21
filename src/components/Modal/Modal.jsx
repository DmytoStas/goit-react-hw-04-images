import PropTypes from 'prop-types';
import css from './Modal.module.css';

import { createPortal } from 'react-dom';
import { Component } from 'react';

const modalRoot = document.querySelector('#modal-root');

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleOnClose);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleOnClose);
  }

  handleOnClose = e => {
    if (e.code === 'Escape' || e.currentTarget === e.target) {
      this.props.onClose();
    }
  };

  render() {
    const { largeImageURL, tags } = this.props.dataModal;
    return createPortal(
      <div className={css.overlay} onClick={this.handleOnClose}>
        <div className={css.modal}>
          <img src={largeImageURL} alt={tags} />
        </div>
      </div>,
      modalRoot
    );
  }
}

Modal.propTypes = {
  dataModal: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
