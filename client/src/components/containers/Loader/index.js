import ReactLoader from 'react-loader-spinner';
const Loader = () => {
  return (
    <div
      style={{
        margin: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <ReactLoader type='Circles' color='#343a40' height={150} width={150} />
    </div>
  );
};

export default Loader;
