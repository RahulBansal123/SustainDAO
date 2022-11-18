import MintContainer from '../containers/mint';

function Mint(props) {
  return <MintContainer account={props.account} web3={props.web3} />;
}
export default Mint;
