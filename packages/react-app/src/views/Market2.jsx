import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { Alert, Button, Divider, Input, Grid, Card, Menu, Col, Steps, Row } from "antd";
import "antd/dist/antd.css";
import "../components/styles/Home.module.css";
import { useBalance, useContractLoader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";
import { Address, Balance, Events } from "../components";
import StackGrid from "react-stack-grid";


export default function Market({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {

     const meta = await axios.get(tokenUri);
    let price = ethers.utils.formatUnits(i.price.toString(), "ether");

      const [yourCollectibles, setYourCollectibles] = useState();


  const [loadedAssets, setLoadedAssets] = useState();
  useEffect(() => {
    const updateYourCollectibles = async () => {
      const assetUpdate = [];
      for (const a in assets) {
        try {
          const forSale = await readContracts.NFTMarket.forSale(ethers.utils.id(a));
          let owner;
          if (!forSale) {
            const tokenId = await readContracts.NFTMarket.fetchMarketItems(ethers.utils.id(a));
            owner = await readContracts.NFTM.ownerOf(tokenId);
          }
          assetUpdate.push({ id: a, ...assets[a], forSale, owner });
        } catch (e) {
          console.log(e);
        }
      }
      setLoadedAssets(assetUpdate);
    };
    if (readContracts && readContracts.NFTMarket) updateYourCollectibles();
  }, [assets, readContracts, transferEvents]);

  const galleryList = [];
  for (const a in loadedAssets) {
    console.log("loadedAssets", a, loadedAssets[a]);

    const cardActions = [];
    if (loadedAssets[a].forSale) {
      cardActions.push(
        <div>
          <Button
            onClick={() => {
              console.log("gasPrice,", gasPrice);
              tx(writeContracts.NFTMarket.createMarketSale(loadedAssets[a].id, { gasPrice }));
            }}
          >
            Mint
          </Button>
        </div>,
      );
    } else {
      cardActions.push(
        <div>
          owned by:{" "}
          <Address
            address={loadedAssets[a].owner}
            ensProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            minimized
          />
        </div>,
      );
    }

    galleryList.push(
      <Card
        style={{ width: 200 }}
        key={loadedAssets[a].name}
        actions={cardActions}
        title={
          <div>
            {loadedAssets[a].name}{" "}
            <a
              style={{ cursor: "pointer", opacity: 0.33 }}
              href={loadedAssets[a].external_url}
              target="_blank"
              rel="noreferrer"
            >
              <LinkOutlined />
            </a>
          </div>
        }
      >
        <img style={{ maxWidth: 130 }} src={loadedAssets[a].image} alt="" />
        <div style={{ opacity: 0.77 }}>{loadedAssets[a].description}</div>
      </Card>,
    );
  }



  return (

      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
              <StackGrid columnWidth={200} gutterWidth={16} gutterHeight={16}>
                {galleryList}
              </StackGrid>
            </div>


  );
}
  

import { ImageUpload, FolderUpload } from "react-ipfs-uploader";
import { Alert, Result, Button, Divider, Input, Tabs, Layout, Card, Menu, Col, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { utils } from "ethers";
import { TextLoop } from "react-text-loop-next";
import {
  ApiOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { Address, Balance, Events, Rutter } from "../components";
import QRCode from "qrcode.react";

const { TabPane } = Tabs;

const { Content, Sider } = Layout;
const { TextArea } = Input;

export default function Tag({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [qrValue, setQRvalue] = useState("");

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${qrValue}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
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
              <Link to="/tag"> POBA tag </Link>{" "}
            </Menu.Item>
            <Menu.Item key="5" icon={<ApiOutlined />}>
              <Link to="/connect"> Connect </Link>{" "}
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
                title="POBA: Marketplace"
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
                    margin: "auto",
                    border: "1px solid purple",
                  }}
                >
               
                  <br></br>
               
                    <br />
                    <Card
                      style={{
                        width: "100%",
                        maxWidth: 250,
                        margin: "auto",
                        border: "1px solid purple",
                      }}
                    >
                    </Card>
                    <br />
                   
                  </div>
                </Card>
              </Card>
            </Col>
          </Row>{" "}
        </Content>
      </Layout>{" "}
      <Divider />
    </div>
  );
}
