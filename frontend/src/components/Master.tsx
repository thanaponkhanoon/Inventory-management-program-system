import React from "react";
import { useEffect, useState, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import moment from "moment";
import { MasterInterface } from "../models/IMaster";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,

    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Master() {
    const [master, setMaster] = useState<
        MasterInterface[]
    >([]);

    const [selectcellData, setSelectcellData] =
        useState<MasterInterface>();
    const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
    const [error, setError] = useState(false);
    const [opendelete, setOpenDelete] = useState(false);
    const [openedit, setOpenEdit] = useState(false);

    const handleCellFocus = useCallback(
        //การเรียกใช้ระหว่าง component
        (event: React.FocusEvent<HTMLDivElement>) => {
            const row = event.currentTarget.parentElement;
            const id = row?.dataset.id;
            const selectedMaster = master.find((v) => Number(v.ID) === Number(id));
            console.log(selectedMaster);
            setSelectcellData(selectedMaster);
        },
        [master]
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

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };
    const handleEditClose = () => {
        setOpenEdit(false);
    };
    const DeleteDetail = async (id: Number) => {
        const apiUrl = `http://localhost:8080/master/${id}`;
        const requestOptions = {
            method: "DELETE",
        };

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())

            .then((res) => {
                //ตรงนี้คือลบในดาต้าเบสสำเร็จแล้ว
                if (res.data) {
                    setSuccess(true);
                    const remove = master.filter(
                        //กรองเอาข้อมูลที่ไม่ได้ลบ
                        (perv) => perv.ID !== selectcellData?.ID
                    );
                    setMaster(remove);
                } else {
                    setError(true);
                }
            });
    };

    const GetAllMaster = async () => {
        const apiUrl = "http://localhost:8080/master";

        const requestOptions = {
            method: "GET",
        };

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())

            .then((res) => {
                console.log(res.data);

                if (res.data) {
                    setMaster(res.data);
                }
            });
    };

    const columns: GridColDef[] = [
        { field: "ID", headerName: "ลำดับ", width: 20 },
        {
            field: "Customerdetails",
            headerName: "รายละเอียดลูกค้า",
            width: 200,
            valueGetter: (params) => {
                const cusId = params.row.Customer.Cus_id;
                const cusName = params.row.Customer.Cus_name;
                return `${cusId} - ${cusName}`;
            },
        },
        {
            field: "Productdetails",
            headerName: "รายละเอียดสินค้า",
            width: 200,
            valueGetter: (params) => {
                const ProductId = params.row.Product.Product_id;
                const ProductName = params.row.Product.Product_name;
                return `${ProductId} - ${ProductName}`;
            },
        },
        {
            field: "Order_date",
            headerName: "วันที่สั่ง",
            width: 120,
            valueGetter: (params) => {
                return moment(params.row.Detail.Header.Order_date).format('DD/MM/YYYY');
            },
        },
        {
            field: "Order_no",
            headerName: "เลขที่สั่ง",
            width: 80,
            valueGetter: (params) => {
                return params.row.Detail.Header.Order_no;
            },
        },
        {
            field: "Ord_date",
            headerName: "วันกำหนดส่ง",
            width: 120,
            valueGetter: (params) => {
                return moment(params.row.Detail.Ord_date).format('DD/MM/YYYY');
            },
        },
        {
            field: "Amount",
            headerName: "จำนวน",
            width: 100,
            valueGetter: (params) => {
                return params.row.Detail.Amount;
            },
        },
        {
            field: "Cost_unit",
            headerName: "ราคา/หน่วย",
            width: 100,
            valueGetter: (params) => {
                return params.row.Product.Cost_unit;
            },
        },
        {
            field: "TOT_PRC",
            headerName: "ราคารวม",
            width: 100,
            valueGetter: (params) => {
                return params.row.Detail.TOT_PRC;
            },
        },
    ];

    useEffect(() => {
        GetAllMaster();
    }, []);

    return (
        <div>
            <Container maxWidth="lg">
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
                            แสดงข้อมูล การสั่งซื้อสินค้า
                        </Typography>
                    </Box>
                </Box>

                <div style={{ height: 300, width: "100%", marginTop: "20px" }}>
                    <DataGrid
                        rows={master}
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

export default Master;