import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Component } from 'react';
import fetchImagesAPIService from 'secrvices/imagesAPIservice';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Modal from './Modal';
import Loader from './Loader';
import Section from './Section';
import LoadMore from './Button';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    modalData: {},
    modalVisible: false,
    status: Status.IDLE,
    isLoadMore: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      if (prevState.query !== query) {
        this.toggleLoadMore(false);
        this.setState({ images: [] });
      }

      this.changeStatus(Status.PENDING);

      try {
        const ITEMS_PER_PAGE = 12;
        const { hits, totalHits } = await fetchImagesAPIService(
          query,
          page,
          ITEMS_PER_PAGE
        );
        const totalPages = Math.ceil(totalHits / ITEMS_PER_PAGE);

        if (query === '' || hits.length === 0 || !hits) {
          this.changeStatus(Status.RESOLVED);
          return toast.info(
            'Sorry, there are no images matching your search query. Please try again.',
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        }

        if (totalPages > 1) {
          this.toggleLoadMore(true);
        }

        if (page === totalPages) {
          this.toggleLoadMore(false);
          toast.info(
            "We're sorry, but you've reached the end of search results.",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        }

        if (page === 1) {
          toast.info(`Hooray! We found ${totalHits} images.`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }

        this.setState(prevState => ({
          images: [...prevState.images, ...hits],
        }));

        this.changeStatus(Status.RESOLVED);
      } catch (error) {
        console.log(error);
      }

      if (query === '') {
        this.toggleLoadMore(false);
      }
    }
  }

  handleSubmit = async query => {
    this.setState({ query, page: 1 });
  };

  toggleModal = modalData => {
    this.setState({ modalData });

    this.setState(({ modalVisible }) => ({
      modalVisible: !modalVisible,
    }));
  };

  toggleLoadMore = isLoadMore => {
    this.setState({ isLoadMore });
  };

  changeStatus = status => {
    this.setState({ status });
  };

  handleLoadMore = async () => {
    this.setState(({ page }) => ({
      page: page + 1,
    }));
  };

  render() {
    const { modalVisible, modalData, status, isLoadMore, images } = this.state;
    return (
      <>
        <ToastContainer transition={Slide} />
        <Searchbar onSubmit={this.handleSubmit} />
        <Section>
          {modalVisible && (
            <Modal dataModal={modalData} onClose={this.toggleModal} />
          )}
          <ImageGallery
            status={status}
            images={images}
            onClick={this.toggleModal}
          />
          {status === 'pending' && <Loader />}

          {status !== 'pending' && isLoadMore && (
            <LoadMore onClick={this.handleLoadMore} />
          )}
        </Section>
      </>
    );
  }
}
