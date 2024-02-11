import React from "react";
import { useEffect, useState, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { CustomerInterface } from "../models/ICustomer";
import CustomerEdit from "./CustomerEdit";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,

    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Customer() {
    const [customer, setCustomer] = useState<
        CustomerInterface[]
    >([]);

    const [selectcellData, setSelectcellData] =
        useState<CustomerInterface>();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [opendelete, setOpenDelete] = useState(false);
    const [openedit, setOpenEdit] = useState(false);

    const handleCellFocus = useCallback(
        (event: React.FocusEvent<HTMLDivElement>) => {
            const row = event.currentTarget.parentElement;
            const id = row?.dataset.id;
            const selectedCustomer = customer.find((v) => Number(v.ID) === Number(id));
            console.log(selectedCustomer);
            setSelectcellData(selectedCustomer);
        },
        [customer]
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
        DeleteCustomer(Number(selectcellData?.ID));

        setOpenDelete(false);
    };
    const handleDelete = () => {
        setOpenDelete(true);
    };
    const handleEdit = () => {
        setOpenEdit(true);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };
    const handleEditClose = () => {
        setOpenEdit(false);
    };
    const DeleteCustomer = async (id: Number) => {
        const apiUrl = `http://localhost:8080/customer/${id}`;
        const requestOptions = {
            method: "DELETE",
          };
      
          fetch(apiUrl, requestOptions)
            .then((response) => response.json())
      
            .then((res) => {
              //ตรงนี้คือลบในดาต้าเบสสำเร็จแล้ว
              if (res.data) {
                setSuccess(true);
                const remove = customer.filter(
                  //กรองเอาข้อมูลที่ไม่ได้ลบ
                  (perv) => perv.ID !== selectcellData?.ID
                );
                setCustomer(remove);
              } else {
                setError(true);
              }
            });
    };

    const GetAllCustomer = async () => {
        const apiUrl = "http://localhost:8080/customer";

        const requestOptions = {
            method: "GET",
        };

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())

            .then((res) => {
                console.log(res.data);

                if (res.data) {
                    setCustomer(res.data);
                }
            });
    };

    const columns: GridColDef[] = [
        { field: "ID", headerName: "ลำดับ", width: 70 },
        {
            field: "Customer_id",
            headerName: "รหัสลูกค้า",
            width: 120,
        },
        {
            field: "Custome_name",
            headerName: "ชื่อลูกค้า",
            width: 150
        },
        {
            field: "actions",
            headerName: "การจัดการข้อมูล",
            width: 175,
            renderCell: () => (
                <div>
                    <Button
                        onClick={handleEdit}
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        color="success"
                    >
                        แก้ไข
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        size="small"
                        startIcon={<DeleteIcon />}
                        color="error"
                    >
                        ลบ
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        GetAllCustomer();
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
                    <DialogActions>
                        <CustomerEdit
                            Cancle={handleEditClose}
                            Data={selectcellData}
                        />
                    </DialogActions>
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
                            การบันทึก/แก้ไข ข้อมูลลูกค้า
                        </Typography>
                    </Box>

                    <Box>
                        <Button
                            component={RouterLink}
                            to="/customercreate"
                            variant="contained"
                            color="primary"
                        >
                            เพิ่มข้อลูกค้า
                        </Button>
                    </Box>
                </Box>

                <div style={{ height: 300, width: "100%", marginTop: "20px" }}>
                    <DataGrid
                        rows={customer}
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

export default Customer;