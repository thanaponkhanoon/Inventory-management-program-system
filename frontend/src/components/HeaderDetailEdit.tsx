import React from "react";
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

interface Detail {
    Cancle: () => void;
    Data: DetailInterface | undefined;
}

function HeaderDetailEdit({ Cancle, Data }: Detail) {
    const [ord_date, setOrd_date] = useState<Date | null>();
    const [fin_date, setFin_date] = useState<Date | null>();
    const [detail, setDetail] = useState<
        Partial<DetailInterface>
    >({
        ID: Data?.ID,
        HeaderID:   Data?.ID,
        ProductID:  Data?.ProductID,
        CustomerID: Data?.CustomerID,
        Ord_date:   Data?.Ord_date,
        Fin_date:   Data?.Fin_date,
        Amount:     Data?.Amount,
        TOT_PRC:    Data?.TOT_PRC,
    });
    const [header, setHeader] = useState<HeaderInterface[]>([]);
    const [customer, setCustomer] = useState<CustomerInterface[]>([]);
    const [product, setProduct] = useState<ProductInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
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
        setDetail({ ...detail, [id]: value });
    };

    const handleChange = (event: SelectChangeEvent<number>) => {
        const name = event.target.name as keyof typeof detail;
        const { value } = event.target;
        setDetail({ ...detail, [name]: value });
    };

    function submit() {
        let data = {
            ID: Number(detail.ID),
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
            method: "PATCH",
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
                        </Typography>
                    </Box>
                </Box>

                <Divider />
                <Grid container spacing={3} sx={{ padding: 2 }}>

                <Grid item xs={10}>
                        <FormControl fullWidth variant="standard">
                            <p>รหัส/ชื่อ ลูกค้า</p>
                            <Select
                                native
                                value={detail.CustomerID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "CustomerID",
                                }}
                            >
                                <option aria-label="None" value=""></option>
                                {customer.map((item) => (
                                    <option value={item.ID} key={item.ID}>
                                        รหัสลูกค้า {item.Cus_id} ชื่อลูกค้า {item.Cus_name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl fullWidth variant="standard">
                            <p>ลำดับ</p>
                            <Select
                                native
                                value={detail.HeaderID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "HeaderID",
                                }}
                            >
                                <option aria-label="None" value=""></option>
                                {header.map((item) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.Order_no}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={7}>
                        <FormControl fullWidth variant="standard">
                            <p>วันที่สั่งซื้อสินค้า</p>
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
                                            {`วันที่สั่ง ${moment(item.Order_date).format('DD/MM/YYYY')}`}
                                        </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            onClick={Cancle}
                        >
                            กลับ
                        </Button>

                        <Button
                            style={{ float: "right" }}
                            onClick={submit}
                            variant="contained"
                            color="success"
                        >
                            บันทึกการจัดซื้อ
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
export default HeaderDetailEdit;