import { Alert, Button, Divider, Input, Tabs, Layout, Card, Menu, Col, Row } from "antd";
import { ImageUpload, FolderUpload } from "react-ipfs-uploader";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { utils } from "ethers";
import { useRutterLink } from "react-rutter-link";
import { TextLoop } from "react-text-loop-next";
import {
  ApiOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
} from "@ant-design/icons";
import { useBalance, useContractLoader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";
import { Address, Balance, Events } from "../components";

const axios = require("axios");

export default function Deployer({ address, localProvider, tx, readContracts, writeContracts, contractConfig,  implementation, CreatedEdition, userSigner }) {
  const [deployItemResult, setItemResult] = useState("");
  const [callBackendAPI, setCallBackendAPI] = useState();
  const [_name, setNFTName] = useState("");
  const [_baseURI, setBaseURI] = useState("");
  const [_symbol, setSymbol] = useState("");
  const [_description, setNFTDesc] = useState("");
  const [_animationUrl, setAnimationUrl] = useState("");
  const [_imageUrl, setImageUrl] = useState("");
  const [_editionSize, setEditionSize] = useState("");
  const [_royaltyBPS, setRoyaltyBPS] = useState("");
  const [deploying, setDeploy] = useState();
  const [deployResult, setResultDisplay] = useState("");
  const [_price, setPrice] = useState("");
  const { TextArea } = Input;
  const { TabPane } = Tabs;
  const [access_token, setaccess_token] = useState("");

  function callback(key) {
    console.log(key);
  }

  const rutterConfig = {
    publicKey: "2192ce59-1735-45dc-b8c9-cfd42a021c5f",
    onSuccess: onSuccess,
  };
  const { open } = useRutterLink(rutterConfig);

  async function backendHandler(publicToken, userId) {
    const res = await axios.post("https://production.rutterapi.com/item/public_token/exchange", {
      client_id: "96ff6b2b-63f5-4e0a-8e11-1d55fe31842b",
      secret: "18af1c27-2ddf-488f-945f-fdffc6cbc58d",
      public_token: publicToken,
    });
    const access_token = res.data.access_token;

    // Save the access_token and associated userId in your DB
    setaccess_token(access_token, userId);
  }

  function onSuccess(publicToken) {
    // Send publicToken to your backend, which will call the
    // Rutter API to get an access_token
    callBackendAPI(publicToken);
  }

  // Deploy ERC721 POBA Marketplace NFT

  const deployItem = (
    <Button
      style={{ margin: 8 }}
      loading={deploying}
      size="large"
      type="primary"
      danger
      onClick={async () => {
        console.log("Create Item...", _name, _description, _price, _imageUrl);
        const deployItemResult = await tx(
          writeContracts.NFTMarket.createMarketItem(_name, _price, _description, _imageUrl),
        );
        console.log("deployItemResult", deployItemResult);
        setItemResult(
          <div style={{ marginTop: 10, paddingBottom: 30 }}>
            {_name}, {_price} <Divider /> {_description}
          </div>,
        );
      }}
    >
      Deploy Item
    </Button>
  );

  // Deploy ERC721-Static Contract

  const deployStatic = (
    <Button
      style={{ margin: 8 }}
      loading={deploying}
      size="large"
      type="primary"
      danger
      onClick={async () => {
        console.log(
          "Deploying contract...",
          _name,
          _symbol,
          _description,
          _animationUrl,
          _imageUrl,
          _editionSize,
          _royaltyBPS,
        );
        const deployResult = await tx(
          writeContracts.sFactory.createEdition(
            _name,
            _symbol,
            _description,
            _animationUrl,
            _imageUrl,
            _editionSize,
            _royaltyBPS,
          ),
        );
        console.log("deployResult", deployResult);
        setResultDisplay(
          <div style={{ marginTop: 10, paddingBottom: 50 }}>
            {_name}: {_symbol}
          </div>,
        );
      }}
    >
      Deploy
    </Button>
  );

  // ERC721 Dynamic

  const deployDynamic = (
    <Button
      style={{ margin: 8 }}
      loading={deploying}
      size="large"
      type="primary"
      danger
      onClick={async () => {
        console.log("Deploying ERC721 contract...", _baseURI, _name, _symbol, _description, _editionSize, _royaltyBPS);
        const deployResult2 = await tx(
          writeContracts.dFactory.createEdition(_baseURI, _name, _symbol, _description, _editionSize, _royaltyBPS),
        );
      }}
    >
      Deploy
    </Button>
  );

  return (
    <div>
      <div
        style={{
          border: "1px solid purple",
          backgroundColor: "white",
          padding: 5,
          width: 650,
          margin: "auto",
          marginTop: 2,
          fontSize: 12,
        }}
      >
        <Tabs onChange={callback} type="card">
          <TabPane tab="ERC721-dynamic" key="2">
            <div>
              <div
                style={{
                  //border: "1px solid purple",
                  backgroundColor: "white",
                  padding: 5,
                  width: 600,
                  margin: "auto",
                  marginTop: 5,
                }}
              >
                <Card
                  title="ERC721 Dynamic"
                  extra={<a href="#"> ? </a>}
                  style={{ width: 500, margin: "auto", border: "1px solid purple" }}
                >
                  <p> Once contract is deployed you can begin minting NFTs. </p>{" "}
                  <p>
                    Upload your individual json files to IPFS.Each json file should be named in sequential numerical
                    order.
                  </p>{" "}
                  <p> Save metadata files without a * .json extension. </p> <p> </p> <Divider />
                  Upload folder containing metadata files to IPFS :
                  <a href={_baseURI} target="_blank" rel="noopener noreferrer">
                    {_baseURI}
                  </a>{" "}
                  <FolderUpload setUrl={setBaseURI} style={{ marginTop: 8, marginBottom: 8, fontSize: 12 }} />{" "}
                  <Input
                    placeholder="Base URI"
                    onChange={e => {
                      setBaseURI(e.target.value);
                    }}
                    value={_baseURI}
                    style={{ marginTop: 8, fontSize: 12 }}
                  />{" "}
                  <Input
                    placeholder="NFT Name"
                    onChange={e => {
                      setNFTName(e.target.value);
                    }}
                    value={_name}
                    style={{ marginTop: 8, fontSize: 12 }}
                  />{" "}
                  <Input
                    placeholder="NFT Symbol"
                    onChange={e => {
                      setSymbol(e.target.value);
                    }}
                    value={_symbol}
                    style={{ marginTop: 8, fontSize: 12 }}
                  />{" "}
                  <TextArea
                    placeholder="Description of token project"
                    rows={4}
                    style={{ marginTop: 8, marginBottom: 8, fontSize: 12 }}
                    onChange={e => {
                      setNFTDesc(e.target.value);
                    }}
                    value={_description}
                  />{" "}
                  <Input
                    placeholder="Edition size: number of tokens"
                    onChange={e => {
                      setEditionSize(e.target.value);
                    }}
                    value={_editionSize}
                    style={{ marginTop: 8, fontSize: 12 }}
                  />{" "}
                  <Input
                    placeholder="Royalties: set % to earn (DEV: 500=5%) *FIX*"
                    onChange={e => {
                      setRoyaltyBPS(e.target.value);
                    }}
                    value={_royaltyBPS}
                    style={{ marginTop: 8, fontSize: 12 }}
                  />{" "}
                  {deployDynamic}
                </Card>
              </div>{" "}
            </div>
          </TabPane>{" "}
          <TabPane tab="API NFT" key="3">
            <div>
              <div
                style={{
                  //border: "1px solid purple",
                  backgroundColor: "white",
                  padding: 5,
                  width: 550,
                  margin: "auto",
                  marginTop: 5,
                }}
              >
                <Card title="API NFT" extra={<a href="#"> ? </a>} style={{ width: 500, margin: "auto" }}>
                  <Card
                    title="Connect online store"
                    extra={<a href="#"> ? </a>}
                    style={{
                      width: "98%",
                      maxWidth: 600,
                      padding: 20,
                      margin: "auto",
                      border: "1px solid purple",
                    }}
                  >
                    <br />
                    <Button type="primary" onClick={() => open()}>
                      Connect API
                    </Button>
                    <br></br>
                    <p> Access Token : {access_token} </p>
                  </Card>
                  <Divider />
                  <Card
                    title="Configure your POBA NFT contract"
                    extra={<a href="#"> ? </a>}
                    style={{
                      width: "98%",
                      maxWidth: 600,
                      margin: "auto",
                      border: "1px solid purple",
                    }}
                  >
                    <div style={{ margin: 8, fontSize: 12 }}>
                      <span className="ant-form-text"> Access Token : {access_token} </span>
                      <Input
                        placeholder="Store Name"
                        addonBefore="Name "
                        onChange={e => {
                          setNFTName(e.target.value);
                        }}
                        value={_name}
                        style={{ marginTop: 8, fontSize: 12 }}
                      />{" "}
                      <Input
                        placeholder="Store Symbol"
                        addonBefore="Symbol"
                        onChange={e => {
                          setSymbol(e.target.value);
                        }}
                        value={_symbol}
                        style={{ marginTop: 8, fontSize: 12 }}
                      />{" "}
                      <TextArea
                        placeholder="Description of store"
                        rows={4}
                        style={{ marginTop: 8, marginBottom: 8, fontSize: 12 }}
                        onChange={e => {
                          setNFTDesc(e.target.value);
                        }}
                        value={_description}
                      />
                      Upload store image to IPFS( * .jpg, * .png):
                      <a href={_imageUrl} target="_blank" rel="noopener noreferrer">
                        {_imageUrl}
                      </a>{" "}
                      <ImageUpload setUrl={setImageUrl} style={{ marginTop: 8, marginBottom: 8, fontSize: 12 }} />
                      Upload store animation image to IPFS( * .gif, * .mp4, * .obj):
                      <a href={_animationUrl} className="ant-input-sm" target="_blank" rel="noopener noreferrer">
                        {_animationUrl}
                      </a>{" "}
                      <ImageUpload style={{ marginTop: 8, fontSize: 12 }} setUrl={setAnimationUrl} />{" "}
                      <Input
                        placeholder="Inventory size: max number of tokens"
                        addonBefore="Iventory Size"
                        onChange={e => {
                          setEditionSize(e.target.value);
                        }}
                        value={_editionSize}
                        style={{ marginTop: 8, fontSize: 12 }}
                      />{" "}
                      <Input
                        placeholder="Royalties: set % to earn (DEV: 500=5%) *FIX*"
                        onChange={e => {
                          setRoyaltyBPS(e.target.value);
                        }}
                        value={_royaltyBPS}
                        style={{ marginTop: 8, fontSize: 12 }}
                      />{" "}
                    </div>
                  </Card>{" "}
                  <Divider />
                  <Card
                    title="Deploy your NFT contract"
                    extra={<a href="#"> ? </a>}
                    style={{
                      width: "98%",
                      maxWidth: 600,
                      maxWidth: 600,
                      marginBottom: 15,
                      margin: "auto",
                      border: "1px solid purple",
                    }}
                  >
                    <br />
                    <Button type="primary" size="large" danger>
                      Deploy
                    </Button>{" "}
                    <Divider />
                    <Alert
                      banner
                      message={
                        <TextLoop mask style={{ width: "95%" }}>
                          <div> Check for mistakes.</div> <div> Deploying to AVAX testnet </div>{" "}
                          <div> Have a nice day! =) </div>
                        </TextLoop>
                      }
                    />{" "}
                  </Card>
                </Card>
                {/*  {deployStatic} {deployResult}*/}
              </div>{" "}
            </div>
          </TabPane>{" "}
        </Tabs>
      </div>{" "}
    </div>
  );
}
