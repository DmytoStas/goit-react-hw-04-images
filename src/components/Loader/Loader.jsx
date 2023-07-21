import { ColorRing } from 'react-loader-spinner';

const Loader = () => {
  return (
    <ColorRing
      height="100"
      width="100"
      color="#4d6da9"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{
        display: 'block',
        margin: '0 auto',
      }}
      wrapperClass="loader"
      visible={true}
    />
  );
};

export default Loader;
