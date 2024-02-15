import React from "react";
import { Link as RouterLink } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react";
import { HeaderInterface } from "../models/IHeader";
import { CustomerInterface } from "../models/ICustomer";
import { DetailInterface } from "../models/IDetail";
import { ProductInterface } from "../models/IProduct";
import moment from 'moment';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,

    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DetailCreate() {
    const [ord_date, setOrd_date] = useState<Date | null>();
    const [fin_date, setFin_date] = useState<Date | null>();
    const [detail, setDetail] = useState<
        Partial<DetailInterface>
    >({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
    const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
    const [error, setError] = useState(false);
    const [header, setHeader] = useState<HeaderInterface[]>([]);
    const [customer, setCustomer] = useState<CustomerInterface[]>([]);
    const [product, setProduct] = useState<ProductInterface[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = (
        event?: React.SyntheticEvent | Event,

        reason?: string
    ) => {
        console.log(reason);
        if (reason === "clickaway") {
            return;
        }

        setSuccess(false);

        setError(false);
    };

    const handleInputChange = (
        event: React.ChangeEvent<{ id?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
    ) => {
        const id = event.target.id as keyof typeof detail;
        const { value } = event.target;
        // ตรวจสอบว่าเมื่อมีการเปลี่ยนแปลงใน Amount หรือ Cost_unit หรือไม่
        if (id === 'Amount' || id === 'ProductID') {
            // หาค่า Cost_unit ของสินค้าจาก detail.ProductID
            const selectedProduct = product.find(product => product.ID === Number(detail.ProductID));
            const costUnit = selectedProduct ? selectedProduct.Cost_unit : 0;

            // คำนวณ TOT_PRC
            const calculatedTOT_PRC = Number(value) * costUnit;

            // เซ็ทค่าใหม่ให้กับ detail
            setDetail({ ...detail, [id]: value, TOT_PRC: calculatedTOT_PRC });
        } else {
            // ถ้าไม่ได้เปลี่ยนแปลง Amount หรือ Cost_unit ให้เซ็ทค่าตามปกติ
            setDetail({ ...detail, [id]: value });
        }
    };

    const handleChange = (event: SelectChangeEvent<number>) => {
        const name = event.target.name as keyof typeof detail;
        const { value } = event.target;
        setDetail({ ...detail, [name]: value });
    };

    function submit() {
        let data = {
            //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
            HeaderID: Number(detail.HeaderID),
            CustomerID: Number(detail.CustomerID),
            ProductID: Number(detail.ProductID),
            Ord_date: ord_date?.toISOString(),
            Fin_date: fin_date?.toISOString(),
            Amount: Number(detail.Amount) ?? "",
            TOT_PRC: Number(detail.TOT_PRC) ?? "",

        };
        console.log(data);

        const apiUrl = "http://localhost:8080/detail";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                if (res.data) {
                    console.log("บันทึกได้");
                    setSuccess(true);
                    window.location.reload();
                    setErrorMessage("");
                } else {
                    console.log("บันทึกไม่ได้");
                    setError(true);
                    setErrorMessage(res.error);
                }
            });
    }
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    const GetAllCustomer = async () => {
        const apiUrl = "http://localhost:8080/customer";

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())

            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setCustomer(res.data);
                }
            });
    };
    const GetAllProduct = async () => {
        const apiUrl = "http://localhost:8080/product";

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())

            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setProduct(res.data);
                }
            });
    };
    const GetAllHeader = async () => {
        const apiUrl = "http://localhost:8080/header";

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())

            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setHeader(res.data);
                }
            });
    };
    useEffect(() => {
        GetAllCustomer();
        GetAllProduct();
        GetAllHeader();
    }, []);

    return (
        <Container maxWidth="md">
            <Snackbar
                id="success"
                open={success}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="success">
                    บันทึกสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar
                id="error"
                open={error}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="error">
                    บันทึกไม่สำเร็จ: {errorMessage}
                </Alert>
            </Snackbar>

            <Paper>
                <Box
                    display="flex"
                    sx={{
                        marginTop: 2,
                    }}
                >
                    <Box sx={{ paddingX: 2, paddingY: 1 }}>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="primary"
                            gutterBottom
                        >
                            การบันทึก/แก้ไข การสั่งซื้อสินค้า
                            <br></br>
                            สถานะ เพิ่มรายการส่วน Detail การรับคำสั่งซื้อสินค้า
                        </Typography>
                    </Box>
                </Box>

                <Divider />
                <Grid container spacing={3} sx={{ padding: 2 }}>

                    <Grid item xs={5}>
                        <FormControl fullWidth variant="standard">
                            <p>เพิ่มข้อมูลในส่วนของ Deatial</p>
                            <Select
                                native
                                value={detail.CustomerID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "CustomerID", //เอาไว้เข้าถึงข้อมูล
                                }}
                            >
                                <option aria-label="None" value=""></option>
                                {customer.map(
                                    (
                                        item: CustomerInterface //map
                                    ) => (
                                        <option value={item.ID} key={item.ID}>
                                            รหัสสินค้า {item.Cus_id} ชื่อสินค้า {item.Cus_name}
                                        </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={7}>
                        <FormControl fullWidth variant="standard">
                            <p>-</p>
                            <Select
                                native
                                value={detail.HeaderID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "HeaderID", //เอาไว้เข้าถึงข้อมูล
                                }}
                            >
                                <option aria-label="None" value=""></option>
                                {header.map(
                                    (
                                        item: HeaderInterface //map
                                    ) => (
                                        <option value={item.ID} key={item.ID}>
                                            {`วันที่สั่ง ${moment(item.Order_date).format('DD/MM/YYYY')} Order NO ${item.Order_no}`}
                                        </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={8}>
                        <FormControl fullWidth variant="standard">
                            <p>รหัสและรายละเอียดสินค้า</p>
                            <Select
                                native
                                value={detail.ProductID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "ProductID", //เอาไว้เข้าถึงข้อมูล
                                }}
                            >
                                <option aria-label="None" value=""></option>
                                {product.map(
                                    (
                                        item: ProductInterface //map
                                    ) => (
                                        <option value={item.ID} key={item.ID}>
                                            รหัสสินค้า {item.Product_id} ชื่อสินค้า {item.Product_name} ราคาต่อหน่วย {item.Cost_unit}
                                        </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                            <p>จำนวนที่สั่ง</p>
                            <TextField
                                id="Amount"
                                variant="standard"
                                type="number"
                                size="medium"
                                value={detail.Amount || ""}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                            <p>วันกำหนดส่ง</p>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="วันกำหนดส่ง"
                                    value={ord_date}
                                    onChange={(date) => setOrd_date(date)}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                            <p>วันที่ส่งสินค้าจริง</p>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="วันที่ส่งสินค้าจริง"
                                    value={fin_date}
                                    onChange={(date) => setFin_date(date)}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                            <p>ราคารวม</p>
                            <TextField
                                id="TOT_PRC"
                                variant="standard"
                                type="number"
                                size="medium"
                                value={detail.TOT_PRC || ""}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            component={RouterLink}
                            to="/"
                            variant="contained"
                        >
                            ออก
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/headerdetail"
                            variant="contained"
                        >
                            กลับไปยังหน้าจอแสดงรายการสั่งสินค้า
                        </Button>

                        <Button
                            component={RouterLink}
                            to="/detail"
                            style={{ float: "right" }}
                            onClick={submit}
                            variant="contained"
                            color="success"
                        >
                            เพิ่มรายการ
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default DetailCreate;