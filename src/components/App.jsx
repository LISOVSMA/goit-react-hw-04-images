import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { Error } from 'components/Error/Error';
import { Loader } from 'components/Loader/Loader';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';
import { notification } from '../notification/notification';
import { getImages } from '../api/getImages';
import { Container } from './App.styled';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const App = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    if (!searchQuery) return;

    const fetchImages = async () => {
      setStatus(STATUS.PENDING);
      try {
        const response = await getImages(searchQuery, page);
        const { hits, totalHits } = response.data;

        if (!hits.length) {
          notification('Sorry, no images found. Please, try again!');
          return;
        }

        setImages(prevImages => (page === 1 ? hits : [...prevImages, ...hits]));
        setStatus(STATUS.RESOLVED);
        setShowBtn(page < Math.ceil(totalHits / 12));
      } catch (error) {
        setError(error.message);
        setStatus(STATUS.REJECTED);
      }
    };

    fetchImages();
  }, [searchQuery, page]);

  const handleChangeSearchQuery = prevSearchQuery => {
    if (prevSearchQuery === searchQuery) {
      notification(`Images of ${searchQuery} have already been displayed.`);
      return;
    }
    setStatus(STATUS.IDLE);
    setSearchQuery(prevSearchQuery);
    setImages([]);
    setPage(1);
    setError(null);
    setShowModal(false);
    setShowBtn(false);
    setModalImage('');
  };

  const handleLoadMore = () => setPage(page => page + 1);

  const onOpenModal = ({ target }) => {
    setShowModal(true);
    setModalImage(target.dataset.src);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleChangeSearchQuery} />

      {status === STATUS.PENDING && <Loader />}

      <ImageGallery images={images} onClick={onOpenModal} />

      {showBtn && (
        <Button onClick={handleLoadMore}>
          {status === STATUS.PENDING ? 'Loading...' : 'Load More'}
        </Button>
      )}

      {showModal && <Modal imgSrc={modalImage} onClose={onCloseModal} />}

      {status === STATUS.REJECTED && <Error>{error}</Error>}

      <ToastContainer />
    </Container>
  );
};
