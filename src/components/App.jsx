import { Component } from 'react';
import Searchbar from './Searchbar';

import ImageGallery from './ImageGallery';
import Modal from './Modal';
import Loader from './Loader';
import Section from './Section';
import LoadMore from './Button';

export class App extends Component {
  state = {
    query: '',
    page: 1,
    modalData: {},
    modalVisible: false,
    status: '',
    isLoadMore: false,
  };

  handleSubmit = query => {
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

  handleLoadMore = () => {
    this.setState(({ page }) => ({
      page: page + 1,
    }));
  };

  render() {
    const { modalVisible, modalData, query, status, isLoadMore, page } =
      this.state;
    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} />
        <Section>
          {modalVisible && (
            <Modal dataModal={modalData} onClose={this.toggleModal} />
          )}
          <ImageGallery
            page={page}
            query={query}
            onClick={this.toggleModal}
            changeStatus={this.changeStatus}
            toggleLoadMore={this.toggleLoadMore}
            status={status}
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
