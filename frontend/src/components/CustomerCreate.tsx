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
import { useState } from "react";
import { CustomerInterface } from "../models/ICustomer";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,

    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomerCreate() {
    const [customer, setCustomer] = useState<
        Partial<CustomerInterface>
    >({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
    const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
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
        const id = event.target.id as keyof typeof customer; //
        // console.log(event.target.id);
        // console.log(event.target.value);

        const { value } = event.target;

        setCustomer({ ...customer, [id]: value });
    };

    function submit() {
        let data = {
            //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
            Customer_id: customer.Customer_id ?? "",
            Custome_name: customer.Custome_name ?? "",
        };
        console.log(data);

        const apiUrl = "http://localhost:8080/customer";
        const requestOptions = {
            method: "POST", //เอาข้อมูลไปเก็บไว้ในดาต้าเบส
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
                            การบันทึก ข้อมูลสินค้า
                        </Typography>
                    </Box>
                </Box>

                <Divider />
                <Grid container spacing={3} sx={{ padding: 2 }}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="standard">
                            <p>รหัสลูกค้า</p>
                            <TextField
                                id="Customer_id"
                                variant="standard"
                                type="string"
                                size="medium"
                                value={customer.Customer_id || ""}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="standard">
                            <p>ชื่อลูกค้า</p>
                            <TextField
                                id="Custome_name"
                                variant="standard"
                                type="string"
                                size="medium"
                                value={customer.Custome_name || ""}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            component={RouterLink}
                            to="/customer"
                            variant="contained"
                        >
                            กลับ
                        </Button>

                        <Button
                            component={RouterLink}
                            to="/customer"
                            style={{ float: "right" }}
                            onClick={submit}
                            variant="contained"
                            color="success"
                        >
                            บันทึกข้อูลสินค้า
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default CustomerCreate;