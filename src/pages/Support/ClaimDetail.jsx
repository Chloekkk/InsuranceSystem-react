
import React, {useEffect, useState} from "react";
import {Modal, Form, Row, Col, Divider, Input, Select, Button, notification} from "antd"
import "../../css/Modal.css"
import axios from "axios";
import useAsync from "../../customHooks/useAsync";


//"status" : "보상심사중"
async function postCompensation(id, data) {
    const url = `/api/claim/${id}/status`;
    const response = await axios({
        method: 'post',
        url: url,
        data: {status:data},
        headers: {'content-type': 'application/json'}
    }).then((response) => {
        notification.open({
            message: 'Notification!',
            description: '사고정보 전송 완료'
            })
        return response.data.data;
    }).catch(err => {
        console.log(err.message);
    });
    console.log(response);
    return response;
}

const ClaimDetail = (props) => {
    const {visible, setVisible, clickedRecord} = props;
    const [form] = Form.useForm();
    const [state, setState] = useState({
        status : '',
    });

    const handleChange = (event) =>{
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setState({...state, [name]: value});
    }
    const handleSubmit = () => {
        const data = postCompensation(clickedRecord.id, "보상심사중")
        console.log(data)
    }
    function onOk(){
        form.submit();
    }
    function onCancel() {
        setVisible(false);
    }
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };
    if(clickedRecord){
        console.log('clicked',clickedRecord)
        return (
            <Modal title = "해당 Claim에 대한 보상을 심사합니다" width={700} visible = {visible} onCancel={onCancel} onOk={onOk}
                   okText={'Submit'} okButtonProps={{form:'form', key: 'submit', htmlType: 'submit'}}>
                <Divider style={{fontSize: '1em'}} orientation="center">접수된 사고는 보상심사 단계로 이관됩니다.</Divider>
                <Form {...layout} form={form} layout="horizontal" onFinish={handleSubmit}>
                    <Form.Item label={"사고접수 ID"}>
                        <Input readOnly={true} value={clickedRecord.id}/>
                    </Form.Item>
                    <Form.Item label={"계약 ID"}>
                        <Input readOnly={true} value={clickedRecord.contract.id}/>
                    </Form.Item>
                    <Form.Item label={'사고 날짜'}>
                        <Input readOnly={true} name="dateHandled" value={clickedRecord.accidentDate.split('T')[0]} onInput={handleChange}/>
                    </Form.Item>
                    <Form.Item label={"손해액(KRW)"}>
                        <Input readOnly={true} value={clickedRecord.damageCost}/>
                    </Form.Item>
                    <Form.Item label={"과실비율"}>
                        <Input readOnly={true} value={clickedRecord.claimRate}/>
                    </Form.Item>
                    <Form.Item label={"사고 상세내용"}>
                        <Input.TextArea readOnly={true} value={clickedRecord.claimDetail}/>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }else {return null;}

}
export default ClaimDetail;