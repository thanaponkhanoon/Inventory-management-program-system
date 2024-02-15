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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react";
import { HeaderInterface } from "../models/IHeader";
import { CustomerInterface } from "../models/ICustomer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,

    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function HeaderCreate() {
    const [order_date, setOrder_date] = useState<Date | null>();
    const [header, setHeader] = useState<
        Partial<HeaderInterface>
    >({});
    const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
    const [error, setError] = useState(false);
    const [customer, setCustomer] = useState<CustomerInterface[]>([]);
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
        const id = event.target.id as keyof typeof header;
        const { value } = event.target;
        setHeader({ ...header, [id]: value });
    };

    const handleChange = (event: SelectChangeEvent<number>) => {
        const name = event.target.name as keyof typeof header;
        console.log(event.target.name);
        console.log(event.target.value);
        const { value } = event.target;
        setHeader({ ...header, [name]: value });
    };

    function submit() {
        let data = {
            //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
            Order_no: Number(header.Order_no) ?? "",
            CustomerID: Number(header.CustomerID),
            Order_date: order_date?.toISOString(),
        };
        console.log(data);

        const apiUrl = "http://localhost:8080/header";
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
    useEffect(() => {
        GetAllCustomer();
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
                            สถานะ เพิ่มรายการส่วน Hedader การรับคำสั่งซื้อสินค้า
                        </Typography>
                    </Box>
                </Box>

                <Divider />
                <Grid container spacing={3} sx={{ padding: 2 }}>

                    <Grid item xs={10}>
                        <FormControl fullWidth variant="standard">
                            <p>รหัสและชื่อ ลูกค้า</p>
                            <Select
                                native
                                value={header.CustomerID}
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
                                            รหัสลูกค้า {item.Cus_id} ชื่อลูกค้า {item.Cus_name}
                                        </option>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl fullWidth variant="standard">
                            <p>ลำดับ</p>
                            <TextField
                                id="Order_no"
                                variant="standard"
                                type="number"
                                size="medium"
                                value={header.Order_no || ""}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="standard">
                            <p>วันที่สั่งซื้อสินค้า</p>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="วันที่สั่งซื้อ"
                                    value={order_date}
                                    onChange={(date) => setOrder_date(date)}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            component={RouterLink}
                            to="/headerdetail"
                            variant="contained"
                        >
                            กลับ
                        </Button>

                        <Button
                            component={RouterLink}
                            to="/detailcreate"
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

export default HeaderCreate;