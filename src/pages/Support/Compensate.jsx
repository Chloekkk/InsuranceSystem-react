import React, {useEffect, useRef, useState} from "react";
import {Wrapper} from "../../components/Wrapper";
import {DataTable2} from "../../components/DataTable2";
import axios from "axios";
import {Button, Dropdown, Menu, Space} from "antd";
import useAsync from "../../customHooks/useAsync";
import {DownOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import InfoModal from "../../components/InfoModal";

async function getCompensation() {
    const response = await axios.get(
        'https://60aba7e95a4de40017cca8e4.mockapi.io/compensation'
    );
    return response.data;
}
//보상완료, cost 둘 다 넘겨줄 것, claim은 처리완료로 자동으로 바뀜.

const Compensate = () => {
    const title = "보상처리";
    const subtitle = "HM 보험에 접수된 고객의 사고들을 보여주며, 보상처리와 보상금 지급 여부를 결정하는 페이지입니다"
    const [clickedRecord, setClickedRecord] = React.useState([]);

    const [data, setData] = useState([]);
    const [option, setOption] = useState("보상상태");
    const [searchData, setSearchData] = useState([]);
    const [skip, setSkip] = useState(false);
    const settingData = (data) => {
        if (data) {
            setData(data);
            setSearchData(data);
            setSkip(true);
        } else {
            console.log("데이터 설정 실패");
        }
    }
    const [initialState, refetch] = useAsync(getCompensation, settingData, [getCompensation], skip);
    const { loading, error } = initialState;

    if (error) {return (<div>에러가 발생하였습니다.</div>);}

    function handleMenuClick(e) {
        if (e.key === '1') {
            console.log('click', e.key);
            setOption("보상상태");
        }
        else if (e.key === '2') {
            console.log('click', e.key);
            setOption("보험번호");
        }
    }
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">보상 상태</Menu.Item>
            <Menu.Item key="2">보험 번호</Menu.Item>
        </Menu>
    );
    const columns = [
        {
            title: 'No',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            render: text => <a>{text}</a>,
        },
        {
            title: '보상처리 직원 ID',
            render: (record) => record.employee.id,
        },
        {
            title: '보상액',
            dataIndex: 'cost',
            key: 'cost',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Claim ID',
            render: (record) => record.claim.id
        },
        {
            title: '보상 처리일자',
            dataIndex: 'dateTime',
            key: 'dateTime',
            render: text => <a>{text}</a>,
        },
        {
            title: '보상 상태',
            dataIndex: 'status',
            key: 'status',
            render: text => <a>{text}</a>,
        },
    ];
    const onSearch = value => {
        console.log(typeof(value));
        console.log(value);
        if (value == "") {setSearchData(data);}

        else if (option == "보상상태") {
            console.log("number");
            console.log(value);
            setSearchData(
                data.filter(d => d.id === value)
            )
        }
        else if (option == "보험번호"){
            console.log("name");
            console.log(value);
            let res = [];
            data.forEach(function (d){if (d.name.includes(value)) res.push(d);})
            setSearchData(res);
        }
    };
    const onRow = (record, rowIndex) => {
        return {onClick: (record) => {
                console.log('before', clickedRecord);
                setClickedRecord(searchData[rowIndex]);
            }
        };
    }
    return (
        <Wrapper title = {title} subtitle={subtitle} underline={true}>
            <Space>
                <Dropdown overlay={menu}>
                    <Button style={{ width: 95 }}>
                        {option}<DownOutlined />
                    </Button>
                </Dropdown>
                <Search placeholder="검색할 내용" allowClear onSearch={onSearch} style={{ width: 300 }} />
            </Space>
            <DataTable2 loading={loading} dataSource={searchData} columns = {columns} title = {title}/>
        </Wrapper>
    )
}

export default Compensate;