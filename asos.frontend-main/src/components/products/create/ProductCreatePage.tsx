import { Button, Form, Input, InputNumber, Row, Select, Upload } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { IBrandName, ICategoryName, IGenderName, IProductCreate, ISizeName, ISubCategoryName } from "../../types.ts";
import http_common from "../../../http_common.ts";
import { useEffect, useState } from "react";

const ProductCreatePage = () => {
    const [categories, setCategories] = useState<ICategoryName[]>([]);
    const [brands, setBrands] = useState<IBrandName[]>([]);
    const [sizes, setSizes] = useState<ISizeName[]>([]);
    const [genders, setGenders] = useState<IGenderName[]>([]);
    const [subcategories, setSubcategories] = useState<ISubCategoryName[]>([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState<ISubCategoryName[]>([]);
    const [imageNames, setImageNames] = useState<string[]>([]);  // Зберігаємо назви файлів

    const navigate = useNavigate();
    const [form] = Form.useForm<IProductCreate>();

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchSizes();
        fetchGenders();
        fetchSubcategories(); // Додано виклик функції для завантаження підкатегорій
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

    const fetchSubcategories = async () => {
        try {
            const response = await http_common.get<ISubCategoryName[]>("/api/Dashboard/GetAllSubCategory");
            setSubcategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const handleCategoryChange = (value: number) => {
        const filtered = subcategories.filter(subcat => subcat.categoryId === value);
        setFilteredSubcategories(filtered);
    };

    const categoriesData = categories?.map(item => ({ label: item.name, value: item.id }));
    const brandsData = brands?.map(item => ({ label: item.name, value: item.id }));
    const subcategoriesData = filteredSubcategories?.map(item => ({ label: item.name, value: item.id }));

    const onSubmit = async (values: IProductCreate) => {
        const dataToSubmit = {
            ...values,
            ImageUrls: imageNames  // Відправляємо лише назви файлів
        };
        try {
            await http_common.post("/api/Dashboard/CreateProduct", dataToSubmit);
            navigate("/");
        } catch (ex) {
            console.log("error>", dataToSubmit);
            console.error("Exception creating product:", ex);
        }
    };

    const handleImageUpload = (e: any) => {
        const fileList = e.fileList;
        const fileNames = fileList.map((file: any) => file.name);  // Беремо лише назви файлів
        setImageNames(fileNames);  // Зберігаємо назви файлів
    };

    return (
        <>
            <h1>Add Product</h1>
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

                    <Form.Item
                        label="Description"
                        name="Description"
                        htmlFor="Description"
                        rules={[
                            { required: true, message: 'It is a required field!' },
                            { min: 10, message: 'Description must have at least 10 characters!' },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="CategoryId"
                        htmlFor="CategoryId"
                        rules={[
                            { required: true, message: 'It is a required field!' },
                        ]}
                    >
                        <Select
                            placeholder="Select the category: "
                            options={categoriesData}
                            onChange={handleCategoryChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="SubCategory"
                        name="SubCategoryId"
                        htmlFor="SubCategoryId"
                        rules={[
                            { required: true, message: 'It is a required field!' },
                        ]}
                    >
                        <Select
                            placeholder="Select the SubCategory: "
                            options={subcategoriesData}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="Price"
                        htmlFor="Price"
                        rules={[
                            { required: true, message: 'It is a required field!' },
                            { type: 'number' }
                        ]}
                    >
                        <InputNumber min={0} autoComplete="off" />
                    </Form.Item>

                    <Form.Item
                        label="Size"
                        name="Size"
                        htmlFor="Size"
                        rules={[
                            { required: true, message: 'It is a required field!' },
                        ]}
                    >
                        <Select
                            placeholder="Select the size: "
                            options={sizes.map(item => ({ label: item.label, value: item.value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Color"
                        name="Color"
                        htmlFor="Color"
                        rules={[
                            { required: true, message: 'It is a required field!' },
                            { min: 3, message: 'Color must have at least 3 characters!' },
                        ]}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>

                    <Form.Item
                        label="Brand"
                        name="BrandId"
                        htmlFor="BrandId"
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
                        name="Gender"
                        htmlFor="Gender"
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
                        name="SizeAndFit"
                        htmlFor="SizeAndFit"
                        rules={[
                            { required: true, message: 'It is a required field!' },
                            { min: 10, message: 'SizeAndFit must have at least 10 characters!' },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item
                        label="LookAfterMe"
                        name="LookAfterMe"
                        htmlFor="LookAfterMe"
                        rules={[
                            { required: true, message: 'It is a required field!' },
                            { min: 10, message: 'LookAfterMe must have at least 10 characters!' },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item
                        label="AboutMe"
                        name="AboutMe"
                        htmlFor="AboutMe"
                        rules={[
                            { required: true, message: 'It is a required field!' },
                            { min: 10, message: 'AboutMe must have at least 10 characters!' },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item label="Images">
                        <Upload
                            listType="picture-card"
                            beforeUpload={() => false}  // Відключаємо автозавантаження
                            onChange={handleImageUpload}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </Form.Item>
                </Form>
            </Row>
        </>
    );
};

export default ProductCreatePage;
