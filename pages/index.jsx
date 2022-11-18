import Main from '../containers/main';

function Home(props) {
  return <Main account={props.account} web3={props.web3} />;
}
export default Home;
