import { Alert, Button, Divider, Input, Tabs, Layout, Card, Menu, Col, Row } from "antd";
import {
  HomeOutlined,
  DollarCircleFilled,
  ApiOutlined,
  CaretUpOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
  WalletOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Contract,
  GasGauge,
  Events,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  NetworkSwitch,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import { useEventListener } from "eth-hooks/events/useEventListener";
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, Market, Tag, Verify, Mint, Explore, MyAccount, Deployer } from "./views";
import { useStaticJsonRPC } from "./hooks";

const { ethers } = require("ethers");
const { Content, Sider } = Layout;

const initialNetwork = NETWORKS.rinkeby;

// 😬 Sorry for all the console logging
const DEBUG = false;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = true;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = ["https://speedy-nodes-nyc.moralis.io/d0553b4370fc344989d16e94/eth/rinkeby"];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "fuji", "avalanche", "mumbai", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  /*
 
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);
*/
  const implementation = useContractReader(readContracts, "dFactory", "implementation");



  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts
    ) {
      console.log("The BUNY Project: Cross-chain api enabled NFT exchange.");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    localChainId,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const CreatedEdition = useEventListener(
    readContracts,
    "dFactory",
    "CreatedEdition",
    localProvider,
    1,
  );
  console.log("BUNY Contract Created Edition:", CreatedEdition);

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
      />
      <Menu
        style={{ border: "1px solid purple", width: "100%", marginTop: 5, fontSize: 12 }}
        selectedKeys={[location.pathname]}
        mode="horizontal"
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/"> App Home </Link>{" "}
        </Menu.Item>
        <Menu.Item key="/buny" icon={<CaretUpOutlined />}>
          <Link to="/buny"> BUNY </Link>{" "}
        </Menu.Item>
        <Menu.Item key="/marketplace" icon={<DollarCircleFilled />}>
          <Link to="/marketplace"> Marketplace </Link>{" "}
        </Menu.Item>
        {/*
        <Menu.Item key="/tracker" icon={<DollarCircleFilled />}>
          <Link to="/tracker"> Tracker </Link>{" "}
        </Menu.Item>
        */}
      </Menu>{" "}
      <Switch>
        <Route exact path="/">
          {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
          <Home 
          yourLocalBalance={yourLocalBalance} 
            writeContracts={writeContracts}
              readContracts={readContracts}
              localProvider={localProvider}
              tx={tx}
              address={address}
              userSigner={userSigner}
          />
        </Route>
        <Route exact path="/marketplace">
          <div style={{ width: "100%", marginTop: 5, fontSize: 12 }}>
            <Market
              writeContracts={writeContracts}
              readContracts={readContracts}
              localProvider={localProvider}
              tx={tx}
              address={address}
              userSigner={userSigner}
              blockExplorer={"blockExplorer"}
            />
          </div>
        </Route>
        <Route exact path="/debug">
          <Contract
            name="TheBUNY"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        
        </Route>
        <Route exact path="/myaccount">
          <MyAccount
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
        <Route exact path="/buny">
          <div style={{ border: "1px solid purple", width: "100%", marginTop: 5, fontSize: 12 }}>
            <Verify
            
              writeContracts={writeContracts}
              readContracts={readContracts}
              localProvider={localProvider}
              tx={tx}
              address={address}
              userSigner={userSigner}
              implementation={implementation}
              CreatedEdition={CreatedEdition}
              blockExplorer={"https://testnet.snowtrace.io/"}
            />
          </div>
        </Route>{" "}
        <Route exact path="/logs">
          <div style={{ border: "1px solid purple", width: "100%", marginTop: 5, fontSize: 12 }}>
            <Layout className="layout">
              <Sider>
                <Menu style={{ fontSize: 13 }} theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
                  <Menu.Item key="/1" icon={<FieldBinaryOutlined />}>
                    <Link to="/verify"> Verify </Link>{" "}
                  </Menu.Item>
                  <Menu.Item key="/2" icon={<UpSquareOutlined />}>
                    <Link to="/mint"> Mint </Link>{" "}
                  </Menu.Item>
                  <Menu.Item key="3" icon={<FileAddOutlined />}>
                    <Link to="/create"> Create </Link>{" "}
                  </Menu.Item>
                  <Menu.Item key="4" icon={<QrcodeOutlined />}>
                    <Link to="/tag"> BUNY tag </Link>{" "}
                  </Menu.Item>
                  <Menu.Item key="6" icon={<CompassOutlined />}>
                    <Link to="/explore"> Explorer </Link>{" "}
                  </Menu.Item>
                </Menu>{" "}
              </Sider>
              <Content style={{ height: "80vh", margin: "24px 16px 0" }}>
                <Row>
                  <Col span={24} className="right-col">
                    <Card
                      title="BUNY: Events"
                      extra={<a href="#"> ? </a>}
                      style={{
                        width: "100%",
                        maxWidth: 600,

                        margin: "auto",
                        border: "1px solid purple",
                      }}
                    >
                      <Card
                        style={{
                          width: "500",
                          margin: "auto",
                          border: "1px solid purple",
                        }}
                      >
                        <Row>
                          <Col xs={2} sm={4} md={6} lg={8} xl={10}>
                            <p>Here</p>
                          </Col>
                        </Row>
                      </Card>
                    </Card>
                  </Col>
                </Row>{" "}
              </Content>
            </Layout>{" "}
          </div>
        </Route>{" "}
        <Route exact path="/verify">
          <Verify
           
            writeContracts={writeContracts}
            readContracts={readContracts}
            localProvider={localProvider}
            tx={tx}
            address={address}
            userSigner={userSigner}
            blockExplorer={"https://testnet.snowtrace.io/"}
          />
        </Route>
        <Route exact path="/deployer">
          <Deployer
            writeContracts={writeContracts}
            readContracts={readContracts}
            localProvider={localProvider}
            tx={tx}
            address={address}
            userSigner={userSigner}
            blockExplorer={"https://testnet.snowtrace.io/"}
          />
        </Route>
        <Route exact path="/mint">
          <Mint
            writeContracts={writeContracts}
            readContracts={readContracts}
            localProvider={localProvider}
            tx={tx}
            address={address}
            userSigner={userSigner}
            blockExplorer={"https://testnet.snowtrace.io/"}
          />
        </Route>
        <Route exact path="/tag">
          <Tag />
        </Route>
        <Route exact path="/create">
          <div style={{ border: "1px solid purple", width: "100%", marginTop: 5, fontSize: 12 }}>
            <Layout className="layout">
              <Sider>
                <Menu style={{ fontSize: 13 }} theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
                  <Menu.Item key="/1" icon={<FieldBinaryOutlined />}>
                    <Link to="/verify"> Verify </Link>{" "}
                  </Menu.Item>
                  <Menu.Item key="/2" icon={<UpSquareOutlined />}>
                    <Link to="/mint"> Mint </Link>{" "}
                  </Menu.Item>
                  <Menu.Item key="3" icon={<FileAddOutlined />}>
                    <Link to="/create"> Create </Link>{" "}
                  </Menu.Item>
                  <Menu.Item key="4" icon={<QrcodeOutlined />}>
                    <Link to="/tag"> BUNY tag </Link>{" "}
                  </Menu.Item>

                  <Menu.Item key="6" icon={<CompassOutlined />}>
                    <Link to="/explore"> Explorer </Link>{" "}
                  </Menu.Item>
                </Menu>{" "}
              </Sider>
              <Content style={{ height: "80vh", margin: "24px 16px 0" }}>
                <Row>
                  <Col span={24} className="right-col">
                    <Card
                      title="BUNY: Create"
                      extra={<a href="#"> ? </a>}
                      style={{
                        width: "100%",
                        maxWidth: 680,

                        margin: "auto",
                        border: "1px solid purple",
                      }}
                    >
                      <Row>
                        <Col xs={2} sm={4} md={6} lg={8} xl={10}>
                          <Deployer
                            writeContracts={writeContracts}
                            readContracts={readContracts}
                            localProvider={localProvider}
                            tx={tx}
                            address={address}
                            userSigner={userSigner}
                            blockExplorer={"https://testnet.snowtrace.io/"}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>{" "}
              </Content>
            </Layout>{" "}
          </div>
        </Route>{" "}
        <Route exact path="/explore">
          <Explore />
        </Route>
        <Route exact path="connect"></Route>
       
      </Switch>
      <ThemeSwitch />
      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          {USE_NETWORK_SELECTOR && (
            <div style={{ marginRight: 20 }}>
              <NetworkSwitch
                networkOptions={networkOptions}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={setSelectedNetwork}
              />
            </div>
          )}
          <Account
            useBurner={USE_BURNER_WALLET}
            address={address}
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            price={price}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
          />
        </div>
      </div>
      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("/debug");
              }}
              size="small"
              shape="square"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                X
              </span>
              Debug
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>{}</Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
