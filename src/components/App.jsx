import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
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

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);
  const [isLoadMore, setIsLoadMore] = useState(false);

  useEffect(() => {
    if (!query) {
      return;
    }

    const fetchData = async () => {
      if (page === 1) {
        setIsLoadMore(false);
        setImages([]);
      }

      setStatus(Status.PENDING);

      try {
        const ITEMS_PER_PAGE = 12;
        const { hits, totalHits } = await fetchImagesAPIService(
          query,
          page,
          ITEMS_PER_PAGE
        );
        const totalPages = Math.ceil(totalHits / ITEMS_PER_PAGE);

        if (query === '' || hits.length === 0 || !hits) {
          setStatus(Status.RESOLVED);
          return toast.info(
            'Sorry, there are no images matching your search query. Please try again.',
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        }

        if (totalPages > 1) {
          setIsLoadMore(true);
        }

        if (page === totalPages) {
          setIsLoadMore(false);
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

        setImages(prevState => {
          return [...prevState, ...hits];
        });

        setStatus(Status.RESOLVED);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [page, query]);

  const toggleModal = modalData => {
    setModalData(modalData);
    setModalVisible(modalVisible => !modalVisible);
  };

  return (
    <>
      <ToastContainer transition={Slide} />
      <Searchbar
        onSubmit={query => {
          setQuery(query);
          setPage(1);
        }}
      />
      <Section>
        {modalVisible && <Modal dataModal={modalData} onClose={toggleModal} />}
        <ImageGallery status={status} images={images} onClick={toggleModal} />
        {status === 'pending' && <Loader />}

        {status !== 'pending' && isLoadMore && (
          <LoadMore onClick={() => setPage(prevPage => prevPage + 1)} />
        )}
      </Section>
    </>
  );
};

export default App;
