import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Route, Routes, Switch, useLocation } from "react-router-dom";
import "antd/dist/antd.css";
import Web3Modal from "web3modal";
import StackGrid from "react-stack-grid";
import { Transactor, Web3ModalSetup, fetchNFTs, ipfs, loadAppContracts } from "../helpers";
import { Alert, Result, Button, Divider, Input, Tabs, Layout, Card, Menu, Col, Row } from "antd";
import {
  ApiOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { nftaddress, nftmarketaddress } from "../config";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import TheBUNY from "./artifacts/contracts/BUNI.sol/TheBUNY.json";
import NFTMarket from "./artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
const { TextArea } = Input;

export default function Market({ address, mainnetProvider, localProvider, yourLocalBalance }) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [loaded, setLoaded] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftaddress, TheBUNY.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, provider);

    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      }),
    );
    console.log("items: ", items);
    setNfts(items);
    setLoaded("loaded");
  }

  return (
    <div style={{ border: "1px solid purple", width: "100%", marginTop: 5, fontSize: 12 }}>
      <Layout className="layout">
        <Sider>
          <Menu style={{ fontSize: 13 }} theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="/1" icon={<FieldBinaryOutlined />}>
              <Link to="/stores"> Stores </Link>{" "}
            </Menu.Item>
            <Menu.Item key="/2" icon={<UpSquareOutlined />}>
              <Link to="/categories"> Categories </Link>{" "}
            </Menu.Item>
            <Menu.Item key="3" icon={<FileAddOutlined />}>
              <Link to="/myaccount"> My Account </Link>{" "}
            </Menu.Item>
            <Menu.Item key="4" icon={<QrcodeOutlined />}>
              <Link to="/tagitem"> Tag Item </Link>{" "}
            </Menu.Item>
            <Menu.Item key="5" icon={<ApiOutlined />}>
              <Link to="/support"> Support </Link>{" "}
            </Menu.Item>
          </Menu>{" "}
        </Sider>
        <Content style={{ height: "90vh", margin: "24px 16px 0" }}>
          <div style={{ width: "100%" }}>
            <Row>
              <Col span={24} className="right-col">
                <Card
                  title="POBA: Marketplace"
                  extra={<a href="#"> ? </a>}
                  style={{ backgroundColor: "silver", margin: "auto", border: "1px solid purple" }}
                >
                  <StackGrid columnWidth={200} gutterWidth={16} gutterHeight={16}>
                    {nfts.map((nft, i) => (
                      <div style={{ paddingTop: 15, backgroundColor: "black" }} key={i}>
                        <img className="nft-img" src={nft.image} />{" "}
                        <div
                          style={{ width: "100%", height: "100%", objectFit: "cover", color: "blue" }}
                          className="text-2xl font-semibold"
                        >
                          <div style={{ height: "20px", overflow: "hidden" }}>
                            <p className="text-gray-400"> {nft.description} </p>
                            <p className="text-gray-400">{nft.name}</p>{" "}
                          </div>{" "}
                        </div>{" "}
                        <div style={{ padding: 10 }} className="bg-black">
                          <p className="font-bold text-white">
                            {" "}
                            {nft.price}
                            ETH{" "}
                          </p>{" "}
                          <Button>Buy </Button>{" "}
                        </div>{" "}
                      </div>
                    ))}{" "}
                  </StackGrid>
                </Card>
              </Col>
            </Row>{" "}
          </div>
        </Content>{" "}
      </Layout>
    </div>
  );
}
