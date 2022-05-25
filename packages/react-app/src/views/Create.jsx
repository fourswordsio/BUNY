import { ImageUpload, FolderUpload } from "react-ipfs-uploader";
import { Alert, Result, Button, Divider, Input, Tabs, Layout, Card, Menu, Col, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { utils } from "ethers";
import { useRutterLink } from "react-rutter-link";
import { TextLoop } from "react-text-loop-next";
import axios from "axios";
import {
  ApiOutlined,
  FieldBinaryOutlined,
  QrcodeOutlined,
  CompassOutlined,
  UserOutlined,
  UpSquareOutlined,
  FileAddOutlined,
  WalletOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useBalance, useContractLoader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";

import { Address, Balance, Events, Rutter } from "../components";


const PUBLIC_KEY =
  process.env.NEXT_PUBLIC_RUTTER_PUBLIC_KEY || "RUTTER_PUBLIC_KEY";

const { TabPane } = Tabs;

const { Content, Sider } = Layout;
const { TextArea } = Input;


export default function Create({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
   const [dataFetched, setDataFetched] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState("");
  const [rutterConnected, setRutterConnected] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");




  const config = {
    publicKey: PUBLIC_KEY,
    onSuccess: (publicToken) => {
      // We call our NextJS backend API in pages/api/rutter.js
      // It exchanges the publicToken for an access_token and makes an API call to /orders/get
      setLoading(true);
      axios
        // Calls handler method in pages/api/rutter.js
        .post("/api/rutter-exchange", {
          publicToken,
        })
        .then(function(response) {
          const { data } = response;
          console.log(data);
          setAccessToken({ events: response.data});
        }.bind(this));
      
       
    },
  };
  const { open, ready, error } = useRutterLink(config);
  const [access_token, setaccess_token] = useState("");

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

  return (
    <div>
      <div
        style={{
          border: "1px solid purple",
          backgroundColor: "white",
          padding: 5,
          width: 777,
          margin: "auto",
          marginTop: 5,
          marginBottom: 5,
          fontSize: 12,
        }}
      >
        <p> Origin Contract: </p>{" "}
        <Address
          address={readContracts && readContracts.POBAwoo ? readContracts.POBAwoo.address : null}
          fontSize={12}
        />
        ;
        <Alert
          banner
          message={
            <TextLoop mask>
              <div> This contract requires an existing store or invetory API. </div>{" "}
              <div> Do not deploy contract until you have an access token </div>{" "}
              <div> Alternatively you can use the 'Connect store' feature on side menu </div>{" "}
            </TextLoop>
          }
        />
        <Divider />
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
      <div>access_token: {accessToken}</div>        </Card>
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
</Button>;

          <Divider />
          <Alert
            banner
            message={
              <TextLoop mask style={{ width: "95%" }}>
                <div> Check for mistakes.</div> <div> Deploying to testnet </div> <div> Have a nice day! =) </div>
              </TextLoop>
            }
          />{" "}
        </Card>
      </div>{" "}
      <Divider />
    </div>
  );
}
