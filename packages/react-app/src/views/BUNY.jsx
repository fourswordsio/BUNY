import { ImageUpload, FolderUpload } from "react-ipfs-uploader";
import { Alert, Result, Button, Divider, Input, Tabs, Layout, Card, Menu, Col, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { utils } from "ethers";
import { TextLoop } from "react-text-loop-next";
import {
  ApiOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
} from "@ant-design/icons";

import { Address, Balance, Events, Rutter } from "../components";
import { Create, Explore, Market, Mint, Tag, Verify } from "./";

const { TabPane } = Tabs;

const { Content, Sider } = Layout;
const { TextArea } = Input;

export default function BUNY({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [_name, setNFTName] = useState("");
  const [_symbol, setSymbol] = useState("");
  const [_description, setNFTDesc] = useState("");
  const [_price, setPrice] = useState("");
  const [access_token, setAccessToken] = useState("6beb6a4c-d92c-414c-9052-c59a4ca6c5a2"); //Default BUNY

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
               <Menu.Item key="5" icon={<ApiOutlined />}>
              <Link to="/connect"> Connect </Link>{" "}
            </Menu.Item>
            <Menu.Item key="6" icon={<CompassOutlined />}>
              <Link to="/explore"> Explorer </Link>{" "}
            </Menu.Item>
          </Menu>{" "}
          <Switch>
            <Route exact path="/verify">
              <Verify />
            </Route>
            <Route exact path="/explore">
              <Explore />
            </Route>
          </Switch>
        </Sider>
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ width: "100%" }}>
            <Row>
              <Col span={24} className="right-col">
                <div>
                  <div
                    style={{
                      border: "1px solid purple",
                      backgroundColor: "white",
                      padding: 2,
                      width: "100%",
                      maxWidth: 600,

                      margin: "auto",
                      marginTop: 1,
                    }}
                  >
                    <p> BUNY Contract: </p>{" "}
                    <Alert
                      banner
                      message={
                        <TextLoop mask>
                          <div> This contract requires an existing store or inventory API. </div>{" "}
                          <div> Do not deploy contract until you have an access token </div>{" "}
                          <div> Alternatively you can use the 'Connect store' feature on side menu </div>{" "}
                        </TextLoop>
                      }
                    />
                    <Divider />
                    <Alert
                      banner
                      message={
                        <TextLoop mask style={{ width: "95%" }}>
                          <div> Check for mistakes.</div> <div> Deploying to testnet </div>{" "}
                          <div> Have a nice day! =) </div>
                        </TextLoop>
                      }
                    />{" "}
                    <div style={{ backgroundColor: "white" }}>
                      <Events
                        contracts={readContracts}
                        contractName="dFactory"
                        eventName="CreatedEdition"
                        localProvider={localProvider}
                        mainnetProvider={mainnetProvider}
                        startBlock={1}
                      />
                    </div>
                  </div>{" "}
                  <Divider />
                </div>
              </Col>
            </Row>{" "}
          </div>
        </Content>{" "}
      </Layout>
      <Divider />
    </div>
  );
}
