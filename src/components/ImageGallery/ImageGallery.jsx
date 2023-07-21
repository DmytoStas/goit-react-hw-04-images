import ImageGalleryItem from 'components/ImageGalleryItem';
import PropTypes from 'prop-types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Component } from 'react';
import ImagesAPIService from 'secrvices/imagesAPIservice';
import css from './ImageGallery.module.css';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class ImageGallery extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    changeStatus: PropTypes.func.isRequired,
    toggleLoadMore: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
  };

  constructor() {
    super();

    this.imagesAPI = new ImagesAPIService();
    this.totalPages = 0;
  }

  state = {
    images: [],
  };

  componentDidMount() {
    const { changeStatus } = this.props;
    changeStatus(Status.IDLE);
  }

  async componentDidUpdate(prevProps, prevState) {
    const { query, toggleLoadMore, page } = this.props;

    if (prevProps.query !== query || prevProps.page !== page) {
      try {
        if (prevProps.query !== query) {
          toggleLoadMore(false);
          await this.handleSubmit();

          this.totalPages = Math.ceil(
            this.imagesAPI.receivedItemsCount / this.imagesAPI.itemsPerPage
          );
        }

        if (this.totalPages > 1) {
          toggleLoadMore(true);
        }

        if (page !== 1) {
          await this.handleLoadMore();
        }

        if (page === this.totalPages) {
          toggleLoadMore(false);
          toast.info(
            "We're sorry, but you've reached the end of search results.",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        }

        if (query === '') {
          toggleLoadMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  handleSubmit = async () => {
    const { changeStatus } = this.props;

    changeStatus(Status.PENDING);
    this.setState({ images: [] });

    try {
      this.imagesAPI.query = this.props.query;

      const { hits, totalHits } = await this.imagesAPI.fetchOnSubmit();
      const images = hits;

      if (this.imagesAPI.query === '' || images.length === 0) {
        changeStatus(Status.RESOLVED);
        return toast.info(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }

      toast.info(`Hooray! We found ${totalHits} images.`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.setState({ images });
      changeStatus(Status.RESOLVED);
    } catch (e) {
      changeStatus(Status.REJECTED);
    }
  };

  handleLoadMore = async () => {
    const { changeStatus } = this.props;
    changeStatus(Status.PENDING);
    try {
      const { hits } = await this.imagesAPI.loadMore();
      const images = hits;
      this.setState(prevState => ({
        images: [...prevState.images, ...images],
      }));
      changeStatus(Status.RESOLVED);
    } catch (e) {
      changeStatus(Status.REJECTED);
    }
  };

  render() {
    const { onClick, status } = this.props;
    const { images } = this.state;
    return (
      <>
        <ToastContainer transition={Slide} />
        {images.length > 0 || status === 'pending' ? (
          <ul className={css.imageGallery}>
            {images.map(image => (
              <ImageGalleryItem key={image.id} data={image} onClick={onClick} />
            ))}
          </ul>
        ) : (
          <p
            style={{
              padding: 100,
              textAlign: 'center',
              fontSize: 30,
            }}
          >
            Waiting new for search...
          </p>
        )}
      </>
    );
  }
}

export default ImageGallery;
