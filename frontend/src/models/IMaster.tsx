import { CustomerInterface } from "./ICustomer";
import { DetailInterface } from "./IDetail";
import { ProductInterface } from "./IProduct";

export interface MasterInterface{
    ID:             number,
    CustomerID:     number,
    Customer:       CustomerInterface,
    ProductID:      number,
    Product:        ProductInterface,
    Doc_date:       Date,
    DetailID:       number,
    Detail:         DetailInterface,
    Sys_date:       Date,
    Amount:         number,
    Cost_tot:       number,
}