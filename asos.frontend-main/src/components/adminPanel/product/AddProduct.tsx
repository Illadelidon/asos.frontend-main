import "../../UserProfile/Style-UserProfile.scss";
import ProfileDefaultHeader from "../../UserProfile/default/ProfileDefaultHeader.tsx";
import 'react-datepicker/dist/react-datepicker.css';
import {useEffect, useState} from "react";
import {
    IBrandName,
    ICategoryName,
    IGenderName,
    IProductCreate,
    ISizeName,
} from "../../types.ts";
import {useNavigate} from "react-router-dom";
import {Button, Form, Input, InputNumber, Row, Select, Upload} from "antd";
import http_common from "../../../http_common.ts";
import TextArea from "antd/es/input/TextArea";
import type {UploadChangeParam} from "antd/es/upload";
import {PlusOutlined} from "@ant-design/icons";
import DefaultAdminSideBar from "../default/DefaultAdminSideBar.tsx";
import {RcFile} from "antd/es/upload/interface";
const AddProduct = () => {


        const [categories, setCategories] = useState<ICategoryName[]>([]);
        const [brands, setBrands] = useState<IBrandName[]>([]);
        const [sizes, setSizes] = useState<ISizeName[]>([]);
        const [genders, setGenders] = useState<IGenderName[]>([]);


        const navigate = useNavigate();
        const [form] = Form.useForm<IProductCreate>();

        useEffect(() => {
            fetchCategories();
            fetchBrands();
            fetchSizes();
            fetchGenders();

        }, []);

        const fetchCategories = async () => {
            try {
                const response = await http_common.get<ICategoryName[]>("/api/Dashboard/GetAllCategory");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await http_common.get<IBrandName[]>("/api/Dashboard/GetAllBrand");
                setBrands(response.data);
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };

        const fetchSizes = async () => {
            try {
                const response = await http_common.get<ISizeName[]>("/api/Dashboard/GetAllSizes");
                setSizes(response.data);
            } catch (error) {
                console.error("Error fetching sizes:", error);
            }
        };

        const fetchGenders = async () => {
            try {
                const response = await http_common.get<IGenderName[]>("/api/Dashboard/GetAllGenders");
                setGenders(response.data);
            } catch (error) {
                console.error("Error fetching genders:", error);
            }
        };





        const categoriesData = categories?.map(item => ({ label: item.name, value: item.id }));
        const brandsData = brands?.map(item => ({ label: item.name, value: item.id }));


        const onSubmit = async (values: IProductCreate) => {
            console.log("data",values);
            try {
                const formData = new FormData();
                values.imageUrls.forEach((file: File) => {
                    formData.append('imageUrls', file); // Додаємо кожен файл до FormData
                });

                // Додаємо інші поля форми
                formData.append('name', values.name);
                formData.append('description', values.description);
                formData.append('categoryId', values.categoryId.toString());
                formData.append('size', values.size.toString());
                formData.append('color', values.color);
                formData.append('brandId', values.brandId.toString());
                formData.append('gender', values.gender.toString());
                formData.append('gender', values.gender.toString());
                formData.append('sizeAndFit', values.sizeAndFit);
                formData.append('lookAfterMe', values.lookAfterMe);
                formData.append('aboutMe', values.aboutMe);
                formData.append('amount', values.amount.toString());
                formData.append('price', values.price.toString());






                await http_common.post("/api/Dashboard/CreateProduct", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                });
                navigate("/admin/allproducts");
            } catch (ex) {
                console.log("error>",values)
                console.error("Exception creating product:", ex);
            }
        };


    return (
        <>
            <div className="centered-div">
                <ProfileDefaultHeader/>
            </div>

            <div className="main-container">
                <DefaultAdminSideBar/>
                <div className="content-container">
                    <div className="div-with-text">
                        <h2>Create Product</h2>
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
                                name="name"
                                htmlFor="name"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                    { min: 3, message: 'Name must have at least 3 characters!' },
                                ]}
                            >
                                <Input autoComplete="name" />
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                htmlFor="description"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                    { min: 10, message: 'Description must have at least 10 characters!' },
                                ]}
                            >
                                <TextArea />
                            </Form.Item>

                            <Form.Item
                                label="Category"
                                name="categoryId"
                                htmlFor="categoryId"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                ]}
                            >
                                <Select
                                    placeholder="Select the category: "
                                    options={categoriesData}

                                />
                            </Form.Item>





                            <Form.Item
                                label="Size"
                                name="size"
                                htmlFor="size"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                ]}
                            >
                                <Select
                                    //mode="multiple"
                                    placeholder="Select the size: "
                                    options={sizes.map(item => ({ label: item.label, value: item.value }))}
                                />
                            </Form.Item>



                            <Form.Item
                                label="Color"
                                name="color"
                                htmlFor="color"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                    { min: 3, message: 'Color must have at least 3 characters!' },
                                ]}
                            >
                                <Input autoComplete="off" />
                            </Form.Item>

                            <Form.Item
                                label="Brand"
                                name="brandId"
                                htmlFor="brandId"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                ]}
                            >
                                <Select
                                    placeholder="Select the brand: "
                                    options={brandsData}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Gender"
                                name="gender"
                                htmlFor="gender"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                ]}
                            >
                                <Select
                                    placeholder="Select the Gender: "
                                    options={genders.map(item => ({ label: item.label, value: item.value }))}
                                />
                            </Form.Item>

                            <Form.Item
                                label="SizeAndFit"
                                name="sizeAndFit"
                                htmlFor="sizeAndFit"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                    { min: 10, message: 'SizeAndFit must have at least 10 characters!' },
                                ]}
                            >
                                <TextArea />
                            </Form.Item>

                            <Form.Item
                                label="LookAfterMe"
                                name="lookAfterMe"
                                htmlFor="lookAfterMe"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                    { min: 10, message: 'LookAfterMe must have at least 10 characters!' },
                                ]}
                            >
                                <TextArea />
                            </Form.Item>

                            <Form.Item
                                label="AboutMe"
                                name="aboutMe"
                                htmlFor="aboutMe"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                    { min: 10, message: 'AboutMe must have at least 10 characters!' },
                                ]}
                            >
                                <TextArea />
                            </Form.Item>

                            <Form.Item
                                label="Amount"
                                name="amount"
                                htmlFor="amount"
                                rules={[
                                    { required: true, message: 'It is a required field!' },
                                    { type: 'number' }
                                ]}
                            >
                                <InputNumber min={0} autoComplete="off" />
                            </Form.Item>
                                <Form.Item
                                    label="Price"
                                    name="price"
                                    htmlFor="price"
                                    rules={[
                                        { required: true, message: 'It is a required field!' },
                                        { type: 'number' }
                                    ]}
                                >
                                    <InputNumber min={0} autoComplete="off" />
                                </Form.Item>
                            <div className="image-upload-container">
                            <Form.Item
                                name="imageUrls"
                                label="Images"
                                valuePropName="imageUrls"
                                getValueFromEvent={(e: UploadChangeParam) => {
                                    const files = e?.fileList.map((file) => file.originFileObj as RcFile);
                                    return files; // Повертаємо масив файлів типу RcFile
                                }}
                                rules={[{ required: true, message: 'Choose image for product!' }]}
                            >
                                <Upload
                                    showUploadList={{ showPreviewIcon: false }}
                                    beforeUpload={() => false}
                                    accept="image/*"
                                    listType="picture-card"
                                    multiple={true}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                            </div>
                            </div>

                            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button style={{ margin: 10 }} type="default" htmlType="submit">
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
