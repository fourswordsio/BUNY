import { ethers } from "ethers";
import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";
import { magicEthereum, magicMatic, ethWeb3, maticWeb3 } from "../magic";
import { Link, Route, Routes, Switch, useLocation } from "react-router-dom";
import "antd/dist/antd.css";
import Web3Modal from "web3modal";
import { Transactor, Web3ModalSetup, ipfs, loadAppContracts } from "../helpers";
import { Alert, Result, Button, Divider, Input, Tabs, Layout, Card, Menu, Col, Row } from "antd";
import { Info, Loading } from "../components/";
import {
  ApiOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useContractLoader, useContractReader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
const { TextArea } = Input;

export default function MyAccount({ readContracts, writeContracts }) {
  const [magic, setMagic] = useState(magicEthereum);
  const web3 = magic.network === "ethereum" ? ethWeb3 : maticWeb3;
  const [userMetadata, setUserMetadata] = useState();
  const [balance, setBalance] = useState("...");
  const network = magic.network === "ethereum" ? "ethereum" : "matic";
  const history = useHistory();

  const fetchBalance = useCallback(address => {
    web3.eth.getBalance(address).then(bal => setBalance(web3.utils.fromWei(bal)));
  });

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile, balance and contract message.
    magic.user.isLoggedIn().then(magicIsLoggedIn => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(user => {
          setUserMetadata(user);
          fetchBalance(user.publicAddress);
        });
      } else {
        // If no user is logged in, redirect to `/login`
        history.push("/");
      }
    });
  }, [fetchBalance, history, magic]);

  const handleChangeNetwork = e => {
    e.target.value === "ethereum" ? setMagic(magicEthereum) : setMagic(magicMatic);
    fetchBalance(userMetadata.publicAddress);
  };

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
            <Menu.Item key="4" icon={<QrcodeOutlined />}>
              <Link to="/tagitem"> Tag Item </Link>{" "}
            </Menu.Item>
            <Menu.Item key="3" icon={<FileAddOutlined />}>
              <Link to="/myaccount">My Account </Link>{" "}
            </Menu.Item>
            <Menu.Item key="5" icon={<ApiOutlined />}>
              <Link to="/support"> Support </Link>{" "}
            </Menu.Item>
          </Menu>{" "}
        </Sider>
        <Content style={{ height: "90vh", margin: "24px 16px 0" }}>
          <div style={{ marginLeft: 150, width: "100%" }}>
            <Row>
              <Col span={14} className="right-col">
                <Card
                  title="POBA: Info"
                  extra={<a href="#"> ? </a>}
                  style={{ backgroundColor: "#0d6efd", maxWidth: 350, margin: "auto", border: "1px solid purple" }}
                ></Card>
              </Col>
            </Row>{" "}
          </div>
        </Content>{" "}
      </Layout>
    </div>
  );
}
