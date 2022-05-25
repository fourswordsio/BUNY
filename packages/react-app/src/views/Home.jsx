import { useContractReader } from "eth-hooks";
import React, { useState, useEffect } from "react";
import { Alert, List, Card, Tabs } from "antd";
import { TextLoop } from "react-text-loop-next";
import { Link } from "react-router-dom";
import { ApartmentOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

function Home({ yourLocalBalance, readContracts, localProvider, tx, address,userSigner}) {
  return (
    <div>
      <Card
        title=" Welcome to The BUNY Project"
        extra={<a href="#"> ? </a>}
        style={{ width: 750, margin: "auto", marginTop: 5, border: "1px solid purple" }}
      >
        <div style={{ margin: 5 }}> </div>{" "}
        <div
          style={{
            display: "block",
            width: 450,
            fontSize: 12,
            margin: "auto",
          }}
        ></div>{" "}
        <Alert
          banner
          message={
            <TextLoop mask>
              <div> Beta testnet Dapp on Rinkeby, Fuji, Mumbai! The BUNY Project: NFT launchpad and api-enabled NFT exchange. </div>{" "}
              <div> THIS IS A TESTNET DAPP UNDER DEVELOPMENT! </div>{" "}
              <div> Testnet BUNY NFT Dapp.AVAX, Polygon deployments </div>{" "}
              <div> For questions, concerns, ideas, suggestions, comments contact us on twitter @pobatag </div>{" "}
            </TextLoop>
          }
        />{" "}
        <br />
      </Card>{" "}
      <Card
        title="Contracts"
        extra={<a href="#"> ? </a>}
        style={{ width: 750, margin: "auto", marginTop: 1, border: "1px solid purple" }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <ApartmentOutlined />
                Fuji Testnet{" "}
              </span>
            }
            key="1"
          >
            <Card
              title="Fuji (AVAX) Contract Deployments"
              extra={<a href="#"> ? </a>}
              style={{ width: 600, margin: "auto", marginTop: 5, border: "1px solid purple" }}
            >
              <div style={{ margin: 5 }}> </div>{" "}
              <div
                style={{
                  display: "block",
                  width: 450,
                  fontSize: 12,
                  margin: "auto",
                  border: "1px solid purple",
                }}
              >
                {" "}
                <List
                  header={
                    <div style={{ margin: 5, marginTop: 10, color: "white", backgroundColor: "black" }}>
                      {" "}
                      <Alert message=" (Fuji) Testnet Contracts" type="info" showIcon />
                    </div>
                  }
                  bordered
                  dataSource={[
                    "ERC721-Dynamic: '0xBb3D452f166201d59eFC363A57fCBb749d704838'",
                    "Dynamic Factory: '0x0EC46495c3f4Ed3c33Fd0E6e517d6CAE7F3E2B9E",
                    "ERC721-Static: '0xfB01957930521a6a2d83dBC0311d08574A6F6b64'",
                    "Static Factory: '0x43E8cB723f86855a165c41222ca32CfA62F6F167'",
                    "NFT Market: '0x5807574C534393dFD4094386b30C89fA2104baF2'",
                    "Market NFT: '0x3616164Fdd8bd211814820C88Dca0F7457fD5E23'",
                    "FUJI Oracle: '0xF71b830fBDB70F6A214A113778773561e09f9b8b'",
                  ]}
                  renderItem={item => <List.Item> {item} </List.Item>}
                />
              </div>{" "}
              <br />{" "}
            </Card>{" "}
          </TabPane>{" "}
          <TabPane
            tab={
              <span>
                <ApartmentOutlined />
                Mumbai Testnet{" "}
              </span>
            }
            key="3"
          >
            <Card
              title="Mumbai Contract Deployments"
              extra={<a href="#"> ? </a>}
              style={{ width: 600, margin: "auto", marginTop: 5, border: "1px solid purple" }}
            >
              <div style={{ margin: 5 }}> </div>{" "}
              <div
                style={{
                  display: "block",
                  width: 450,
                  fontSize: 12,
                  margin: "auto",
                  border: "1px solid purple",
                }}
              >
                {" "}
                <List
                  header={
                    <div style={{ margin: 5, marginTop: 10, color: "white", backgroundColor: "black" }}>
                      {" "}
                      <Alert message="Deploy (Mumbai) Testnet Contracts" type="info" showIcon />
                    </div>
                  }
                  bordered
                  dataSource={[
                    "ERC721-Dynamic: '0x10cA9E76Fb9d40B8Bc388A6986377669B46284f7'",
                    "Dynamic Factory: '0xBb3D452f166201d59eFC363A57fCBb749d704838",
                    "ERC721-Static: '0x6D7c37E7BFDe4fc8d5d3A9Ea4286Fe312DAc3D2F",
                    "Static Factory: '0xC8D679929398E1A907D86C905434Cd090C1013e3'",
                    "NFT Market: '0xD621C6c863Dd9A288Dc6B25d4024041E2281c272'",
                    "Market NFT: '0x7c405b3342C83399D2dCe470379B28C4D722574f'",
                  ]}
                  renderItem={item => <List.Item> {item} </List.Item>}
                />
              </div>{" "}
              <br />{" "}
            </Card>{" "}
          </TabPane>{" "}
          <TabPane
            tab={
              <span>
                <ApartmentOutlined />
                Polygon Mainnet{" "}
              </span>
            }
            key="2"
          >
            <Card
              title="Polygon Contract Deployments"
              extra={<a href="#"> ? </a>}
              style={{ width: 600, margin: "auto", marginTop: 5, border: "1px solid purple" }}
            >
              {" "}
              <div style={{ margin: 5 }}> </div>{" "}
              <div
                style={{
                  display: "block",
                  width: 450,
                  fontSize: 12,
                  margin: "auto",
                  border: "1px solid purple",
                }}
              >
                {" "}
                <List
                  header={
                    <div style={{ margin: 5, marginTop: 10, color: "white", backgroundColor: "black" }}>
                      {" "}
                      <Alert message="Deployed (AVAX Fuji) Contracts" type="info" showIcon />
                    </div>
                  }
                  bordered
                  dataSource={[
                    "ERC721-Dynamic: '0x4353B7dB8a538D85d4945aA81669df9cAf9e0DDD'",
                    "Dynamic Factory: '0x29A45eFdEbD70Af491905c55e0dE518558b79f72'",
                    "ERC721-Static: '0xeC288c0bDCc8B57025C487D023Fb04090e818075'",
                    "Static Factory: '0x7EEf2Ac99ab9FD79a68F0030D2cAd7aBE06A2439'",
                    "Market NFT: '0x5807574C534393dFD4094386b30C89fA2104baF2'",
                    "NFT Market: '0x3Fe8fB93Cff5D0ebA59861F69925c109D2Ed5a1a'",
                  ]}
                  renderItem={item => <List.Item> {item} </List.Item>}
                />
              </div>{" "}
              <br />{" "}
            </Card>{" "}
          </TabPane>
          <TabPane
            tab={
              <span>
                <ApartmentOutlined />
                AVAX Mainnet{" "}
              </span>
            }
            key="4"
          >
            <Card
              title="AVAX Mannet"
              extra={<a href="#"> ? </a>}
              style={{ width: 600, margin: "auto", marginTop: 5, border: "1px solid purple" }}
            >
              {" "}
              <div style={{ margin: 5 }}> </div>{" "}
              <div
                style={{
                  display: "block",
                  width: 450,
                  fontSize: 12,
                  margin: "auto",
                  border: "1px solid purple",
                }}
              >
                {" "}
                <List
                  header={
                    <div style={{ margin: 5, marginTop: 10, color: "white", backgroundColor: "black" }}>
                      {" "}
                      <Alert message="Deployed (AVAX Fuji) Contracts" type="info" showIcon />
                    </div>
                  }
                  bordered
                  dataSource={[
                    "ERC721-Dynamic: ''",
                    "Dynamic Factory: ''",
                    "ERC721-Static: ''",
                    "Static Factory: ''",
                    "Market NFT: ''",
                    "NFT Market: ''",
                  ]}
                  renderItem={item => <List.Item> {item} </List.Item>}
                />
              </div>{" "}
              <br />{" "}
            </Card>{" "}
          </TabPane>
                <TabPane
            tab={
              <span>
                <ApartmentOutlined />
                Rinkeby Testnet{" "}
              </span>
            }
            key="5"
          >
            <Card
              title="Rinkeby (ETH) Contract Deployments"
              extra={<a href="#"> ? </a>}
              style={{ width: 600, margin: "auto", marginTop: 5, border: "1px solid purple" }}
            >
              <div style={{ margin: 5 }}> </div>{" "}
              <div
                style={{
                  display: "block",
                  width: 450,
                  fontSize: 12,
                  margin: "auto",
                  border: "1px solid purple",
                }}
              >
                {" "}
                <List
                  header={
                    <div style={{ margin: 5, marginTop: 10, color: "white", backgroundColor: "black" }}>
                      {" "}
                      <Alert message=" (Rinkeby) Testnet Contracts" type="info" showIcon />
                    </div>
                  }
                  bordered
                  dataSource={[
                    "NFT: ''",
                    "NFT Factory: '",
                    "Marketplace: ''",
                    "Rinkeby Oracle: ''",
                  ]}
                  renderItem={item => <List.Item> {item} </List.Item>}
                />
              </div>{" "}
              <br />{" "}
            </Card>{" "}
          </TabPane>{" "}
        </Tabs>{" "}
      </Card>{" "}
    </div>
  );
}
export default Home;
