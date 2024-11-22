import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, Button, notification, InputNumber, Upload } from "antd";
import http_common from "../../../http_common";
import { IBrandName, ICategoryName, IGenderName, IProductCreate, ISizeName } from "../../types.ts";
import { PlusOutlined } from "@ant-design/icons";
import { UploadChangeParam, RcFile, UploadFile } from "antd/es/upload/interface";
import DefaultAdminSideBar from "../default/DefaultAdminSideBar.tsx";
import ProfileDefaultHeader from "../../UserProfile/default/ProfileDefaultHeader.tsx";

const UpdateProduct = () => {
    const { id } = useParams(); // Отримуємо ID продукту з параметрів маршруту
    const navigate = useNavigate();
    const [product, setProduct] = useState<IProductCreate | null>(null);
    const [categories, setCategories] = useState<ICategoryName[]>([]);
    const [brands, setBrands] = useState<IBrandName[]>([]);
    const [sizes, setSizes] = useState<ISizeName[]>([]);
    const [genders, setGenders] = useState<IGenderName[]>([]);

    useEffect(() => {
        fetchProduct();
        fetchCategories();
        fetchBrands();
        fetchSizes();
        fetchGenders();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await http_common.get<IProductCreate>(`/api/Dashboard/GetByIdCard/${id}`);
            setProduct(response.data);
            console.log("Fetched product:", response.data);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

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

    const onFinish = async (values: IProductCreate) => {
        console.log("Submitting data:", values);
        try {
            await http_common.put(`/api/Dashboard/UpdateProduct/${id}`, values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            notification.success({ message: "Product updated successfully!" });
            navigate("/admin/allproducts");
        } catch (error) {
            console.error("Error updating product:", error);
            notification.error({ message: "Failed to update product." });
        }
    };

   /* const handleUploadChange = async (info: UploadChangeParam<UploadFile<RcFile>>) => {
        if (info.file.status === 'done') {
            // Коли файл успішно завантажений
            try {
                const imageFormData = new FormData();
                imageFormData.append('images', info.file.originFileObj as RcFile);

                await http_common.put(`/api/Dashboard/AddProductImages/${id}`, imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                notification.success({ message: "Image uploaded successfully!" });
            } catch (error) {
                console.error("Error uploading image:", error);
                notification.error({ message: "Failed to upload image." });
            }
        }
    };*/

    const categoriesOptions = categories.map(item => ({ label: item.name, value: item.id }));
    const brandsOptions = brands.map(item => ({ label: item.name, value: item.id }));
    const sizesOptions = sizes.map(item => ({ label: item.label, value: item.value }));

    const handleRemove = async (file: UploadFile) => {
        // Створюємо новий масив imageUrls без видаленого зображення
        const newImageUrls = product?.imageUrls.filter((imgPath) => {
            return `${import.meta.env.VITE_API_URL}product/${imgPath}` !== file.url;
        });

        // Оновлюємо стан продукту із новим списком зображень


        // @ts-ignore
        setProduct(prevProduct => ({
            ...prevProduct,
            imageUrls: newImageUrls,
        }));

        try {
            // Виконуємо запит на видалення зображення на бекенді
            const imageToRemove = product?.imageUrls.find(imgPath => `${import.meta.env.VITE_API_URL}product/${imgPath}` === file.url);
            if (imageToRemove) {
                await http_common.delete(`/api/Dashboard/DeleteImage`, { data: { imagePath: imageToRemove } });
                notification.success({ message: "Image deleted successfully!" });
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            notification.error({ message: "Failed to delete image." });
        }
    };




    return (
        <>
            <div className="centered-div">
                <ProfileDefaultHeader backLink="/admin/allproducts"/>
            </div>

            <div className="main-container">
                <DefaultAdminSideBar/>
                <div className="content-container">
                    <div className="div-with-text">
                        <h2>Edit Product</h2>
                    </div>
                    {product && (
                        <Form
                            initialValues={product}
                            onFinish={onFinish}
                            layout="vertical"
                            style={{
                                minWidth: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: 20,
                            }}
                        >
                            <div className="widthdiv">
                                <Form.Item label="Product Name" name="name">
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Description" name="description">
                                    <Input.TextArea/>
                                </Form.Item>
                                <Form.Item label="Category" name="categoryId">
                                    <Select options={categoriesOptions}/>
                                </Form.Item>
                                <Form.Item label="Size" name="size">
                                    <Select options={sizesOptions}/>
                                </Form.Item>
                                <Form.Item label="Color" name="color">
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Brand" name="brandId">
                                    <Select options={brandsOptions}/>
                                </Form.Item>
                                <Form.Item label="Gender" name="gender">
                                    <Select
                                        options={genders.map(gender => ({ label: gender.label, value: gender.value }))}
                                    />
                                </Form.Item>
                                <Form.Item label="SizeAndFit" name="sizeAndFit">
                                    <Input.TextArea/>
                                </Form.Item>
                                <Form.Item label="LookAfterMe" name="lookAfterMe">
                                    <Input.TextArea/>
                                </Form.Item>
                                <Form.Item label="AboutMe" name="aboutMe">
                                    <Input.TextArea/>
                                </Form.Item>
                                <Form.Item label="Amount" name="amount">
                                    <InputNumber/>
                                </Form.Item>
                                <Form.Item label="Price" name="price">
                                    <InputNumber/>
                                </Form.Item>

                                <div className="image-upload-container">
                                    <Form.Item
                                        label="Images"
                                        name="imageUrls"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e: UploadChangeParam<UploadFile<RcFile>>) => {
                                            return e.fileList ? e.fileList.map(file => file.originFileObj as RcFile) : [];
                                        }}
                                        rules={[{ required: true, message: 'Choose images for the product!' }]}
                                    >
                                        <div>


                                            <Upload
                                                listType="picture-card"
                                                maxCount={10}
                                                accept="image/*"
                                                beforeUpload={async (file) => {
                                                    const formData = new FormData();
                                                    formData.append('images', file);

                                                    try {
                                                        await http_common.put(`/api/Dashboard/AddProductImages/${id}`, formData, {
                                                            headers: {
                                                                'Content-Type': 'multipart/form-data',
                                                            },
                                                        });


                                                        window.location.reload();
                                                    } catch (error) {
                                                        console.error("Error uploading image:", error);
                                                        notification.error({ message: "Failed to upload image." });
                                                    }

                                                    return false;
                                                }}
                                                showUploadList={{ showPreviewIcon: false }}
                                                // @ts-ignore
                                                fileList={[
                                                    ...(product && product.imageUrls ? product.imageUrls.map((imgPath, index) => ({
                                                        uid: index.toString(),
                                                        name: `Product ${index}`,
                                                        status: 'done',
                                                        url: `${import.meta.env.VITE_API_URL}product/${imgPath}`,
                                                    })) : []),

                                                ]}
                                                onRemove={handleRemove}
                                            >
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                            </Upload>
                                        </div>
                                    </Form.Item>
                                </div>
                            </div>
                            <Form.Item>
                                <Button type="default" htmlType="submit">
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </div>
            </div>
        </>
    );
};

export default UpdateProduct;
