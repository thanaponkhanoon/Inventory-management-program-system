import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from '@mui/icons-material/Logout';

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

const menu = [
  { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
];

function Navbar() {
  const [open, setOpen] = React.useState(false);
  const signOut = () => {
    localStorage.clear()
    window.location.href = "/";
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl1);
  const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const open3 = Boolean(anchorEl2);
  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const [anchorEl3, setAnchorEl3] = React.useState<null | HTMLElement>(null);
  const open4 = Boolean(anchorEl3);
  const handleClick3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            ระบบโปรแกรมบริหารจัดการสินค้าคงคลัง
          </Typography>
        </Toolbar>
        <hr></hr>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <div>
            <Button
              id="basic-button"
              variant="contained"
              color="primary"
              aria-controls={open1 ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open1 ? 'true' : undefined}
              onClick={handleClick}
            >
              ฐานข้อมูลอ้างอิง
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open1}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem component={RouterLink} to="/customer" onClick={handleClose}>บันทึก/แก้ไข ข้อมูลลูกค้า</MenuItem>
              <MenuItem component={RouterLink} to="/product" onClick={handleClose}>บันทึก/แก้ไข ข้อมูลสินค้า</MenuItem>
            </Menu>
          </div>
          <div>
            <Button
              id="basic-button"
              variant="contained"
              color="primary"
              aria-controls={open2 ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open2 ? 'true' : undefined}
              onClick={handleClick1}
            >
              การทำงานประจำวัน
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl1}
              open={open2}
              onClose={handleClose1}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem component={RouterLink} to="/order" onClick={handleClose1}>บันทึก/แก้ไข การสั่งซื้อสินค้า</MenuItem>
              <MenuItem component={RouterLink} to="/process" onClick={handleClose1}>การประมวลผลข้อมูลการสั่งซื้อ</MenuItem>
            </Menu>
          </div>
          <div>
            <Button
              id="basic-button"
              variant="contained"
              color="primary"
              aria-controls={open3 ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open3 ? 'true' : undefined}
              onClick={handleClick2}
            >
              รายงาน
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl2}
              open={open3}
              onClose={handleClose2}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem component={RouterLink} to="/report" onClick={handleClose2}>รายงานกำหนดส่งสินค้า</MenuItem>
            </Menu>
          </div>
          <div>
            <Button
              id="basic-button"
              variant="contained"
              color="primary"
              aria-controls={open4 ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open4 ? 'true' : undefined}
              onClick={handleClick3}
            >
              ออกจากระบบ
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl3}
              open={open4}
              onClose={handleClose3}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={signOut}>ออกจากระบบโปรแกรม</MenuItem>
            </Menu>
          </div>
        </Toolbar>
        <Drawer variant="temporary" open={open} onClose={() => setOpen(false)}>
          <List>
            {menu.map((item, index) => (
              <Link
                to={item.path}
                key={item.name}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem button>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              </Link>
            ))}
            <ListItem button onClick={signOut}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="ออกจากระบบ" />
            </ListItem>
          </List>
        </Drawer>
      </AppBar>
    </Box>

  );
}
export default Navbar;