import "../../UserProfile/Style-UserProfile.scss";
import ProfileDefaultHeader from "../../UserProfile/default/ProfileDefaultHeader.tsx";
import 'react-datepicker/dist/react-datepicker.css';
import {
    ICategoryCreate
} from "../../types.ts";
import {useNavigate} from "react-router-dom";
import {Button, Form, Input, Row} from "antd";
import http_common from "../../../http_common.ts";
import DefaultAdminSideBar from "../default/DefaultAdminSideBar.tsx";
const AddProduct = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm<ICategoryCreate>();




    const onSubmit = async (values: ICategoryCreate) => {
        try {
            await http_common.post("/api/Dashboard/CreateCategory", values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },

            });
            navigate("/");
        } catch (ex) {
            console.log("error>",values)
            console.error("Exception creating product:", ex);
        }
    };


    return (
        <>
            <div className="centered-div">
                <ProfileDefaultHeader backLink="/admin/allcategory"/>
            </div>

            <div className="main-container">
                <DefaultAdminSideBar/>
                <div className="content-container">
                    <div className="div-with-text">
                        <h2>Create Category</h2>
                    </div>

                    <Row gutter={16}>

                        <Form
                            form={form}
                            onFinish={onSubmit}
                            layout={"vertical"}
                            style={{
                                minWidth: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: 20,
                            }}
                        >
                            <div className="widthdiv">
                                <Form.Item
                                    label="Name"
                                    name="Name"
                                    htmlFor="Name"
                                    rules={[
                                        { required: true, message: 'It is a required field!' },
                                        { min: 3, message: 'Name must have at least 3 characters!' },
                                    ]}
                                >
                                    <Input autoComplete="name" />
                                </Form.Item>



                            </div>

                            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button style={{ margin: 10 }} type="default"  htmlType="submit" >
                                    Add
                                </Button>
                                <Button style={{ margin: 10 }} htmlType="button" onClick={() => navigate('/')}>
                                    Cancel
                                </Button>

                            </Row>

                        </Form>

                    </Row>
                </div>

            </div>
        </>
    )
        ;
};

export default AddProduct;
