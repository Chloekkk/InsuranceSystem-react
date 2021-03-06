import React, { useEffect, useState } from "react";
import { Button, Row, Col, Form, Input, InputNumber } from "antd";
import { apiCall } from "../../library/ApiCall";
import useAxios from "../../swr/useAxios";
import { SelectOptions } from "../../components/SelectOptions";
import { useParams } from "react-router-dom";
import {Wrapper} from "../../components/Wrapper";

const ManageModify = () => {
  const params = useParams();
  const { id } = params;
  const [form] = Form.useForm();
  const url = `/insurance/${id}`;

  const { data: insurance, isLoading, isError } = useAxios(url, "get");
  const [updateData, setUpdateData] = useState({ ...insurance });

  useEffect(() => {
    setUpdateData({ ...insurance });
  }, [isLoading]);

  const insuranceCategory = [
    { label: "자동차보험", value: "자동차" },
    { label: "운전자보험 ", value: "운전자" },
    { label: "화재보험", value: "화재" },
    { label: "여행자보험", value: "여행" },
  ];
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (typeof value === "string") {
      setUpdateData({ ...updateData, [name]: value });
    } else if (name === "conditions") {
      setUpdateData({
        ...updateData,
        conditions: {
          ...updateData.conditions,
          [Object.keys(value)[0]]: Object.values(value)[0],
        },
      });
    }
  };
  const handleSubmit = async () => {
    const data = apiCall(url, "put", { ...updateData }, form);
    console.log(data);
  };

  //exception
  if (isError) {
    return <div>에러가 발생했습니다</div>;
  }
  if (isLoading) {
    return <div>로딩중입니다.</div>;
  }

  return (
      <Wrapper title={insurance?.name} underline={true}>
        <Form
            form={form}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            layout="vertical"
            size={"large"}
            onFinish={handleSubmit}
            initialValues={{ ...insurance }}
        >
          {console.log("in rendering insu", insurance)}
          {console.log("in rendering upda", updateData)}
          <Form.Item
              rules={[{ required: true, message: "보험의 이름을 입력해주세요!" }]}
              name="name"
              label="보험상품 이름"
          >
            <Input
                name="name"
                value={updateData.name}
                onChange={handleChange}
                placeholder="예시) XX 자동차 보험"
            />
          </Form.Item>

          <SelectOptions
              onChangeMethod={handleChange}
              selectName="category"
              selectValue={updateData.category}
              selectRequired={true}
              selectLabel={"상품 항목"}
              selectPlaceholder={"상품의 종류를 선택하세요"}
              optionList={insuranceCategory}
          />

          <Row>
            <Col span={7}>
              <Form.Item wrapperCol={12} label="가입 연령대">
                <InputNumber
                    style={{
                      display: "inline-block",
                      width: "45%",
                      marginInlineEnd: "4px",
                    }}
                    placeholder="가입 최저 연령"
                    min={0}
                    max={100.0}
                    name="startAge"
                    value={updateData.conditions?.startAge}
                    onChange={(val) => {
                      handleChange({
                        target: { name: "conditions", value: { startAge: val } },
                      });
                    }}
                />

                <InputNumber
                    style={{ display: "inline-block", width: "45%" }}
                    placeholder="가입 최고 연령"
                    min={0}
                    max={100.0}
                    name="endAge"
                    value={updateData.conditions?.endAge}
                    onChange={(val) => {
                      handleChange({
                        target: { name: "conditions", value: { endAge: val } },
                      });
                    }}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item wrapperCol={12} name={"rating"} label="최소 신용등급">
                <InputNumber
                    style={{ display: "inline-block", width: "100%" }}
                    min={1}
                    max={10}
                    step="1"
                    name="rating"
                    value={updateData.conditions?.rating}
                    onChange={(val) => {
                      handleChange({
                        target: { name: "conditions", value: { rating: val } },
                      });
                    }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
              rules={[
                { required: true, message: "보험의 개괄적인 설명을 입력해주세요" },
              ]}
              name={"description"}
              label="보험상품 개요"
          >
            <Input.TextArea
                name="description"
                value={updateData.description}
                onChange={handleChange}
            />
          </Form.Item>

          <Form.Item>
            <Button
                style={{ marginBottom: "10px" }}
                type="primary"
                htmlType="submit"
                value="Submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>

  );
  // todo: 이니셜 밸류에 컨디션 넣기. 그리고 isLoading에서 useEffecte로 스테이트 설정.
};

export default ManageModify;
