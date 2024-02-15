import React from "react";
import { useEffect, useState, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { DetailInterface } from "../models/IDetail";
import moment from "moment";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,

    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Report() {
    const [detail, setDetail] = useState<
        DetailInterface[]
    >([]);

    const [selectcellData, setSelectcellData] =
        useState<DetailInterface>();
    const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
    const [error, setError] = useState(false);
    const [opendelete, setOpenDelete] = useState(false);
    const [openedit, setOpenEdit] = useState(false);

    const handleCellFocus = useCallback(
        //การเรียกใช้ระหว่าง component
        (event: React.FocusEvent<HTMLDivElement>) => {
            const row = event.currentTarget.parentElement;
            const id = row?.dataset.id;
            const selectedDetail = detail.find((v) => Number(v.ID) === Number(id));
            console.log(selectedDetail);
            setSelectcellData(selectedDetail);
        },
        [detail]
    );
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
    const handleClickDelete = () => {
        // setSelectCell(selectcell);
        DeleteDetail(Number(selectcellData?.ID));

        setOpenDelete(false);
    };
    // const handleDelete = () => {
    //     setOpenDelete(true);
    // };
    // const handleEdit = () => {
    //     setOpenEdit(true);
    // };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };
    const handleEditClose = () => {
        setOpenEdit(false);
    };
    const DeleteDetail = async (id: Number) => {
        const apiUrl = `http://localhost:8080/detail/${id}`;
        const requestOptions = {
            method: "DELETE",
        };

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())

            .then((res) => {
                //ตรงนี้คือลบในดาต้าเบสสำเร็จแล้ว
                if (res.data) {
                    setSuccess(true);
                    const remove = detail.filter(
                        //กรองเอาข้อมูลที่ไม่ได้ลบ
                        (perv) => perv.ID !== selectcellData?.ID
                    );
                    setDetail(remove);
                } else {
                    setError(true);
                }
            });
    };

    const GetAllDetail = async () => {
        const apiUrl = "http://localhost:8080/detail";

        const requestOptions = {
            method: "GET",
        };

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())

            .then((res) => {
                console.log(res.data);

                if (res.data) {
                    setDetail(res.data);
                }
            });
    };

    const columns: GridColDef[] = [
        {
            field: "Ord_date",
            headerName: "ระหว่างวันทื่ส่งสินค้า",
            width: 180,
            valueFormatter: (params) => moment(params.value.Ord_date).format('DD/MM/YYYY')
        },
        {
            field: "Fin_date",
            headerName: "วัถึงวันที่",
            width: 180,
            valueFormatter: (params) => moment(params.value.Fin_date).format('DD/MM/YYYY')
        },
        {
            field: "actions",
            headerName: "การจัดการข้อมูล",
            width: 175,
            renderCell: () => (
                <div>
                    <Button
                        component={RouterLink}
                        to="/detailcreate"
                        variant="contained"
                        color="success"
                    >
                        ตกลง
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button
                        component={RouterLink}
                        to="/home"
                        variant="contained"
                        color="error"
                    >
                        ยกเลิก
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        GetAllDetail();
    }, []);

    return (
        <div>
            <Container maxWidth="sm">
                <Snackbar
                    open={success}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleClose} severity="success">
                        ลบข้อมูลสำเร็จ
                    </Alert>
                </Snackbar>

                <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        ลบข้อมูลไม่สำเร็จ
                    </Alert>
                </Snackbar>
                <Dialog
                    open={opendelete}
                    onClose={handleDeleteClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"คุณต้องการลบใช่หรือไม่?"}
                    </DialogTitle>

                    <DialogActions>
                        <Button onClick={handleDeleteClose}>ยกเลิก</Button>
                        <Button onClick={handleClickDelete} autoFocus>
                            ตกลง
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openedit}
                    onClose={handleEditClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {/* <DialogActions>
                        <HeaderEdit
                            Cancle={handleEditClose}
                            Data={selectcellData}
                        />
                    </DialogActions> */}
                </Dialog>
                <Box
                    display="flex"
                    sx={{
                        marginTop: 2,
                    }}
                >
                    <Box flexGrow={1}>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="primary"
                            gutterBottom
                        >
                            การประมวลผลข้อมูลสั่งซื้อสินค้า
                        </Typography>
                    </Box>

                    {/* <Box>
                        <Button
                            component={RouterLink}
                            to="/headercreate"
                            variant="contained"
                            color="primary"
                        >
                            เพิ่มข้อมูลการสั่งซื้อสั่งซื้อสินค้า
                        </Button>
                    </Box> */}
                </Box>

                <div style={{ height: 300, width: "100%", marginTop: "20px" }}>
                    <DataGrid
                        rows={detail}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        componentsProps={{
                            cell: {
                                onFocus: handleCellFocus,
                            },
                        }}

                    />
                </div>
            </Container>
        </div>
    );
}

export default Report;